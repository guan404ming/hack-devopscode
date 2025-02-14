from fastapi import APIRouter

from api.routes.upgrade import router as upgrade_router
from api.routes.covert import router as covert_router
from api.routes.optimize import router as optimize_router

api_router = APIRouter()
api_router.include_router(upgrade_router)
api_router.include_router(covert_router)
api_router.include_router(optimize_router)


