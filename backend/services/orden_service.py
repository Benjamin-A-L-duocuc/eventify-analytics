from pymongo import ReturnDocument
from pymongo.errors import PyMongoError

from backend.database import db
from backend.models.orden import OrdenCreate, OrdenUpdate
from backend.utils.exceptions import DatosInvalidos, RecursoNoEncontrado
from backend.utils.helpers import a_object_id
from backend.utils.serializer import serializar_documento, serializar_lista

COLECCION = "ordenes_compra"


def _normalizar_items(items: list[dict], evento: dict) -> tuple[list[dict], float]:
    tickets = {ticket["tipo"]: ticket for ticket in evento.get("tickets_disponibles", [])}
    normalizados: list[dict] = []
    total = 0.0

    for item in items:
        tipo = item["tipo"]
        ticket = tickets.get(tipo)
        if not ticket:
            raise DatosInvalidos(f"El evento no ofrece tickets de tipo '{tipo}'")

        cantidad = int(item["cantidad"])
        precio = float(ticket["precio"])
        subtotal = round(precio * cantidad, 2)
        normalizados.append(
            {
                "tipo": tipo,
                "precio_unitario": precio,
                "cantidad": cantidad,
                "subtotal": subtotal,
            }
        )
        total += subtotal

    return normalizados, round(total, 2)


def _descontar_stock(evento_id, items: list[dict]) -> None:
    aplicados: list[dict] = []
    try:
        for item in items:
            resultado = db["eventos"].update_one(
                {
                    "_id": evento_id,
                    "tickets_disponibles": {
                        "$elemMatch": {
                            "tipo": item["tipo"],
                            "stock_disponible": {"$gte": item["cantidad"]},
                        }
                    },
                },
                {"$inc": {"tickets_disponibles.$[ticket].stock_disponible": -item["cantidad"]}},
                array_filters=[{"ticket.tipo": item["tipo"]}],
            )
            if resultado.modified_count == 0:
                raise DatosInvalidos(f"Stock insuficiente para tickets de tipo '{item['tipo']}'")
            aplicados.append(item)
    except Exception:
        _reponer_stock(evento_id, aplicados)
        raise


def _reponer_stock(evento_id, items: list[dict]) -> None:
    for item in items:
        try:
            db["eventos"].update_one(
                {"_id": evento_id},
                {"$inc": {"tickets_disponibles.$[ticket].stock_disponible": item["cantidad"]}},
                array_filters=[{"ticket.tipo": item["tipo"]}],
            )
        except PyMongoError:
            pass


def _validar_referencias(usuario_id, evento_id) -> dict:
    if not db["usuarios"].find_one({"_id": usuario_id}, {"_id": 1}):
        raise RecursoNoEncontrado(f"No existe un usuario con id {usuario_id}")
    evento = db["eventos"].find_one({"_id": evento_id})
    if not evento:
        raise RecursoNoEncontrado(f"No existe un evento con id {evento_id}")
    return evento


def listar_ordenes(
    usuario_id: str | None = None,
    evento_id: str | None = None,
    estado: str | None = None,
) -> list[dict]:
    filtro: dict = {}
    if usuario_id:
        filtro["usuario_id"] = a_object_id(usuario_id)
    if evento_id:
        filtro["evento_id"] = a_object_id(evento_id)
    if estado:
        filtro["estado"] = estado
    documentos = db[COLECCION].find(filtro).sort("fecha_compra", -1)
    return serializar_lista(documentos)


def obtener_orden(id_orden: str) -> dict:
    documento = db[COLECCION].find_one({"_id": a_object_id(id_orden)})
    if not documento:
        raise RecursoNoEncontrado(f"No existe una orden con id {id_orden}")
    return serializar_documento(documento)


def crear_orden(payload: OrdenCreate) -> dict:
    usuario_oid = a_object_id(payload.usuario_id)
    evento_oid = a_object_id(payload.evento_id)
    evento = _validar_referencias(usuario_oid, evento_oid)

    items, total = _normalizar_items(
        [item.model_dump() for item in payload.items],
        evento,
    )
    confirmada = payload.estado == "confirmada" and payload.confirmado

    if confirmada:
        _descontar_stock(evento_oid, items)

    documento = {
        "usuario_id": usuario_oid,
        "evento_id": evento_oid,
        "items": items,
        "total": total,
        "fecha_compra": payload.fecha_compra,
        "estado": payload.estado,
        "confirmado": payload.confirmado,
    }
    try:
        resultado = db[COLECCION].insert_one(documento)
    except Exception:
        if confirmada:
            _reponer_stock(evento_oid, items)
        raise
    return obtener_orden(str(resultado.inserted_id))


def actualizar_orden(id_orden: str, payload: OrdenUpdate) -> dict:
    object_id = a_object_id(id_orden)
    anterior = db[COLECCION].find_one({"_id": object_id})
    if not anterior:
        raise RecursoNoEncontrado(f"No existe una orden con id {id_orden}")

    usuario_oid = a_object_id(payload.usuario_id)
    evento_oid = a_object_id(payload.evento_id)
    evento = _validar_referencias(usuario_oid, evento_oid)
    items, total = _normalizar_items(
        [item.model_dump() for item in payload.items],
        evento,
    )

    anterior_confirmada = anterior.get("estado") == "confirmada" and anterior.get("confirmado") is True
    nueva_confirmada = payload.estado == "confirmada" and payload.confirmado

    if anterior_confirmada:
        _reponer_stock(anterior["evento_id"], anterior.get("items", []))

    if nueva_confirmada:
        try:
            _descontar_stock(evento_oid, items)
        except Exception:
            if anterior_confirmada:
                _descontar_stock(anterior["evento_id"], anterior.get("items", []))
            raise

    documento = {
        "usuario_id": usuario_oid,
        "evento_id": evento_oid,
        "items": items,
        "total": total,
        "fecha_compra": payload.fecha_compra,
        "estado": payload.estado,
        "confirmado": payload.confirmado,
    }
    try:
        actualizado = db[COLECCION].find_one_and_replace(
            {"_id": object_id},
            documento,
            return_document=ReturnDocument.AFTER,
        )
    except Exception:
        if nueva_confirmada:
            _reponer_stock(evento_oid, items)
        if anterior_confirmada:
            try:
                _descontar_stock(anterior["evento_id"], anterior.get("items", []))
            except Exception:
                pass
        raise
    if not actualizado:
        raise RecursoNoEncontrado(f"No existe una orden con id {id_orden}")
    return serializar_documento(actualizado)


def eliminar_orden(id_orden: str) -> dict:
    object_id = a_object_id(id_orden)
    anterior = db[COLECCION].find_one({"_id": object_id})
    if not anterior:
        raise RecursoNoEncontrado(f"No existe una orden con id {id_orden}")

    if anterior.get("estado") == "confirmada" and anterior.get("confirmado") is True:
        _reponer_stock(anterior["evento_id"], anterior.get("items", []))

    db[COLECCION].delete_one({"_id": object_id})
    return {"mensaje": "Orden eliminada correctamente"}
