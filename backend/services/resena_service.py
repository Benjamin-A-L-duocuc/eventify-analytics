from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from backend.database import db
from backend.models.resena import ResenaCreate, ResenaUpdate
from backend.utils.exceptions import Conflicto, RecursoNoEncontrado
from backend.utils.helpers import a_object_id
from backend.utils.serializer import serializar_documento, serializar_lista

COLECCION = "resenas_evaluaciones"


def _validar_referencias(usuario_id, evento_id) -> None:
    if not db["usuarios"].find_one({"_id": usuario_id}, {"_id": 1}):
        raise RecursoNoEncontrado(f"No existe un usuario con id {usuario_id}")
    if not db["eventos"].find_one({"_id": evento_id}, {"_id": 1}):
        raise RecursoNoEncontrado(f"No existe un evento con id {evento_id}")


def listar_resenas(
    usuario_id: str | None = None,
    evento_id: str | None = None,
    puntuacion: int | None = None,
) -> list[dict]:
    filtro: dict = {}
    if usuario_id:
        filtro["usuario_id"] = a_object_id(usuario_id)
    if evento_id:
        filtro["evento_id"] = a_object_id(evento_id)
    if puntuacion is not None:
        filtro["puntuacion"] = puntuacion
    documentos = db[COLECCION].find(filtro).sort("fecha_resena", -1)
    return serializar_lista(documentos)


def obtener_resena(id_resena: str) -> dict:
    documento = db[COLECCION].find_one({"_id": a_object_id(id_resena)})
    if not documento:
        raise RecursoNoEncontrado(f"No existe una reseña con id {id_resena}")
    return serializar_documento(documento)


def crear_resena(payload: ResenaCreate) -> dict:
    usuario_oid = a_object_id(payload.usuario_id)
    evento_oid = a_object_id(payload.evento_id)
    _validar_referencias(usuario_oid, evento_oid)

    documento = payload.model_dump()
    documento["usuario_id"] = usuario_oid
    documento["evento_id"] = evento_oid

    try:
        resultado = db[COLECCION].insert_one(documento)
    except DuplicateKeyError as error:
        raise Conflicto("El usuario ya registró una reseña para este evento") from error
    return obtener_resena(str(resultado.inserted_id))


def actualizar_resena(id_resena: str, payload: ResenaUpdate) -> dict:
    usuario_oid = a_object_id(payload.usuario_id)
    evento_oid = a_object_id(payload.evento_id)
    _validar_referencias(usuario_oid, evento_oid)

    documento = payload.model_dump()
    documento["usuario_id"] = usuario_oid
    documento["evento_id"] = evento_oid

    try:
        actualizado = db[COLECCION].find_one_and_update(
            {"_id": a_object_id(id_resena)},
            {"$set": documento},
            return_document=ReturnDocument.AFTER,
        )
    except DuplicateKeyError as error:
        raise Conflicto("El usuario ya registró una reseña para este evento") from error
    if not actualizado:
        raise RecursoNoEncontrado(f"No existe una reseña con id {id_resena}")
    return serializar_documento(actualizado)


def eliminar_resena(id_resena: str) -> dict:
    resultado = db[COLECCION].delete_one({"_id": a_object_id(id_resena)})
    if resultado.deleted_count == 0:
        raise RecursoNoEncontrado(f"No existe una reseña con id {id_resena}")
    return {"mensaje": "Reseña eliminada correctamente"}
