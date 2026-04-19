from fastapi import APIRouter, HTTPException, Response, Request, Depends
from datetime import datetime, timedelta, timezone
from database import db
from models import RegisterIn, LoginIn, AuthOut, UserPublic
from auth_utils import (
    hash_password, verify_password, make_jwt, get_current_user,
    fetch_emergent_session, gen_user_id,
)

router = APIRouter(prefix='/api/auth', tags=['auth'])

def _public(u: dict) -> UserPublic:
    return UserPublic(
        user_id=u['user_id'], email=u['email'], name=u.get('name',''),
        auth_provider=u.get('auth_provider','jwt'), picture=u.get('picture'),
    )

@router.post('/register', response_model=AuthOut)
async def register(body: RegisterIn):
    email = body.email.lower()
    existing = await db.users.find_one({'email': email}, {'_id': 0})
    if existing and existing.get('password_hash'):
        raise HTTPException(status_code=400, detail='Email already registered')
    if existing:
        await db.users.update_one(
            {'user_id': existing['user_id']},
            {'$set': {
                'password_hash': hash_password(body.password),
                'name': body.name or existing.get('name',''),
                'auth_provider': 'both',
            }}
        )
        uid = existing['user_id']
    else:
        uid = gen_user_id()
        await db.users.insert_one({
            'user_id': uid, 'email': email, 'name': body.name,
            'password_hash': hash_password(body.password),
            'auth_provider': 'jwt', 'picture': None,
            'created_at': datetime.now(timezone.utc),
        })
    u = await db.users.find_one({'user_id': uid}, {'_id': 0, 'password_hash': 0})
    return AuthOut(user=_public(u), token=make_jwt(uid))

@router.post('/login', response_model=AuthOut)
async def login(body: LoginIn):
    u = await db.users.find_one({'email': body.email.lower()}, {'_id': 0})
    if not u or not u.get('password_hash') or not verify_password(body.password, u['password_hash']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    u2 = {k: v for k, v in u.items() if k != 'password_hash'}
    return AuthOut(user=_public(u2), token=make_jwt(u['user_id']))

@router.post('/google/session', response_model=AuthOut)
async def google_session(request: Request, response: Response):
    session_id = request.headers.get('x-session-id') or request.headers.get('X-Session-ID')
    if not session_id:
        raise HTTPException(status_code=400, detail='Missing X-Session-ID header')
    data = await fetch_emergent_session(session_id)
    email = (data.get('email') or '').lower()
    name = data.get('name') or email.split('@')[0]
    picture = data.get('picture')
    session_token = data.get('session_token')

    existing = await db.users.find_one({'email': email}, {'_id': 0})
    if existing:
        uid = existing['user_id']
        provider = 'both' if existing.get('auth_provider') == 'jwt' else 'google'
        await db.users.update_one({'user_id': uid}, {'$set': {
            'name': name, 'picture': picture, 'auth_provider': provider,
        }})
    else:
        uid = gen_user_id()
        await db.users.insert_one({
            'user_id': uid, 'email': email, 'name': name, 'picture': picture,
            'auth_provider': 'google', 'password_hash': None,
            'created_at': datetime.now(timezone.utc),
        })

    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        'user_id': uid, 'session_token': session_token,
        'expires_at': expires_at, 'created_at': datetime.now(timezone.utc),
    })

    response.set_cookie(
        key='session_token', value=session_token, httponly=True,
        secure=True, samesite='none', path='/', max_age=7*24*3600,
    )

    u = await db.users.find_one({'user_id': uid}, {'_id': 0, 'password_hash': 0})
    return AuthOut(user=_public(u), token=make_jwt(uid))

@router.get('/me', response_model=UserPublic)
async def me(user=Depends(get_current_user)):
    return _public(user)

@router.post('/logout')
async def logout(request: Request, response: Response):
    token = request.cookies.get('session_token')
    if token:
        await db.user_sessions.delete_one({'session_token': token})
    response.delete_cookie('session_token', path='/')
    return {'ok': True}
