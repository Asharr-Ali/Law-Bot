"""
/ and /health — liveness probes.
"""

from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.models.schemas import HealthResponse, RootResponse

router = APIRouter(tags=["health"])


@router.get("/", response_model=RootResponse)
def root(settings: Settings = Depends(get_settings)) -> RootResponse:
    return RootResponse(status=f"{settings.app_name} running", version=settings.app_version)


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")