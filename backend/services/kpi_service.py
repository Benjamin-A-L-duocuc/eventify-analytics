from backend.database import db
from backend.services.consultas_service import ConsultasService


class KPIService:
    """Consolida los indicadores clave de negocio de Eventify."""

    @staticmethod
    def _unico(pipeline: list[dict], coleccion: str = "ordenes_compra") -> dict:
        resultado = list(db[coleccion].aggregate(pipeline))
        return resultado[0] if resultado else {}

    @staticmethod
    def get_kpis() -> dict:
        stock = KPIService._unico(
            [
                {"$match": {"activo": True}},
                {
                    "$project": {
                        "stock_inicial": {"$sum": "$tickets_disponibles.stock_inicial"}
                    }
                },
                {"$group": {"_id": None, "stock_inicial_total": {"$sum": "$stock_inicial"}}},
            ],
            "eventos",
        )
        stock_inicial_total = int(stock.get("stock_inicial_total", 0))

        ventas_activas = KPIService._unico(
            [
                {"$match": {"estado": "confirmada", "confirmado": True}},
                {"$unwind": "$items"},
                {
                    "$group": {
                        "_id": "$evento_id",
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
                {"$match": {"evento.activo": True}},
                {"$group": {"_id": None, "tickets_vendidos": {"$sum": "$tickets_vendidos"}}},
            ]
        )
        tickets_vendidos = int(ventas_activas.get("tickets_vendidos", 0))

        recaudacion = KPIService._unico(
            [
                {"$match": {"estado": "confirmada", "confirmado": True}},
                {
                    "$group": {
                        "_id": None,
                        "total_recaudado": {"$sum": "$total"},
                        "total_ordenes": {"$sum": 1},
                    }
                },
            ]
        )
        total_recaudado = float(recaudacion.get("total_recaudado", 0))
        total_ordenes = int(recaudacion.get("total_ordenes", 0))

        satisfaccion = list(
            db["resenas_evaluaciones"].aggregate(
                [
                    {
                        "$group": {
                            "_id": None,
                            "satisfaccion_promedio": {"$avg": "$puntuacion"},
                        }
                    }
                ]
            )
        )
        satisfaccion_promedio = (
            float(satisfaccion[0]["satisfaccion_promedio"]) if satisfaccion else 0.0
        )

        total_eventos_activos = db["eventos"].count_documents({"activo": True})
        ventas = ConsultasService.ventas_por_evento(limite=1000)
        total_eventos_exitosos = sum(1 for venta in ventas if venta.get("etiqueta") == "Exitoso")

        tasa_ocupacion = (
            round((tickets_vendidos / stock_inicial_total) * 100, 2)
            if stock_inicial_total > 0
            else 0.0
        )
        ticket_promedio = (
            round(total_recaudado / total_ordenes, 2) if total_ordenes > 0 else 0.0
        )
        porcentaje_exitosos = (
            round((total_eventos_exitosos / total_eventos_activos) * 100, 2)
            if total_eventos_activos > 0
            else 0.0
        )

        return {
            "tasa_ocupacion": tasa_ocupacion,
            "ticket_promedio": ticket_promedio,
            "satisfaccion_promedio": round(satisfaccion_promedio, 2),
            "total_recaudado": round(total_recaudado, 2),
            "total_ordenes_confirmadas": total_ordenes,
            "tickets_vendidos": tickets_vendidos,
            "stock_inicial_total": stock_inicial_total,
            "total_eventos_activos": total_eventos_activos,
            "total_eventos_exitosos": total_eventos_exitosos,
            "porcentaje_eventos_exitosos": porcentaje_exitosos,
        }
