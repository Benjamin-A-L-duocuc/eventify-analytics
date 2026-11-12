class RecursoNoEncontrado(Exception):
    """El recurso solicitado no existe."""


class Conflicto(Exception):
    """La operación entra en conflicto con el estado actual (por ejemplo, duplicados)."""


class DatosInvalidos(Exception):
    """Los datos recibidos no son válidos para la operación solicitada."""
