from fastapi import APIRouter

from backend.models.analytics import KPIResponse
from backend.services.kpi_service import KPIService

router = APIRouter(prefix="/api/v1/kpis", tags=["KPIs"])


@router.get("", response_model=KPIResponse)
def obtener_kpis():
    return KPIService.get_kpis()
