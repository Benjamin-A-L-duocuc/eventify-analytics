from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from backend.models.common import PyObjectId

EstadoOrden = Literal["confirmada", "pendiente", "cancelada"]


class OrdenItem(BaseModel):
    tipo: str = Field(min_length=1)
    precio_unitario: float = Field(ge=0)
    cantidad: int = Field(ge=1)
    subtotal: float = Field(ge=0)


class OrdenBase(BaseModel):
    usuario_id: PyObjectId
    evento_id: PyObjectId
    items: list[OrdenItem] = Field(min_length=1)
    total: float = Field(ge=0)
    fecha_compra: datetime
    estado: EstadoOrden = "confirmada"
    confirmado: bool = True


class OrdenCreate(OrdenBase):
    pass


class OrdenUpdate(OrdenBase):
    pass


class OrdenOut(OrdenBase):
    id: PyObjectId
    model_config = ConfigDict(extra="ignore")
