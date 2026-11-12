from fastapi import APIRouter, Query, status

from backend.models.resena import ResenaCreate, ResenaOut, ResenaUpdate
from backend.services import resena_service

router = APIRouter(prefix="/api/v1/resenas", tags=["Reseñas"])


@router.get("", response_model=list[ResenaOut])
def listar_resenas(
    usuario_id: str | None = Query(None),
    evento_id: str | None = Query(None),
    puntuacion: int | None = Query(None, ge=1, le=5),
):
    return resena_service.listar_resenas(usuario_id, evento_id, puntuacion)


@router.get("/{id_resena}", response_model=ResenaOut)
def obtener_resena(id_resena: str):
    return resena_service.obtener_resena(id_resena)


@router.post("", response_model=ResenaOut, status_code=status.HTTP_201_CREATED)
def crear_resena(payload: ResenaCreate):
    return resena_service.crear_resena(payload)


@router.put("/{id_resena}", response_model=ResenaOut)
def actualizar_resena(id_resena: str, payload: ResenaUpdate):
    return resena_service.actualizar_resena(id_resena, payload)


@router.delete("/{id_resena}")
def eliminar_resena(id_resena: str):
    return resena_service.eliminar_resena(id_resena)
