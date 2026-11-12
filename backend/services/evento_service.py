from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from backend.database import db
from backend.models.evento import EventoCreate, EventoUpdate
from backend.utils.exceptions import Conflicto, DatosInvalidos, RecursoNoEncontrado
from backend.utils.helpers import a_object_id
from backend.utils.serializer import serializar_documento, serializar_lista

COLECCION = "eventos"


def _validar_tickets(documento: dict) -> None:
    for ticket in documento.get("tickets_disponibles", []):
        if ticket["stock_disponible"] > ticket["stock_inicial"]:
            raise DatosInvalidos(
                f"El stock disponible de '{ticket['tipo']}' no puede superar el stock inicial"
            )


def listar_eventos(
    ciudad: str | None = None,
    categoria: str | None = None,
    activo: bool | None = None,
) -> list[dict]:
    filtro: dict = {}
    if ciudad:
        filtro["recinto.ciudad"] = ciudad
    if categoria:
        filtro["categoria"] = categoria
    if activo is not None:
        filtro["activo"] = activo
    documentos = db[COLECCION].find(filtro).sort("fecha_evento", 1)
    return serializar_lista(documentos)


def obtener_evento(id_evento: str) -> dict:
    documento = db[COLECCION].find_one({"_id": a_object_id(id_evento)})
    if not documento:
        raise RecursoNoEncontrado(f"No existe un evento con id {id_evento}")
    return serializar_documento(documento)


def crear_evento(payload: EventoCreate) -> dict:
    documento = payload.model_dump()
    _validar_tickets(documento)
    try:
        resultado = db[COLECCION].insert_one(documento)
    except DuplicateKeyError as error:
        raise Conflicto("Ya existe un evento con ese código") from error
    return obtener_evento(str(resultado.inserted_id))


def actualizar_evento(id_evento: str, payload: EventoUpdate) -> dict:
    documento = payload.model_dump()
    _validar_tickets(documento)
    try:
        actualizado = db[COLECCION].find_one_and_update(
            {"_id": a_object_id(id_evento)},
            {"$set": documento},
            return_document=ReturnDocument.AFTER,
        )
    except DuplicateKeyError as error:
        raise Conflicto("Ya existe un evento con ese código") from error
    if not actualizado:
        raise RecursoNoEncontrado(f"No existe un evento con id {id_evento}")
    return serializar_documento(actualizado)


def eliminar_evento(id_evento: str) -> dict:
    object_id = a_object_id(id_evento)
    if db["ordenes_compra"].count_documents({"evento_id": object_id}) > 0:
        raise Conflicto("No se puede eliminar el evento porque tiene órdenes de compra asociadas")
    if db["resenas_evaluaciones"].count_documents({"evento_id": object_id}) > 0:
        raise Conflicto("No se puede eliminar el evento porque tiene reseñas asociadas")
    resultado = db[COLECCION].delete_one({"_id": object_id})
    if resultado.deleted_count == 0:
        raise RecursoNoEncontrado(f"No existe un evento con id {id_evento}")
    return {"mensaje": "Evento eliminado correctamente"}
