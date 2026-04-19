from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from database import db
from models import Restaurant, RestaurantMenu, Category

router = APIRouter(prefix='/api', tags=['restaurants'])

@router.get('/restaurants', response_model=List[Restaurant])
async def list_restaurants(
    cat: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_delivery: Optional[int] = None,
    sort: Optional[str] = 'recommended',
):
    q = {}
    if cat and cat != 'all':
        q['cuisine'] = cat
    if min_rating is not None:
        q['rating'] = {'$gte': min_rating}
    if max_delivery is not None:
        q['delivery_max'] = {'$lte': max_delivery}

    sort_map = {
        'rating':    [('rating', -1)],
        'delivery':  [('delivery_min', 1)],
        'priceAsc':  [('price_level', 1)],
        'recommended': [('rating', -1), ('reviews', -1)],
    }
    cursor = db.restaurants.find(q, {'_id': 0}).sort(sort_map.get(sort or 'recommended', sort_map['recommended']))
    return await cursor.to_list(length=200)

@router.get('/restaurants/{rid}', response_model=Restaurant)
async def get_restaurant(rid: str):
    r = await db.restaurants.find_one({'id': rid}, {'_id': 0})
    if not r:
        raise HTTPException(status_code=404, detail='Restaurant not found')
    return r

@router.get('/restaurants/{rid}/menu', response_model=RestaurantMenu)
async def get_restaurant_menu(rid: str):
    m = await db.menus.find_one({'restaurant_id': rid}, {'_id': 0})
    if not m:
        raise HTTPException(status_code=404, detail='Menu not found')
    return m

@router.get('/categories', response_model=List[Category])
async def list_categories():
    cats = await db.categories.find({}, {'_id': 0}).to_list(length=100)
    return cats
