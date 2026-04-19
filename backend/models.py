from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from datetime import datetime

# ---------- USERS ----------
class UserPublic(BaseModel):
    user_id: str
    email: str
    name: str
    auth_provider: str
    picture: Optional[str] = None

class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class AuthOut(BaseModel):
    user: UserPublic
    token: str

# ---------- RESTAURANTS ----------
class MenuItem(BaseModel):
    id: str
    name: str
    desc_fr: Optional[str] = ''
    desc_en: Optional[str] = ''
    price: float
    image: Optional[str] = None

class MenuSection(BaseModel):
    id: str
    name_fr: str
    name_en: str
    items: List[MenuItem]

class Restaurant(BaseModel):
    id: str
    name: str
    image: str
    cover: str
    cuisine: List[str]
    rating: float
    reviews: int
    delivery_min: int
    delivery_max: int
    delivery_fee: float
    min_order: float
    price_level: int
    certification: str
    address: str
    offers: List[str] = []
    new: bool = False
    distance_km: float
    description_fr: str
    description_en: str

class RestaurantMenu(BaseModel):
    restaurant_id: str
    sections: List[MenuSection]

class Category(BaseModel):
    id: str
    name_fr: str
    name_en: str
    image: str

# ---------- ORDERS ----------
OrderStatus = Literal['confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled']
PaymentMethod = Literal['card', 'paypal', 'applepay']

class OrderItemIn(BaseModel):
    id: str
    name: str
    price: float
    qty: int
    image: Optional[str] = None

class OrderCreate(BaseModel):
    restaurant_id: str
    items: List[OrderItemIn]
    address: str
    instructions: Optional[str] = ''
    payment_method: PaymentMethod = 'card'
    tip: float = 0.0

class StripeSplit(BaseModel):
    restaurant_payout: float
    driver_payout: float
    platform_fee: float
    restaurant_account: str
    driver_account: str
    mode: str = 'test'

class Order(BaseModel):
    id: str
    user_id: str
    restaurant_id: str
    restaurant_name: Optional[str] = None
    restaurant_image: Optional[str] = None
    items: List[OrderItemIn]
    subtotal: float
    delivery_fee: float
    service_fee: float
    tip: float
    total: float
    address: str
    instructions: Optional[str] = ''
    payment_method: PaymentMethod
    status: OrderStatus = 'confirmed'
    stripe_split: StripeSplit
    created_at: datetime
    updated_at: datetime

class StatusUpdate(BaseModel):
    status: OrderStatus
