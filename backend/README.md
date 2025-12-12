# SMTP Backend (FastAPI)

## Setup
1) Create and activate a Python env (optional):
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
```

2) Install dependencies:
```bash
pip install -r requirements.txt
```

3) Configure environment variables (create a `.env` file in `backend/`):
```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=no-reply@example.com
SMTP_SECURE=true          # true enables STARTTLS/implicit TLS
ALLOWED_ORIGINS=http://localhost:8080
```

4) Run the server (defaults to port 8000):
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoint
- `POST /api/send-email`
  - Body:
    ```json
    {
      "to": ["recipient@example.com"],
      "cc": ["optional@example.com"],
      "bcc": [],
      "subject": "Hello",
      "text": "Plain text body",
      "html": "<p>HTML body</p>"
    }
    ```
  - Response: `{ "status": "sent", "response": {...} }`

## Notes
- CORS allowed origins default to `http://localhost:8080`; override with `ALLOWED_ORIGINS` (comma-separated).
- At least one of `text` or `html` is required.
- Uses `aiosmtplib` to send via your SMTP relay.

