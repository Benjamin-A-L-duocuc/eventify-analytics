from fastapi import APIRouter, Query, status

from backend.models.orden import OrdenCreate, OrdenOut, OrdenUpdate
from backend.services import orden_service

router = APIRouter(prefix="/api/v1/ordenes", tags=["Órdenes de compra"])


@router.get("", response_model=list[OrdenOut])
def listar_ordenes(
    usuario_id: str | None = Query(None),
    evento_id: str | None = Query(None),
    estado: str | None = Query(None, description="confirmada, pendiente o cancelada"),
):
    return orden_service.listar_ordenes(usuario_id, evento_id, estado)


@router.get("/{id_orden}", response_model=OrdenOut)
def obtener_orden(id_orden: str):
    return orden_service.obtener_orden(id_orden)


@router.post("", response_model=OrdenOut, status_code=status.HTTP_201_CREATED)
def crear_orden(payload: OrdenCreate):
    return orden_service.crear_orden(payload)


@router.put("/{id_orden}", response_model=OrdenOut)
def actualizar_orden(id_orden: str, payload: OrdenUpdate):
    return orden_service.actualizar_orden(id_orden, payload)


@router.delete("/{id_orden}")
def eliminar_orden(id_orden: str):
    return orden_service.eliminar_orden(id_orden)
