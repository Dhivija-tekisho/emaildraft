import os
import ssl
import base64
import re
from email.message import EmailMessage
from typing import List, Optional
from urllib.parse import urlencode

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field, model_validator
import aiosmtplib
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "localhost")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER or "no-reply@example.com")
SMTP_SECURE = os.getenv("SMTP_SECURE", "true").lower() == "true"

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080").split(",")
ALLOWED_FROM_DOMAIN = os.getenv("ALLOWED_FROM_DOMAIN")  # e.g., example.com


class Attachment(BaseModel):
    name: str
    type: str
    data: str  # base64 data URL (data:type/subtype;base64,...)

class EmailRequest(BaseModel):
    to: List[EmailStr] = Field(..., min_items=1)
    cc: Optional[List[EmailStr]] = None
    bcc: Optional[List[EmailStr]] = None
    subject: str = Field(..., min_length=1)
    text: Optional[str] = None
    html: Optional[str] = None
    from_email: Optional[EmailStr] = None
    from_name: Optional[str] = None
    attachments: Optional[List[Attachment]] = None

    @model_validator(mode="after")
    def ensure_body(cls, values):
        # Check if text or html has actual content (not just empty strings)
        text_content = values.text and values.text.strip()
        html_content = values.html and values.html.strip()
        if not text_content and not html_content:
            raise ValueError("Either 'text' or 'html' content is required and must not be empty.")
        return values


class GmailComposeRequest(BaseModel):
    to: Optional[str] = None
    cc: Optional[str] = None
    bcc: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None  # HTML body
    attachments: Optional[List[Attachment]] = None
    
    @model_validator(mode="after")
    def validate_request(cls, values):
        # At least one field should be provided
        if not any([values.to, values.cc, values.bcc, values.subject, values.body]):
            raise ValueError("At least one field (to, cc, bcc, subject, or body) must be provided")
        return values


app = FastAPI(title="Email Draft SMTP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Provide detailed validation error messages."""
    errors = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"])
        msg = error["msg"]
        errors.append(f"{field}: {msg}")
    
    error_message = "Validation error: " + "; ".join(errors)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": error_message, "errors": exc.errors()},
    )


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/send-email")
async def send_email(payload: EmailRequest):
    # FastAPI will automatically validate the request and return 422 if validation fails
    # This will only execute if validation passes
    # Optional domain guard for custom from_email
    if payload.from_email and ALLOWED_FROM_DOMAIN:
        if not str(payload.from_email).lower().endswith("@" + ALLOWED_FROM_DOMAIN.lower()):
            raise HTTPException(status_code=400, detail="from_email not allowed for this domain")

    sender_email = str(payload.from_email or SMTP_FROM)
    sender_name = (payload.from_name or "").strip() or None

    message = EmailMessage()
    message["From"] = f"{sender_name} <{sender_email}>" if sender_name else sender_email
    message["To"] = ", ".join(payload.to)
    if payload.cc:
        message["Cc"] = ", ".join(payload.cc)
    if payload.bcc:
        message["Bcc"] = ", ".join(payload.bcc)
    message["Subject"] = payload.subject

    if payload.text:
        message.set_content(payload.text)
    if payload.html:
        message.add_alternative(payload.html, subtype="html")

    # Add attachments if provided
    if payload.attachments:
        for attachment in payload.attachments:
            # Extract base64 data from data URL (data:type/subtype;base64,data...)
            data_url = attachment.data
            if data_url.startswith('data:'):
                # Parse data URL: data:image/png;base64,iVBORw0KG...
                header, encoded = data_url.split(',', 1)
                # Extract content type from header
                content_type = header.split(';')[0].split(':')[1] if ':' in header else attachment.type or 'application/octet-stream'
            else:
                # Assume it's already base64
                encoded = data_url
                content_type = attachment.type or 'application/octet-stream'
            
            try:
                # Decode base64
                file_data = base64.b64decode(encoded)
                # Add as attachment
                message.add_attachment(
                    file_data,
                    maintype=content_type.split('/')[0],
                    subtype=content_type.split('/')[1] if '/' in content_type else 'octet-stream',
                    filename=attachment.name
                )
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to process attachment '{attachment.name}': {str(e)}")

    try:
        send_kwargs = {
          "hostname": SMTP_HOST,
          "port": SMTP_PORT,
          "username": SMTP_USER,
          "password": SMTP_PASS,
          "start_tls": SMTP_SECURE,
        }
        # Use implicit TLS if port is 465
        if SMTP_SECURE and SMTP_PORT == 465:
            send_kwargs["use_tls"] = True
            send_kwargs["start_tls"] = False

        response = await aiosmtplib.send(message, **send_kwargs)
        return {"status": "sent", "response": response}
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as exc:
        # Convert exception to string properly
        error_msg = str(exc) if exc else "Unknown error"
        raise HTTPException(status_code=500, detail=f"Failed to send email: {error_msg}") from exc


def html_to_plain_text(html: str) -> str:
    """Convert HTML to plain text for Gmail compose."""
    if not html:
        return ""
    
    # Replace HTML line breaks with newlines
    text = html.replace('<br>', '\n').replace('<br/>', '\n').replace('<br />', '\n')
    text = re.sub(r'</p>', '\n', text)
    text = re.sub(r'<p[^>]*>', '', text)
    text = re.sub(r'<strong[^>]*>', '', text)
    text = re.sub(r'</strong>', '', text)
    # Remove all remaining HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Decode HTML entities
    text = text.replace('&nbsp;', ' ')
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&quot;', '"')
    # Clean up multiple newlines
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
    return text.strip()


def normalize_recipients(raw: str) -> List[str]:
    """Normalize recipient string to list of emails."""
    if not raw:
        return []
    return [email.strip() for email in re.split(r'[,;]', raw) if email.strip()]


@app.post("/api/gmail-compose-url")
async def get_gmail_compose_url(payload: GmailComposeRequest):
    """Generate Gmail compose URL with prefilled email data."""
    try:
        # Normalize recipients - handle None values
        to_list = normalize_recipients(payload.to or '')
        cc_list = normalize_recipients(payload.cc or '')
        bcc_list = normalize_recipients(payload.bcc or '')
        
        # Convert HTML body to plain text
        body = html_to_plain_text(payload.body or '')
        
        # Add attachment note if there are attachments
        if payload.attachments and len(payload.attachments) > 0:
            try:
                attachment_names = [att.name for att in payload.attachments]
                body += '\n\n[Files attached: ' + ', '.join(attachment_names) + ' — please attach these files to this message before sending.]'
            except Exception as e:
                # If attachment processing fails, continue without attachment note
                print(f"Warning: Failed to process attachments: {e}")
        
        # Build Gmail compose URL parameters
        params = {}
        if to_list:
            params['to'] = ','.join(to_list)
        if cc_list:
            params['cc'] = ','.join(cc_list)
        if bcc_list:
            params['bcc'] = ','.join(bcc_list)
        if payload.subject:
            params['su'] = payload.subject  # Gmail uses 'su' for subject
        if body:
            params['body'] = body
        
        # Build the Gmail compose URL
        gmail_url = f"https://mail.google.com/mail/?view=cm&fs=1&{urlencode(params)}"
        
        return {"url": gmail_url}
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as exc:
        # Convert exception to string properly
        error_msg = str(exc) if exc else "Unknown error"
        raise HTTPException(status_code=500, detail=f"Failed to generate Gmail compose URL: {error_msg}") from exc

