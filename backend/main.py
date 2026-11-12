from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import DuplicateKeyError, PyMongoError

from backend.config import get_settings
from backend.controllers import consultas, eventos, kpis, ordenes, resenas, usuarios
from backend.utils.exceptions import Conflicto, DatosInvalidos, RecursoNoEncontrado

settings = get_settings()

etiquetas = [
    {"name": "General", "description": "Estado general de la API"},
    {"name": "Usuarios", "description": "CRUD de usuarios"},
    {"name": "Eventos", "description": "CRUD de eventos"},
    {"name": "Órdenes de compra", "description": "CRUD de órdenes de compra"},
    {"name": "Reseñas", "description": "CRUD de reseñas y evaluaciones"},
    {"name": "Consultas analíticas", "description": "Pipelines de agregación de Eventify"},
    {"name": "KPIs", "description": "Indicadores clave de negocio"},
]

app = FastAPI(
    title="Eventify Analytics API",
    description=(
        "API REST para la plataforma Eventify. Expone operaciones CRUD, "
        "las consultas analíticas de la Evaluación 2 y los KPIs de negocio."
    ),
    version="1.0.0",
    openapi_tags=etiquetas,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RecursoNoEncontrado)
async def manejar_recurso_no_encontrado(request: Request, exc: RecursoNoEncontrado):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(Conflicto)
async def manejar_conflicto(request: Request, exc: Conflicto):
    return JSONResponse(status_code=409, content={"detail": str(exc)})


@app.exception_handler(DatosInvalidos)
async def manejar_datos_invalidos(request: Request, exc: DatosInvalidos):
    return JSONResponse(status_code=422, content={"detail": str(exc)})


@app.exception_handler(DuplicateKeyError)
async def manejar_duplicado(request: Request, exc: DuplicateKeyError):
    return JSONResponse(
        status_code=409,
        content={"detail": "El registro ya existe o infringe un índice único"},
    )


@app.exception_handler(PyMongoError)
async def manejar_error_mongo(request: Request, exc: PyMongoError):
    return JSONResponse(
        status_code=503,
        content={"detail": "No fue posible comunicarse con MongoDB"},
    )


@app.get("/", tags=["General"])
def inicio():
    return {
        "mensaje": "API Eventify funcionando correctamente",
        "documentacion": "/docs",
        "version": "1.0.0",
    }


@app.get("/api/v1/health", tags=["General"])
def health():
    return {"estado": "ok"}


app.include_router(usuarios.router)
app.include_router(eventos.router)
app.include_router(ordenes.router)
app.include_router(resenas.router)
app.include_router(consultas.router)
app.include_router(kpis.router)
