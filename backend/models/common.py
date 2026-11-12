from typing import Annotated

from bson import ObjectId
from pydantic import BeforeValidator, PlainSerializer, WithJsonSchema


def _validar_object_id(valor):
    if isinstance(valor, ObjectId):
        return str(valor)
    if isinstance(valor, str) and ObjectId.is_valid(valor):
        return valor
    raise ValueError("ObjectId inválido")


PyObjectId = Annotated[
    str,
    BeforeValidator(_validar_object_id),
    PlainSerializer(lambda valor: str(valor), return_type=str, when_used="json"),
    WithJsonSchema(
        {
            "type": "string",
            "description": "ObjectId de MongoDB en formato hexadecimal de 24 caracteres",
            "examples": ["507f1f77bcf86cd799439011"],
        }
    ),
]
