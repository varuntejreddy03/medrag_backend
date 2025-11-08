import smtplib
import ssl
import random
import string
import os
from datetime import datetime, timedelta
from typing import Dict, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Gmail configuration from .env
GMAIL_USER = os.getenv('GMAIL_USER', 'freeai0418@gmail.com')
GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD', 'lxnf xthl jyoz cazl')

# Store verification codes temporarily
verification_codes: Dict[str, Dict] = {}

def generate_code() -> str:
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(email: str) -> bool:
    try:
        code = generate_code()
        
        # Store code with expiration
        verification_codes[email] = {
            'code': code,
            'expires': datetime.now() + timedelta(minutes=10)
        }
        
        print(f"Sending verification email to {email}...")
        
        context = ssl.create_default_context()
        
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls(context=context)
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            
            subject = "MedRAG - Email Verification Code"
            body = f"Welcome to MedRAG!\n\nYour verification code is: {code}\n\nThis code expires in 10 minutes."
            message = f"Subject: {subject}\n\n{body}"
            
            server.sendmail(GMAIL_USER, email, message)
            
        print(f"Email sent successfully to {email}")
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("Authentication failed")
        return False
    except Exception as e:
        print(f"Email send error: {e}")
        return False

def verify_code(email: str, code: str) -> bool:
    if email not in verification_codes:
        return False
    
    stored = verification_codes[email]
    
    # Check expiration
    if datetime.now() > stored['expires']:
        del verification_codes[email]
        return False
    
    # Check code
    if stored['code'] == code:
        del verification_codes[email]
        return True
    
    return False

def send_diagnosis_email(to_email: str, case_id: str, body: str) -> bool:
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls(context=context)
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            subject = f"MedRAG Diagnosis Report - Case {case_id}"
            message = f"Subject: {subject}\n\n{body}"
            server.sendmail(GMAIL_USER, to_email, message)
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False