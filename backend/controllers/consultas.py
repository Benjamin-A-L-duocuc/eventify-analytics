from fastapi import APIRouter, Query

from backend.models.analytics import (
    ComprasUsuarioResponse,
    EventoDisponible,
    RiesgoStock,
    VentaEvento,
)
from backend.services.consultas_service import ConsultasService

router = APIRouter(prefix="/api/v1/consultas", tags=["Consultas analíticas"])


@router.get("/compras-por-usuario", response_model=ComprasUsuarioResponse)
def compras_por_usuario(
    usuario_id: str | None = Query(None),
    email: str | None = Query(None),
    ciudad: str | None = Query(None),
):
    return ConsultasService.compras_por_usuario(usuario_id, email, ciudad)


@router.get("/ventas-por-evento", response_model=list[VentaEvento])
def ventas_por_evento(limite: int = Query(10, ge=1, le=100)):
    return ConsultasService.ventas_por_evento(limite)


@router.get("/eventos-disponibles", response_model=list[EventoDisponible])
def eventos_disponibles(
    ciudad: str | None = Query(None),
    precio_max: float = Query(15000, ge=0),
    limite: int = Query(10, ge=1, le=100),
):
    return ConsultasService.eventos_disponibles(ciudad, precio_max, limite)


@router.get("/riesgo-stock", response_model=list[RiesgoStock])
def riesgo_stock(
    umbral: int = Query(200, ge=0),
    limite: int = Query(10, ge=1, le=100),
):
    return ConsultasService.riesgo_stock(umbral, limite)
