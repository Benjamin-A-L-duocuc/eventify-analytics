from __future__ import annotations

from typing import Any

from bson import ObjectId


def serializar_valor(valor: Any) -> Any:
    if isinstance(valor, ObjectId):
        return str(valor)
    if isinstance(valor, list):
        return [serializar_valor(item) for item in valor]
    if isinstance(valor, dict):
        return {clave: serializar_valor(contenido) for clave, contenido in valor.items()}
    return valor


def serializar_documento(documento: dict | None) -> dict | None:
    """Convierte ObjectId en texto y normaliza el campo _id como id."""
    if documento is None:
        return None
    resultado = {clave: serializar_valor(valor) for clave, valor in documento.items()}
    if "_id" in resultado:
        resultado["id"] = resultado.pop("_id")
    return resultado


def serializar_lista(documentos) -> list[dict]:
    return [serializar_documento(documento) for documento in documentos]
