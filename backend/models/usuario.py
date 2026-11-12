from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from backend.models.common import PyObjectId

PATRON_EMAIL = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"


class UsuarioBase(BaseModel):
    nombre: str = Field(min_length=2, examples=["Tulio Triviño"])
    email: str = Field(pattern=PATRON_EMAIL, examples=["tulio@eventify.cl"])
    tipo_usuario: Literal["cliente", "administrador"]
    fecha_nacimiento: datetime
    fecha_registro: datetime
    es_vip: bool = False
    activo: bool = True


class UsuarioCreate(UsuarioBase):
    pass


class UsuarioUpdate(UsuarioBase):
    pass


class UsuarioOut(UsuarioBase):
    id: PyObjectId
    model_config = ConfigDict(extra="ignore")
