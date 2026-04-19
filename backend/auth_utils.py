import os
import jwt
import uuid
import httpx
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Request, HTTPException, status
from passlib.context import CryptContext
from database import db

JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
JWT_ALGO = 'HS256'
JWT_EXPIRES_DAYS = 7

pwd_ctx = CryptContext(schemes=['bcrypt'], deprecated='auto')

def hash_password(p: str) -> str:
    return pwd_ctx.hash(p)

def verify_password(p: str, h: str) -> bool:
    try: return pwd_ctx.verify(p, h)
    except Exception: return False

def make_jwt(user_id: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRES_DAYS)
    return jwt.encode({'sub': user_id, 'exp': exp, 'typ': 'jwt'}, JWT_SECRET, algorithm=JWT_ALGO)

def decode_jwt(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        return payload.get('sub')
    except Exception:
        return None

async def fetch_emergent_session(session_id: str) -> dict:
    url = 'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data'
    async with httpx.AsyncClient(timeout=10.0) as cli:
        r = await cli.get(url, headers={'X-Session-ID': session_id})
        if r.status_code != 200:
            raise HTTPException(status_code=401, detail='Invalid Emergent session')
        return r.json()

async def get_current_user(request: Request):
    token = request.cookies.get('session_token')
    if token:
        user = await _user_from_session_token(token)
        if user: return user

    auth = request.headers.get('authorization', '')
    if auth.lower().startswith('bearer '):
        bearer = auth.split(' ', 1)[1].strip()
        uid = decode_jwt(bearer)
        if uid:
            u = await db.users.find_one({'user_id': uid}, {'_id': 0, 'password_hash': 0})
            if u: return u
        u = await _user_from_session_token(bearer)
        if u: return u

    raise HTTPException(status_code=401, detail='Not authenticated')

async def _user_from_session_token(token: str):
    s = await db.user_sessions.find_one({'session_token': token})
    if not s: return None
    exp = s.get('expires_at')
    if isinstance(exp, str): exp = datetime.fromisoformat(exp)
    if exp and exp.tzinfo is None: exp = exp.replace(tzinfo=timezone.utc)
    if exp and exp < datetime.now(timezone.utc): return None
    return await db.users.find_one({'user_id': s['user_id']}, {'_id': 0, 'password_hash': 0})

def gen_user_id() -> str:
    return f"user_{uuid.uuid4().hex[:12]}"
