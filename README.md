# Eventify Analytics

Aplicación de análisis para la plataforma **Eventify**, construida como trabajo de la Evaluación 3 de BDY0101. Integra una API REST con FastAPI, una base de datos MongoDB y un dashboard interactivo con Streamlit.

El dashboard **no se conecta directamente a MongoDB**: toda la lectura y escritura pasa por la API REST. Esto permite reemplazar Streamlit por otra herramienta de BI sin modificar la lógica de negocio ni los pipelines de agregación.

```text
MongoDB Atlas <--> FastAPI (CRUD + agregaciones + KPIs) <--> Streamlit (visualización)
```

## Arquitectura

```mermaid
flowchart LR
    U[Usuario] -->|navega| ST[Streamlit\nfrontend/app.py]
    ST -->|HTTP JSON| API[FastAPI\nbackend/main.py]
    API --> C[Capa Controller\ncontrollers/]
    C --> S[Capa Service\nservices/]
    S --> M[Capa Model\nmodels/]
    S -->|PyMongo| DB[(MongoDB Atlas\neventify_db)]
    M -.->|validación de entrada/salida| C
```

![Diagrama de arquitectura](docs/arquitectura.png)

La API sigue el patrón por capas exigido por la rúbrica:

- `controllers/`: define los endpoints HTTP, parámetros y códigos de respuesta.
- `services/`: contiene la lógica de negocio y los pipelines de agregación.
- `models/`: esquemas Pydantic de entrada y salida.
- `database.py`: cliente de MongoDB.
- `config.py`: configuración desde `.env`.

## Estructura del proyecto

```text
eventify_analytics/
├── backend/
│   ├── controllers/
│   │   ├── usuarios.py
│   │   ├── eventos.py
│   │   ├── ordenes.py
│   │   ├── resenas.py
│   │   ├── consultas.py
│   │   └── kpis.py
│   ├── models/
│   │   ├── common.py
│   │   ├── usuario.py
│   │   ├── evento.py
│   │   ├── orden.py
│   │   ├── resena.py
│   │   └── analytics.py
│   ├── services/
│   │   ├── usuario_service.py
│   │   ├── evento_service.py
│   │   ├── orden_service.py
│   │   ├── resena_service.py
│   │   ├── consultas_service.py
│   │   └── kpi_service.py
│   ├── utils/
│   │   ├── exceptions.py
│   │   ├── helpers.py
│   │   └── serializer.py
│   ├── config.py
│   ├── database.py
│   └── main.py
├── frontend/
│   ├── api_client.py
│   └── app.py
├── scripts/
│   ├── 01_eventify_colecciones.mongodb.js
│   ├── 02_eventify_datos.mongodb.js
│   └── 03_eventify_consultas.mongodb.js
├── docs/
│   ├── INFORME.md
│   ├── INFORME.pdf
│   ├── PRESENTACION.md
│   ├── PRESENTACION.pdf
│   ├── arquitectura.png
│   └── arquitectura.svg
├── requirements.txt
├── .env.example
└── README.md
```

## Requisitos

- Python 3.10 o superior.
- Una base de datos MongoDB (Atlas o local) con la base `eventify_db`.
- `mongosh` para cargar los scripts de datos (opcional si la base ya existe).

## Configuración del entorno

1. Crear y activar un entorno virtual:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Instalar dependencias:

   ```bash
   pip install -r requirements.txt
   ```

   Si `python3 -m venv` falla porque el sistema no tiene `python3-venv` y no
   puedes usar `sudo`, crea el entorno sin `pip` y bootstrapea `pip` con el
   `pip` del sistema:

   ```bash
   python3 -m venv --without-pip .venv
   python3 -m pip install --target .venv/lib/python3.12/site-packages pip
   .venv/bin/python -m pip install -r requirements.txt
   ```

3. Crear el archivo `.env` a partir de `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Completar las variables en `.env`:

   ```env
   MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DATABASE_NAME=eventify_db
   CORS_ORIGINS=http://localhost:8501,http://127.0.0.1:8501
   API_BASE_URL=http://127.0.0.1:8000
   ```

   El archivo `.env` está incluido en `.gitignore` y nunca debe subirse al repositorio.

## Carga de datos

Si la base `eventify_db` ya existe desde la Evaluación 2, puedes saltar este paso.

En caso contrario, ejecuta los scripts incluidos en `scripts/` con `mongosh`:

```bash
mongosh "TU_URI_DE_MONGO" scripts/01_eventify_colecciones.mongodb.js
mongosh "TU_URI_DE_MONGO" scripts/02_eventify_datos.mongodb.js
```

Los scripts crean las cuatro colecciones con validadores `$jsonSchema`, índices y datos de prueba:

- `usuarios` (50 documentos)
- `eventos` (50 documentos con `recinto` y `tickets_disponibles` embebidos)
- `ordenes_compra` (órdenes con ítems embebidos y referencias a usuario/evento)
- `resenas_evaluaciones` (reseñas con referencia a usuario/evento)

## Ejecución

### Backend

Desde la raíz del proyecto:

```bash
uvicorn backend.main:app --reload --reload-dir backend
```

Si quieres probar contra un MongoDB local en lugar de Atlas, sobreescribe la
variable de entorno (tiene prioridad sobre `.env`):

```bash
MONGO_URI="mongodb://127.0.0.1:27017" DATABASE_NAME="eventify_db" \
  uvicorn backend.main:app --reload --reload-dir backend
```

La documentación interactiva queda disponible en:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### Frontend

En otra terminal, con el entorno virtual activo:

```bash
streamlit run frontend/app.py
```

Streamlit abrirá el dashboard en `http://localhost:8501`.

## Endpoints

Base de la API: `http://127.0.0.1:8000/api/v1`.

### CRUD de usuarios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/usuarios` | Lista usuarios. Filtros: `tipo_usuario`, `activo`, `email` |
| GET | `/usuarios/{id}` | Obtiene un usuario |
| POST | `/usuarios` | Crea un usuario |
| PUT | `/usuarios/{id}` | Reemplaza un usuario |
| DELETE | `/usuarios/{id}` | Elimina un usuario sin órdenes ni reseñas asociadas |

### CRUD de eventos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/eventos` | Lista eventos. Filtros: `ciudad`, `categoria`, `activo` |
| GET | `/eventos/{id}` | Obtiene un evento |
| POST | `/eventos` | Crea un evento con recinto y tickets embebidos |
| PUT | `/eventos/{id}` | Reemplaza un evento |
| DELETE | `/eventos/{id}` | Elimina un evento sin órdenes ni reseñas asociadas |

### CRUD de órdenes

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/ordenes` | Lista órdenes. Filtros: `usuario_id`, `evento_id`, `estado` |
| GET | `/ordenes/{id}` | Obtiene una orden |
| POST | `/ordenes` | Crea una orden y descuenta stock si está confirmada |
| PUT | `/ordenes/{id}` | Reemplaza una orden y ajusta el stock |
| DELETE | `/ordenes/{id}` | Elimina una orden y repone stock si estaba confirmada |

### CRUD de reseñas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/resenas` | Lista reseñas. Filtros: `usuario_id`, `evento_id`, `puntuacion` |
| GET | `/resenas/{id}` | Obtiene una reseña |
| POST | `/resenas` | Crea una reseña única por usuario y evento |
| PUT | `/resenas/{id}` | Reemplaza una reseña |
| DELETE | `/resenas/{id}` | Elimina una reseña |

### Consultas analíticas

| Método | Ruta | Consulta de la E2 |
|---|---|---|
| GET | `/consultas/compras-por-usuario` | Consulta 1: `$lookup` + `$unwind` + `$group` |
| GET | `/consultas/ventas-por-evento` | Consulta 2: reporte de ventas y ocupación |
| GET | `/consultas/eventos-disponibles` | Consulta 3: eventos futuros filtrados por ciudad y precio |
| GET | `/consultas/riesgo-stock` | Consulta 4: pipeline propio con `$map` y `$addFields` |

Parámetros principales:

- Consulta 1: `usuario_id` o `email` (obligatorio uno de los dos), `ciudad` (opcional).
- Consulta 2: `limite` (por defecto 10).
- Consulta 3: `ciudad` (opcional), `precio_max` (por defecto 15000), `limite` (por defecto 10).
- Consulta 4: `umbral` de bajo stock (por defecto 200), `limite` (por defecto 10).

### KPIs

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/kpis` | Devuelve los tres KPIs de negocio y valores de apoyo |
| GET | `/health` | Estado de la API |
| GET | `/` | Mensaje de bienvenida |

## KPIs de negocio

La rúbrica exige al menos tres KPIs calculados sobre MongoDB. Se eligieron los siguientes:

1. **Tasa de ocupación global**
   - Fórmula: tickets vendidos en órdenes confirmadas de eventos activos / stock inicial total de eventos activos × 100.
   - Justificación: mide la conversión real del inventario disponible y permite detectar eventos con baja demanda.

2. **Ticket promedio por orden**
   - Fórmula: recaudación total de órdenes confirmadas / cantidad de órdenes confirmadas.
   - Justificación: indica el valor medio de cada compra y complementa la recaudación total.

3. **Satisfacción promedio**
   - Fórmula: promedio de `puntuacion` en `resenas_evaluaciones`.
   - Justificación: resume la percepción de los asistentes y permite cruzar calidad con éxito comercial.

Como apoyo, `/kpis` también informa la recaudación total, la cantidad de órdenes confirmadas, los tickets vendidos, el stock inicial total, los eventos activos y los eventos exitosos.

## Consultas analíticas y su origen en la E2

1. **Compras por usuario y ciudad**: usa `$lookup` desde `ordenes_compra` hacia `eventos`, `$unwind` sobre el evento y los ítems, y `$group` por ciudad. Se parametrizó el usuario para no depender de un correo fijo.
2. **Ventas por evento**: agrupa ítems de órdenes confirmadas, cruza con `eventos` y calcula recaudación, tickets vendidos, stock inicial y porcentaje de ocupación. La clasificación es `"Exitoso"` si la ocupación es mayor o igual a 70%, y `"Por Mejorar"` en caso contrario.
3. **Eventos disponibles**: filtra eventos futuros y activos con `$elemMatch` y luego proyecta solo los tickets bajo el precio indicado usando `$filter`.
4. **Riesgo de stock**: consulta propia que usa `$map` para analizar cada tipo de ticket, `$addFields` para calcular el stock total y detectar bajo stock, y `$cond` para clasificar el evento.

## Dashboard

El dashboard tiene tres secciones:

- **Indicadores**: tarjetas `st.metric` con los KPIs y una tabla de apoyo.
- **Consultas analíticas**: cuatro pestañas con visualizaciones Plotly, tablas y filtros interactivos.
- **Administración**: formularios `st.form`, tablas `st.dataframe` y operaciones de creación, edición y eliminación para las cuatro colecciones.

Las consultas GET se cachean por 30 segundos. Cualquier operación de escritura limpia la caché y recarga los datos.

## Manejo de errores

- `404`: recurso inexistente.
- `409`: duplicados (email, código de evento, reseña repetida, referencias asociadas).
- `422`: datos inválidos, incluidos identificadores ObjectId mal formados.
- `503`: error de conexión con MongoDB.

## Notas de diseño

- Los `ObjectId` se serializan como texto en las respuestas.
- Las fechas se envían y reciben en formato ISO 8601.
- La creación y edición de órdenes valida que el evento ofrezca el tipo de ticket y ajusta el stock disponible de forma controlada.
- Los validadores `$jsonSchema` de la E2 se respetan en todos los `POST` y `PUT`.
