from datetime import datetime, timezone

from bson import ObjectId

from backend.utils.exceptions import DatosInvalidos


def a_object_id(valor: str | ObjectId) -> ObjectId:
    """Convierte un identificador hexadecimal en ObjectId, validándolo."""
    if isinstance(valor, ObjectId):
        return valor
    if not isinstance(valor, str) or not ObjectId.is_valid(valor):
        raise DatosInvalidos(f"Identificador inválido: {valor!r}")
    return ObjectId(valor)


def ahora_utc() -> datetime:
    """Fecha actual en UTC sin zona horaria, compatible con PyMongo."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
