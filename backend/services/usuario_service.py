from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from backend.database import db
from backend.models.usuario import UsuarioCreate, UsuarioUpdate
from backend.utils.exceptions import Conflicto, RecursoNoEncontrado
from backend.utils.helpers import a_object_id
from backend.utils.serializer import serializar_documento, serializar_lista

COLECCION = "usuarios"


def listar_usuarios(
    tipo_usuario: str | None = None,
    activo: bool | None = None,
    email: str | None = None,
) -> list[dict]:
    filtro: dict = {}
    if tipo_usuario:
        filtro["tipo_usuario"] = tipo_usuario
    if activo is not None:
        filtro["activo"] = activo
    if email:
        filtro["email"] = email
    documentos = db[COLECCION].find(filtro).sort("nombre", 1)
    return serializar_lista(documentos)


def obtener_usuario(id_usuario: str) -> dict:
    documento = db[COLECCION].find_one({"_id": a_object_id(id_usuario)})
    if not documento:
        raise RecursoNoEncontrado(f"No existe un usuario con id {id_usuario}")
    return serializar_documento(documento)


def crear_usuario(payload: UsuarioCreate) -> dict:
    documento = payload.model_dump()
    try:
        resultado = db[COLECCION].insert_one(documento)
    except DuplicateKeyError as error:
        raise Conflicto("Ya existe un usuario con ese email") from error
    return obtener_usuario(str(resultado.inserted_id))


def actualizar_usuario(id_usuario: str, payload: UsuarioUpdate) -> dict:
    documento = payload.model_dump()
    try:
        actualizado = db[COLECCION].find_one_and_update(
            {"_id": a_object_id(id_usuario)},
            {"$set": documento},
            return_document=ReturnDocument.AFTER,
        )
    except DuplicateKeyError as error:
        raise Conflicto("Ya existe un usuario con ese email") from error
    if not actualizado:
        raise RecursoNoEncontrado(f"No existe un usuario con id {id_usuario}")
    return serializar_documento(actualizado)


def eliminar_usuario(id_usuario: str) -> dict:
    object_id = a_object_id(id_usuario)
    if db["ordenes_compra"].count_documents({"usuario_id": object_id}) > 0:
        raise Conflicto("No se puede eliminar el usuario porque tiene órdenes de compra asociadas")
    if db["resenas_evaluaciones"].count_documents({"usuario_id": object_id}) > 0:
        raise Conflicto("No se puede eliminar el usuario porque tiene reseñas asociadas")
    resultado = db[COLECCION].delete_one({"_id": object_id})
    if resultado.deleted_count == 0:
        raise RecursoNoEncontrado(f"No existe un usuario con id {id_usuario}")
    return {"mensaje": "Usuario eliminado correctamente"}
