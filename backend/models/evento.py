from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from backend.models.common import PyObjectId

Categoria = Literal["concierto", "festival", "obra de teatro", "conferencia"]


class Recinto(BaseModel):
    nombre: str = Field(min_length=1)
    calle: str = Field(min_length=1)
    ciudad: str = Field(min_length=1)
    capacidad: int = Field(ge=1)


class Ticket(BaseModel):
    tipo: str = Field(min_length=1)
    precio: float = Field(ge=0)
    stock_inicial: int = Field(ge=0)
    stock_disponible: int = Field(ge=0)


class EventoBase(BaseModel):
    codigo: str = Field(min_length=1, examples=["EVT-051"])
    nombre: str = Field(min_length=1)
    categoria: Categoria
    descripcion: str = ""
    fecha_evento: datetime
    activo: bool = True
    recinto: Recinto
    tickets_disponibles: list[Ticket] = Field(min_length=1)


class EventoCreate(EventoBase):
    pass


class EventoUpdate(EventoBase):
    pass


class EventoOut(EventoBase):
    id: PyObjectId
    model_config = ConfigDict(extra="ignore")
