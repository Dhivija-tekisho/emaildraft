import os
import ssl
import base64
from email.message import EmailMessage
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
        if not values.text and not values.html:
            raise ValueError("Either 'text' or 'html' content is required.")
        return values


app = FastAPI(title="Email Draft SMTP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/send-email")
async def send_email(payload: EmailRequest):
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
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {exc}") from exc

