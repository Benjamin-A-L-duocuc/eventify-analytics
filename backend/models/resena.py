from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from backend.models.common import PyObjectId


class ResenaBase(BaseModel):
    usuario_id: PyObjectId
    evento_id: PyObjectId
    puntuacion: int = Field(ge=1, le=5)
    comentario: str = Field(min_length=1)
    fecha_resena: datetime
    recomendado: bool = False


class ResenaCreate(ResenaBase):
    pass


class ResenaUpdate(ResenaBase):
    pass


class ResenaOut(ResenaBase):
    id: PyObjectId
    model_config = ConfigDict(extra="ignore")
