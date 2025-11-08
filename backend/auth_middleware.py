from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "medrag-secret-key-change-in-production")
ALGORITHM = "HS256"

security = HTTPBearer()

def create_access_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = security):
    token = credentials.credentials
    payload = verify_token(token)
    return payload.get("sub")
