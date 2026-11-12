from fastapi import APIRouter, Query, status

from backend.models.evento import EventoCreate, EventoOut, EventoUpdate
from backend.services import evento_service

router = APIRouter(prefix="/api/v1/eventos", tags=["Eventos"])


@router.get("", response_model=list[EventoOut])
def listar_eventos(
    ciudad: str | None = Query(None),
    categoria: str | None = Query(None),
    activo: bool | None = Query(None),
):
    return evento_service.listar_eventos(ciudad, categoria, activo)


@router.get("/{id_evento}", response_model=EventoOut)
def obtener_evento(id_evento: str):
    return evento_service.obtener_evento(id_evento)


@router.post("", response_model=EventoOut, status_code=status.HTTP_201_CREATED)
def crear_evento(payload: EventoCreate):
    return evento_service.crear_evento(payload)


@router.put("/{id_evento}", response_model=EventoOut)
def actualizar_evento(id_evento: str, payload: EventoUpdate):
    return evento_service.actualizar_evento(id_evento, payload)


@router.delete("/{id_evento}")
def eliminar_evento(id_evento: str):
    return evento_service.eliminar_evento(id_evento)
