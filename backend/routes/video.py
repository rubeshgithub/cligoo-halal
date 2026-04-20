import os
import time
import secrets
import httpx
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import db
from auth_utils import get_current_user

router = APIRouter(prefix='/api/video-calls', tags=['video'])

DAILY_API_KEY = os.environ.get('DAILY_API_KEY', '').strip()
DAILY_DOMAIN = os.environ.get('DAILY_DOMAIN', 'cligoo').strip()
DAILY_API_BASE = 'https://api.daily.co/v1'
ROOM_EXPIRY_SEC = 30 * 60  # 30 minutes


class CreateCallBody(BaseModel):
    order_id: str


class CreateCallResponse(BaseModel):
    room_url: str
    room_name: str
    customer_url: str
    courier_url: str
    dev_mode: bool


def _headers() -> dict:
    return {
        'Authorization': f'Bearer {DAILY_API_KEY}',
        'Content-Type': 'application/json',
    }


async def _create_daily_room(room_name: str) -> dict:
    exp_ts = int(time.time()) + ROOM_EXPIRY_SEC
    payload = {
        'name': room_name,
        'privacy': 'private',
        'properties': {
            'exp': exp_ts,
            'eject_at_room_exp': True,
            'enable_knocking': False,
            'enable_chat': True,
            'enable_prejoin_ui': False,
        },
    }
    async with httpx.AsyncClient(timeout=10.0) as cli:
        r = await cli.post(f'{DAILY_API_BASE}/rooms', json=payload, headers=_headers())
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail=f'Daily room error: {r.text}')
        return r.json()


async def _create_daily_token(room_name: str, user_name: str, is_owner: bool) -> Optional[str]:
    payload = {
        'properties': {
            'room_name': room_name,
            'user_name': user_name,
            'is_owner': is_owner,
            'exp': int(time.time()) + ROOM_EXPIRY_SEC,
        }
    }
    async with httpx.AsyncClient(timeout=10.0) as cli:
        r = await cli.post(f'{DAILY_API_BASE}/meeting-tokens', json=payload, headers=_headers())
        if r.status_code >= 400:
            return None
        return r.json().get('token')


@router.post('/create', response_model=CreateCallResponse)
async def create_call(body: CreateCallBody, user=Depends(get_current_user)):
    order = await db.orders.find_one({'id': body.order_id}, {'_id': 0})
    if not order:
        raise HTTPException(status_code=404, detail='Order not found')
    if order['user_id'] != user['user_id']:
        raise HTTPException(status_code=403, detail='Not your order')

    room_name = f"cligoo-{body.order_id.lower()}-{secrets.token_hex(4)}"

    # Dev fallback: no API key configured -> use a public demo room so UI is testable
    if not DAILY_API_KEY:
        demo_url = f'https://{DAILY_DOMAIN}.daily.co/{room_name}' if DAILY_DOMAIN else f'https://cligoo.daily.co/{room_name}'
        return CreateCallResponse(
            room_url=demo_url,
            room_name=room_name,
            customer_url=demo_url,
            courier_url=demo_url,
            dev_mode=True,
        )

    # Real Daily.co flow
    try:
        room = await _create_daily_room(room_name)
        room_url = room.get('url') or f'https://{DAILY_DOMAIN}.daily.co/{room_name}'
        cust_tok = await _create_daily_token(room_name, user.get('name', 'Customer'), is_owner=True)
        cour_tok = await _create_daily_token(room_name, 'Karim (Courier)', is_owner=False)

        customer_url = f'{room_url}?t={cust_tok}' if cust_tok else room_url
        courier_url  = f'{room_url}?t={cour_tok}' if cour_tok else room_url

        await db.video_calls.insert_one({
            'room_name': room_name,
            'order_id': body.order_id,
            'customer_id': user['user_id'],
            'created_at': int(time.time()),
        })

        return CreateCallResponse(
            room_url=room_url,
            room_name=room_name,
            customer_url=customer_url,
            courier_url=courier_url,
            dev_mode=False,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Video call creation failed: {e}')


@router.post('/end/{room_name}')
async def end_call(room_name: str, user=Depends(get_current_user)):
    if not DAILY_API_KEY:
        return {'ended': True, 'dev_mode': True}
    try:
        async with httpx.AsyncClient(timeout=10.0) as cli:
            r = await cli.delete(f'{DAILY_API_BASE}/rooms/{room_name}', headers=_headers())
            return {'ended': r.status_code in (200, 204, 404)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'End call failed: {e}')


@router.get('/status')
async def video_status():
    return {
        'api_configured': bool(DAILY_API_KEY),
        'domain': DAILY_DOMAIN,
        'provider': 'daily.co',
        'mode': 'production' if DAILY_API_KEY else 'dev_fallback',
    }
