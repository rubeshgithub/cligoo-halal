from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
from typing import List
import uuid
from database import db
from models import Order, OrderCreate, StatusUpdate, StripeSplit
from auth_utils import get_current_user

router = APIRouter(prefix='/api/orders', tags=['orders'])

SERVICE_FEE_RATE = 0.10
PLATFORM_COMMISSION = 0.30

def _gen_order_id() -> str:
    return 'CL-' + uuid.uuid4().hex[:6].upper()

def _compute_split(subtotal: float, service_fee: float, delivery_fee: float, tip: float,
                    restaurant_id: str, driver_id: str = 'acct_test_driver_001') -> StripeSplit:
    restaurant_commission = round(subtotal * PLATFORM_COMMISSION, 2)
    platform_fee = round(restaurant_commission + service_fee, 2)
    restaurant_payout = round(subtotal - restaurant_commission, 2)
    driver_payout = round(delivery_fee + tip, 2)
    return StripeSplit(
        restaurant_payout=restaurant_payout,
        driver_payout=driver_payout,
        platform_fee=platform_fee,
        restaurant_account=f'acct_test_{restaurant_id}',
        driver_account=driver_id,
        mode='test',
    )

@router.post('', response_model=Order)
async def create_order(body: OrderCreate, user=Depends(get_current_user)):
    resto = await db.restaurants.find_one({'id': body.restaurant_id}, {'_id': 0})
    if not resto:
        raise HTTPException(status_code=404, detail='Restaurant not found')
    if not body.items:
        raise HTTPException(status_code=400, detail='No items in order')

    subtotal = round(sum(i.price * i.qty for i in body.items), 2)
    if subtotal < resto.get('min_order', 0):
        raise HTTPException(status_code=400, detail=f"Minimum order is {resto.get('min_order')} EUR")

    delivery_fee = float(resto.get('delivery_fee', 0))
    service_fee = round(subtotal * SERVICE_FEE_RATE, 2)
    tip = round(float(body.tip), 2)
    total = round(subtotal + delivery_fee + service_fee + tip, 2)
    split = _compute_split(subtotal, service_fee, delivery_fee, tip, body.restaurant_id)

    now = datetime.now(timezone.utc)
    order_doc = {
        'id': _gen_order_id(),
        'user_id': user['user_id'],
        'restaurant_id': body.restaurant_id,
        'restaurant_name': resto.get('name'),
        'restaurant_image': resto.get('image'),
        'items': [i.dict() for i in body.items],
        'subtotal': subtotal,
        'delivery_fee': delivery_fee,
        'service_fee': service_fee,
        'tip': tip,
        'total': total,
        'address': body.address,
        'instructions': body.instructions or '',
        'payment_method': body.payment_method,
        'status': 'confirmed',
        'stripe_split': split.dict(),
        'created_at': now,
        'updated_at': now,
    }
    await db.orders.insert_one(order_doc)
    order_doc.pop('_id', None)
    return order_doc

@router.get('', response_model=List[Order])
async def list_my_orders(user=Depends(get_current_user)):
    cursor = db.orders.find({'user_id': user['user_id']}, {'_id': 0}).sort('created_at', -1)
    return await cursor.to_list(length=200)

@router.get('/{order_id}', response_model=Order)
async def get_order(order_id: str, user=Depends(get_current_user)):
    o = await db.orders.find_one({'id': order_id}, {'_id': 0})
    if not o:
        raise HTTPException(status_code=404, detail='Order not found')
    if o['user_id'] != user['user_id']:
        raise HTTPException(status_code=403, detail='Not your order')
    return o

@router.patch('/{order_id}/status', response_model=Order)
async def update_status(order_id: str, body: StatusUpdate, user=Depends(get_current_user)):
    o = await db.orders.find_one({'id': order_id}, {'_id': 0})
    if not o:
        raise HTTPException(status_code=404, detail='Order not found')
    await db.orders.update_one(
        {'id': order_id},
        {'$set': {'status': body.status, 'updated_at': datetime.now(timezone.utc)}}
    )
    o['status'] = body.status
    return o
