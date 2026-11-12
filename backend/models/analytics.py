from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class KPIResponse(BaseModel):
    tasa_ocupacion: float
    ticket_promedio: float
    satisfaccion_promedio: float
    total_recaudado: float
    total_ordenes_confirmadas: int
    tickets_vendidos: int
    stock_inicial_total: int
    total_eventos_activos: int
    total_eventos_exitosos: int
    porcentaje_eventos_exitosos: float


class UsuarioResumen(BaseModel):
    id: str
    nombre: str
    email: str


class CompraDetalle(BaseModel):
    evento: str
    tipo_ticket: str
    cantidad: int
    subtotal: float
    fecha_compra: datetime


class GastoCiudad(BaseModel):
    ciudad: str
    gasto_total: float
    cantidad_items: int
    compras: list[CompraDetalle]


class ComprasUsuarioResponse(BaseModel):
    usuario: UsuarioResumen
    ciudades: list[GastoCiudad]


class VentaEvento(BaseModel):
    evento_id: str
    nombre_evento: str
    ciudad: str
    total_recaudado: float
    tickets_vendidos: int
    stock_inicial: int
    porcentaje_venta: float
    etiqueta: Literal["Exitoso", "Por Mejorar"]


class TicketDisponible(BaseModel):
    tipo: str
    precio: float
    stock_disponible: int


class EventoDisponible(BaseModel):
    codigo: str
    nombre: str
    categoria: str
    fecha_evento: datetime
    ciudad: str
    tickets: list[TicketDisponible]


class TicketAnalizado(BaseModel):
    tipo: str
    precio: float
    stock_disponible: int
    bajo_stock: bool


class RiesgoStock(BaseModel):
    codigo: str
    nombre: str
    ciudad: str
    fecha_evento: datetime
    stock_total: int
    estado_stock: str
    tickets_analizados: list[TicketAnalizado]
