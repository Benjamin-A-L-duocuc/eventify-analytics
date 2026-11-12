from fastapi import APIRouter, Query, status

from backend.models.usuario import UsuarioCreate, UsuarioOut, UsuarioUpdate
from backend.services import usuario_service

router = APIRouter(prefix="/api/v1/usuarios", tags=["Usuarios"])


@router.get("", response_model=list[UsuarioOut])
def listar_usuarios(
    tipo_usuario: str | None = Query(None, description="cliente o administrador"),
    activo: bool | None = Query(None),
    email: str | None = Query(None),
):
    return usuario_service.listar_usuarios(tipo_usuario, activo, email)


@router.get("/{id_usuario}", response_model=UsuarioOut)
def obtener_usuario(id_usuario: str):
    return usuario_service.obtener_usuario(id_usuario)


@router.post("", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
def crear_usuario(payload: UsuarioCreate):
    return usuario_service.crear_usuario(payload)


@router.put("/{id_usuario}", response_model=UsuarioOut)
def actualizar_usuario(id_usuario: str, payload: UsuarioUpdate):
    return usuario_service.actualizar_usuario(id_usuario, payload)


@router.delete("/{id_usuario}")
def eliminar_usuario(id_usuario: str):
    return usuario_service.eliminar_usuario(id_usuario)
