from fastapi import APIRouter

from api.routes.upgrade import router as upgrade_router
from api.routes.covert import router as covert_router
from api.routes.optimize import router as optimize_router
from api.routes.k8s_deploy import router as k8s_deploy_router
from api.routes.correct import router as correct_router
from api.routes.detect import router as detect_router

api_router = APIRouter()
api_router.include_router(upgrade_router)
api_router.include_router(covert_router)
api_router.include_router(optimize_router)
api_router.include_router(k8s_deploy_router)
api_router.include_router(correct_router)
api_router.include_router(detect_router)

