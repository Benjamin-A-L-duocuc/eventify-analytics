from backend.database import db
from backend.utils.exceptions import DatosInvalidos, RecursoNoEncontrado
from backend.utils.helpers import a_object_id, ahora_utc


class ConsultasService:
    """Pipelines de agregación que responden las consultas analíticas de Eventify."""

    @staticmethod
    def compras_por_usuario(
        usuario_id: str | None = None,
        email: str | None = None,
        ciudad: str | None = None,
    ) -> dict:
        if usuario_id:
            filtro_usuario = {"_id": a_object_id(usuario_id)}
        elif email:
            filtro_usuario = {"email": email}
        else:
            raise DatosInvalidos("Debe indicar 'usuario_id' o 'email'")

        usuario = db["usuarios"].find_one(filtro_usuario)
        if not usuario:
            raise RecursoNoEncontrado("No se encontró el usuario solicitado")

        pipeline = [
            {
                "$match": {
                    "usuario_id": usuario["_id"],
                    "estado": "confirmada",
                    "confirmado": True,
                }
            },
            {
                "$lookup": {
                    "from": "eventos",
                    "localField": "evento_id",
                    "foreignField": "_id",
                    "as": "detalle_evento",
                }
            },
            {"$unwind": "$detalle_evento"},
        ]

        if ciudad:
            pipeline.append({"$match": {"detalle_evento.recinto.ciudad": ciudad}})

        pipeline.extend(
            [
                {"$unwind": "$items"},
                {
                    "$group": {
                        "_id": "$detalle_evento.recinto.ciudad",
                        "gasto_total": {"$sum": "$items.subtotal"},
                        "cantidad_items": {"$sum": "$items.cantidad"},
                        "compras": {
                            "$push": {
                                "evento": "$detalle_evento.nombre",
                                "tipo_ticket": "$items.tipo",
                                "cantidad": "$items.cantidad",
                                "subtotal": "$items.subtotal",
                                "fecha_compra": "$fecha_compra",
                            }
                        },
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "ciudad": "$_id",
                        "gasto_total": 1,
                        "cantidad_items": 1,
                        "compras": 1,
                    }
                },
                {"$sort": {"gasto_total": -1}},
            ]
        )

        ciudades = list(db["ordenes_compra"].aggregate(pipeline))
        return {
            "usuario": {
                "id": str(usuario["_id"]),
                "nombre": usuario.get("nombre", ""),
                "email": usuario.get("email", ""),
            },
            "ciudades": ciudades,
        }

    @staticmethod
    def ventas_por_evento(limite: int = 10) -> list[dict]:
        pipeline = [
            {"$match": {"estado": "confirmada", "confirmado": True}},
            {"$unwind": "$items"},
            {
                "$group": {
                    "_id": "$evento_id",
                    "total_recaudado": {"$sum": "$items.subtotal"},
                    "tickets_vendidos": {"$sum": "$items.cantidad"},
                }
            },
            {
                "$lookup": {
                    "from": "eventos",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "evento",
                }
            },
            {"$unwind": "$evento"},
            {
                "$addFields": {
                    "evento_id": {"$toString": "$_id"},
                    "stock_inicial": {"$sum": "$evento.tickets_disponibles.stock_inicial"},
                }
            },
            {
                "$addFields": {
                    "porcentaje_venta": {
                        "$cond": [
                            {"$gt": ["$stock_inicial", 0]},
                            {
                                "$round": [
                                    {
                                        "$multiply": [
                                            {"$divide": ["$tickets_vendidos", "$stock_inicial"]},
                                            100,
                                        ]
                                    },
                                    2,
                                ]
                            },
                            0,
                        ]
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "evento_id": 1,
                    "nombre_evento": "$evento.nombre",
                    "ciudad": "$evento.recinto.ciudad",
                    "total_recaudado": 1,
                    "tickets_vendidos": 1,
                    "stock_inicial": 1,
                    "porcentaje_venta": 1,
                    "etiqueta": {
                        "$cond": [
                            {"$gte": ["$porcentaje_venta", 70]},
                            "Exitoso",
                            "Por Mejorar",
                        ]
                    },
                }
            },
            {"$sort": {"total_recaudado": -1}},
            {"$limit": limite},
        ]
        return list(db["ordenes_compra"].aggregate(pipeline))

    @staticmethod
    def eventos_disponibles(
        ciudad: str | None = None,
        precio_max: float = 15000,
        limite: int = 10,
    ) -> list[dict]:
        coincidencia: dict = {
            "activo": True,
            "fecha_evento": {"$gt": ahora_utc()},
            "tickets_disponibles": {
                "$elemMatch": {
                    "precio": {"$lt": precio_max},
                    "stock_disponible": {"$gt": 0},
                }
            },
        }
        if ciudad:
            coincidencia["recinto.ciudad"] = ciudad

        pipeline = [
            {"$match": coincidencia},
            {
                "$project": {
                    "_id": 0,
                    "codigo": 1,
                    "nombre": 1,
                    "categoria": 1,
                    "fecha_evento": 1,
                    "ciudad": "$recinto.ciudad",
                    "tickets": {
                        "$filter": {
                            "input": "$tickets_disponibles",
                            "as": "ticket",
                            "cond": {
                                "$and": [
                                    {"$lt": ["$$ticket.precio", precio_max]},
                                    {"$gt": ["$$ticket.stock_disponible", 0]},
                                ]
                            },
                        }
                    },
                }
            },
            {"$sort": {"fecha_evento": 1}},
            {"$limit": limite},
        ]
        return list(db["eventos"].aggregate(pipeline))

    @staticmethod
    def riesgo_stock(umbral: int = 200, limite: int = 10) -> list[dict]:
        pipeline = [
            {"$match": {"activo": True, "fecha_evento": {"$gt": ahora_utc()}}},
            {
                "$addFields": {
                    "tickets_analizados": {
                        "$map": {
                            "input": "$tickets_disponibles",
                            "as": "ticket",
                            "in": {
                                "tipo": "$$ticket.tipo",
                                "precio": "$$ticket.precio",
                                "stock_disponible": "$$ticket.stock_disponible",
                                "bajo_stock": {"$lt": ["$$ticket.stock_disponible", umbral]},
                            },
                        }
                    }
                }
            },
            {
                "$addFields": {
                    "stock_total": {"$sum": "$tickets_analizados.stock_disponible"},
                    "hay_bajo_stock": {"$in": [True, "$tickets_analizados.bajo_stock"]},
                }
            },
            {
                "$addFields": {
                    "estado_stock": {
                        "$cond": [
                            "$hay_bajo_stock",
                            "Revisar disponibilidad",
                            "Stock suficiente",
                        ]
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "codigo": 1,
                    "nombre": 1,
                    "ciudad": "$recinto.ciudad",
                    "fecha_evento": 1,
                    "stock_total": 1,
                    "estado_stock": 1,
                    "tickets_analizados": 1,
                }
            },
            {"$sort": {"stock_total": 1}},
            {"$limit": limite},
        ]
        return list(db["eventos"].aggregate(pipeline))
