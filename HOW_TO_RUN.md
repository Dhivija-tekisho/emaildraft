# How to Run the Email Draft Application

## Prerequisites
- Python 3.8+ installed
- Node.js and npm installed
- A terminal/PowerShell window

## Step 1: Start the Backend Server

1. **Open a terminal/PowerShell window**

2. **Navigate to the backend directory:**
   ```powershell
   cd C:\emaildraft\backend
   ```

3. **Activate the virtual environment** (if you have one):
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   If you don't have a venv, create one:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

4. **Install dependencies** (if not already installed):
   ```powershell
   pip install -r requirements.txt
   ```

5. **Create a `.env` file** in the `backend` folder (if it doesn't exist):
   ```
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   SMTP_FROM=no-reply@example.com
   SMTP_SECURE=true
   ALLOWED_ORIGINS=http://localhost:8080
   ```
   > **Note:** For the Gmail compose feature, you don't need SMTP credentials, but you'll need them if you want to use the "Send" button.

6. **Start the backend server:**
   ```powershell
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   You should see output like:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
   INFO:     Started reloader process
   INFO:     Started server process
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   ```

   **Keep this terminal window open!**

## Step 2: Start the Frontend Server

1. **Open a NEW terminal/PowerShell window** (keep the backend running)

2. **Navigate to the frontend directory:**
   ```powershell
   cd C:\emaildraft\front_end
   ```

3. **Install dependencies** (if not already installed):
   ```powershell
   npm install
   ```

4. **Start the frontend development server:**
   ```powershell
   npm run dev
   ```
   Or:
   ```powershell
   npm start
   ```

   You should see output like:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:8080/
   ➜  Network: use --host to expose
   ```

   **Keep this terminal window open too!**

## Step 3: Open the Application

1. **Open your web browser** and navigate to:
   ```
   http://localhost:8080
   ```

2. You should see the Email Draft application interface.

## Step 4: Test the Gmail Compose Feature

1. **Fill in the email fields:**
   - To: Enter recipient email
   - Subject: Enter email subject
   - Body: The email body will be auto-generated or you can edit it

2. **Click the "Open in Mail App" button**

3. **A new tab should open** with Gmail compose window, with all fields prefilled:
   - To, CC, BCC (if filled)
   - Subject
   - Body (converted from HTML to plain text)

4. **You must be logged into Gmail** in the same browser for this to work.

5. **Click Send in Gmail** to send the email.

## Troubleshooting

### Backend not starting?
- Make sure Python is installed: `python --version`
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Check if port 8000 is already in use

### Frontend not starting?
- Make sure Node.js is installed: `node --version`
- Make sure npm is installed: `npm --version`
- Try deleting `node_modules` and running `npm install` again
- Check if port 8080 is already in use

### Gmail compose not opening?
- Make sure the backend is running on port 8000
- Check browser console for errors (F12)
- Make sure you're logged into Gmail in the same browser
- Check that CORS is properly configured (backend should allow `http://localhost:8080`)

### API connection errors?
- Verify backend is running: Open `http://localhost:8000/health` in browser (should return `{"status":"ok"}`)
- Check that `ALLOWED_ORIGINS` in backend `.env` includes `http://localhost:8080`

## Stopping the Servers

- **Backend:** Press `Ctrl+C` in the backend terminal
- **Frontend:** Press `Ctrl+C` in the frontend terminal


