from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import db, client
from routes.auth import router as auth_router
from routes.restaurants import router as restaurants_router
from routes.orders import router as orders_router
from routes.video import router as video_router
from seed_data import run_seed

app = FastAPI(title='CLIGOO API', version='1.0')

@app.get('/api/')
async def root():
    return {'service': 'CLIGOO API', 'status': 'ok', 'version': '1.0'}

app.include_router(auth_router)
app.include_router(restaurants_router)
app.include_router(orders_router)
app.include_router(video_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event('startup')
async def _startup():
    try:
        await run_seed()
        logger.info('CLIGOO seed OK')
    except Exception as e:
        logger.error(f'Seed error: {e}')

@app.on_event('shutdown')
async def _shutdown():
    client.close()
