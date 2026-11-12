from __future__ import annotations

from datetime import date, datetime, time

import pandas as pd
import plotly.express as px
import streamlit as st

import api_client
from api_client import ErrorAPI

st.set_page_config(
    page_title="Eventify Analytics",
    layout="wide",
)

CATEGORIAS = ["concierto", "festival", "obra de teatro", "conferencia"]
ESTADOS_ORDEN = ["confirmada", "pendiente", "cancelada"]
TIPOS_USUARIO = ["cliente", "administrador"]


@st.cache_data(ttl=30, show_spinner=False)
def consultar(path: str, params: tuple = ()):
    return api_client.get(path, dict(params) if params else None)


def params_tuple(**kwargs) -> tuple:
    return tuple(
        sorted(
            (clave, valor)
            for clave, valor in kwargs.items()
            if valor is not None and valor != ""
        )
    )


def refrescar(mensaje: str) -> None:
    st.cache_data.clear()
    st.success(mensaje)
    st.rerun()


def mostrar_error(exc: Exception) -> None:
    st.error(str(exc))


def _parse_fecha(valor) -> datetime:
    if isinstance(valor, datetime):
        return valor
    texto = str(valor).replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(texto)
    except ValueError:
        return datetime.now()


def _fecha_iso(fecha: date, hora: time | None = None) -> str:
    return datetime.combine(fecha, hora or time.min).isoformat()


def _df_tickets(tickets: list[dict] | None = None) -> pd.DataFrame:
    columnas = ["tipo", "precio", "stock_inicial", "stock_disponible"]
    if tickets:
        return pd.DataFrame(tickets)[columnas]
    return pd.DataFrame(
        [{"tipo": "General", "precio": 10000.0, "stock_inicial": 100, "stock_disponible": 100}]
    )


def _tickets_desde_df(df: pd.DataFrame) -> list[dict]:
    tickets = []
    for _, fila in df.dropna(subset=["tipo"]).iterrows():
        if pd.isna(fila["precio"]) or pd.isna(fila["stock_inicial"]) or pd.isna(
            fila["stock_disponible"]
        ):
            continue
        tickets.append(
            {
                "tipo": str(fila["tipo"]),
                "precio": float(fila["precio"]),
                "stock_inicial": int(fila["stock_inicial"]),
                "stock_disponible": int(fila["stock_disponible"]),
            }
        )
    return tickets


def _df_items(items: list[dict] | None = None) -> pd.DataFrame:
    if items:
        return pd.DataFrame(items)[["tipo", "precio_unitario", "cantidad", "subtotal"]]
    return pd.DataFrame(
        [{"tipo": "General", "precio_unitario": 0.0, "cantidad": 1, "subtotal": 0.0}]
    )


def _items_desde_df(df: pd.DataFrame, evento: dict) -> list[dict]:
    precios = {
        ticket["tipo"]: float(ticket["precio"])
        for ticket in evento.get("tickets_disponibles", [])
    }
    items = []
    for _, fila in df.dropna(subset=["tipo"]).iterrows():
        if pd.isna(fila["cantidad"]):
            continue
        tipo = str(fila["tipo"])
        cantidad = max(1, int(fila["cantidad"]))
        precio = precios.get(tipo)
        if precio is None:
            continue
        items.append(
            {
                "tipo": tipo,
                "precio_unitario": precio,
                "cantidad": cantidad,
                "subtotal": round(precio * cantidad, 2),
            }
        )
    return items


def _cargar_base() -> tuple[list[dict], list[dict]]:
    return consultar("/usuarios"), consultar("/eventos")


st.sidebar.title("Eventify Analytics")
st.sidebar.caption("API REST FastAPI + MongoDB + Streamlit")

if st.sidebar.button("Actualizar datos", width="stretch"):
    st.cache_data.clear()
    st.rerun()

seccion = st.sidebar.radio(
    "Sección",
    ["Indicadores", "Consultas analíticas", "Administración"],
)
st.sidebar.divider()
st.sidebar.caption(f"API: {api_client.API_BASE_URL}")


def render_indicadores() -> None:
    st.header("Indicadores clave de negocio")
    st.caption(
        "KPIs calculados sobre las colecciones ordenes_compra, eventos y "
        "resenas_evaluaciones mediante agregaciones de MongoDB."
    )

    try:
        kpis = consultar("/kpis")
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Recaudación total", f"${kpis['total_recaudado']:,.0f}")
    col2.metric("Órdenes confirmadas", f"{kpis['total_ordenes_confirmadas']:,}")
    col3.metric("Ticket promedio por orden", f"${kpis['ticket_promedio']:,.0f}")
    col4.metric("Satisfacción promedio", f"{kpis['satisfaccion_promedio']:.2f} / 5")

    st.divider()
    detalle = pd.DataFrame(
        [
            ("Tasa de ocupación de eventos activos", f"{kpis['tasa_ocupacion']:.2f} %"),
            ("Tickets vendidos en eventos activos", f"{kpis['tickets_vendidos']:,}"),
            ("Stock inicial de eventos activos", f"{kpis['stock_inicial_total']:,}"),
            ("Eventos activos", f"{kpis['total_eventos_activos']:,}"),
            ("Eventos exitosos", f"{kpis['total_eventos_exitosos']:,}"),
            ("Porcentaje de eventos exitosos", f"{kpis['porcentaje_eventos_exitosos']:.2f} %"),
        ],
        columns=["Indicador de apoyo", "Valor"],
    )
    st.dataframe(detalle, hide_index=True, width="stretch")


def render_consulta_compras() -> None:
    st.subheader("Consulta 1: compras y gasto por ciudad")
    st.caption(
        "Pipeline con $lookup, $unwind y $group. Permite elegir un usuario y "
        "opcionalmente filtrar por ciudad."
    )

    try:
        usuarios = consultar("/usuarios")
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    if not usuarios:
        st.info("No hay usuarios registrados.")
        return

    mapa = {usuario["id"]: usuario for usuario in usuarios}
    seleccionado = st.selectbox(
        "Usuario",
        list(mapa),
        format_func=lambda id_usuario: (
            f"{mapa[id_usuario]['nombre']} ({mapa[id_usuario]['email']})"
        ),
        key="consulta1_usuario",
    )
    ciudad = st.text_input("Ciudad (opcional)", key="consulta1_ciudad").strip() or None

    try:
        resultado = consultar(
            "/consultas/compras-por-usuario",
            params_tuple(email=mapa[seleccionado]["email"], ciudad=ciudad),
        )
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    ciudades = resultado.get("ciudades", [])
    if not ciudades:
        st.info("El usuario no tiene compras confirmadas con los filtros seleccionados.")
        return

    df = pd.DataFrame(
        [
            {
                "Ciudad": item["ciudad"],
                "Gasto total": item["gasto_total"],
                "Tickets": item["cantidad_items"],
            }
            for item in ciudades
        ]
    )
    st.metric("Gasto total del usuario", f"${df['Gasto total'].sum():,.0f}")

    figura = px.bar(
        df,
        x="Ciudad",
        y="Gasto total",
        text="Gasto total",
        color="Ciudad",
        template="plotly_white",
    )
    st.plotly_chart(figura, width="stretch")

    for item in ciudades:
        with st.expander(f"{item['ciudad']}: ${item['gasto_total']:,.0f}"):
            st.dataframe(pd.DataFrame(item["compras"]), hide_index=True, width="stretch")


def render_consulta_ventas() -> None:
    st.subheader("Consulta 2: ventas y ocupación por evento")
    st.caption(
        "Pipeline de reporte con $lookup, $addFields y $cond. Compara la "
        "recaudación con la ocupación sobre el stock inicial."
    )

    limite = st.slider("Cantidad de eventos", 3, 50, 10, key="consulta2_limite")
    try:
        datos = consultar("/consultas/ventas-por-evento", params_tuple(limite=limite))
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    if not datos:
        st.info("No hay ventas confirmadas para mostrar.")
        return

    df = pd.DataFrame(datos)
    df = df.rename(
        columns={
            "nombre_evento": "Evento",
            "ciudad": "Ciudad",
            "total_recaudado": "Recaudación",
            "tickets_vendidos": "Tickets vendidos",
            "stock_inicial": "Stock inicial",
            "porcentaje_venta": "Ocupación (%)",
            "etiqueta": "Clasificación",
        }
    )

    figura = px.bar(
        df,
        x="Evento",
        y="Recaudación",
        color="Clasificación",
        text="Recaudación",
        hover_data=["Ciudad", "Ocupación (%)", "Tickets vendidos", "Stock inicial"],
        template="plotly_white",
    )
    figura.update_layout(xaxis_tickangle=-30)
    st.plotly_chart(figura, width="stretch")

    dispersion = px.scatter(
        df,
        x="Ocupación (%)",
        y="Recaudación",
        size="Tickets vendidos",
        color="Clasificación",
        hover_name="Evento",
        template="plotly_white",
    )
    st.plotly_chart(dispersion, width="stretch")

    st.dataframe(df, hide_index=True, width="stretch")


def render_consulta_disponibles() -> None:
    st.subheader("Consulta 3: eventos futuros con tickets bajo un precio")
    st.caption(
        "Pipeline con $elemMatch y $filter. Filtra eventos futuros activos por "
        "ciudad y precio máximo."
    )

    try:
        eventos = consultar("/eventos")
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    ciudades = sorted(
        {
            evento["recinto"]["ciudad"]
            for evento in eventos
            if evento.get("recinto", {}).get("ciudad")
        }
    )

    col1, col2, col3 = st.columns(3)
    with col1:
        ciudad = st.selectbox("Ciudad", ["Todas"] + ciudades, key="consulta3_ciudad")
    with col2:
        precio_max = st.slider(
            "Precio máximo", 1000, 50000, 15000, step=1000, key="consulta3_precio"
        )
    with col3:
        limite = st.slider("Cantidad máxima", 3, 50, 10, key="consulta3_limite")

    try:
        datos = consultar(
            "/consultas/eventos-disponibles",
            params_tuple(
                ciudad=None if ciudad == "Todas" else ciudad,
                precio_max=precio_max,
                limite=limite,
            ),
        )
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    if not datos:
        st.info("No hay eventos futuros que cumplan los filtros.")
        return

    filas = []
    for evento in datos:
        for ticket in evento["tickets"]:
            filas.append(
                {
                    "Código": evento["codigo"],
                    "Evento": evento["nombre"],
                    "Categoría": evento["categoria"],
                    "Ciudad": evento["ciudad"],
                    "Fecha": evento["fecha_evento"],
                    "Tipo de ticket": ticket["tipo"],
                    "Precio": ticket["precio"],
                    "Stock disponible": ticket["stock_disponible"],
                }
            )

    df = pd.DataFrame(filas)
    st.dataframe(df, hide_index=True, width="stretch")

    figura = px.bar(
        df,
        x="Evento",
        y="Stock disponible",
        color="Tipo de ticket",
        hover_data=["Ciudad", "Precio", "Fecha"],
        barmode="group",
        template="plotly_white",
    )
    figura.update_layout(xaxis_tickangle=-30)
    st.plotly_chart(figura, width="stretch")


def render_consulta_stock() -> None:
    st.subheader("Consulta 4: riesgo de agotamiento de stock")
    st.caption(
        "Consulta de autoría propia con $map, $addFields, $cond e $in. "
        "Identifica eventos futuros con tickets bajo un umbral de stock."
    )

    col1, col2 = st.columns(2)
    with col1:
        umbral = st.slider(
            "Umbral de bajo stock", 10, 1000, 200, step=10, key="consulta4_umbral"
        )
    with col2:
        limite = st.slider("Cantidad de eventos", 3, 50, 10, key="consulta4_limite")

    try:
        datos = consultar(
            "/consultas/riesgo-stock",
            params_tuple(umbral=umbral, limite=limite),
        )
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    if not datos:
        st.info("No hay eventos futuros activos para analizar.")
        return

    resumen = pd.DataFrame(
        [
            {
                "Código": evento["codigo"],
                "Evento": evento["nombre"],
                "Ciudad": evento["ciudad"],
                "Fecha": evento["fecha_evento"],
                "Stock total": evento["stock_total"],
                "Estado": evento["estado_stock"],
            }
            for evento in datos
        ]
    )

    figura = px.bar(
        resumen,
        x="Evento",
        y="Stock total",
        color="Estado",
        hover_data=["Ciudad", "Fecha"],
        template="plotly_white",
    )
    figura.update_layout(xaxis_tickangle=-30)
    st.plotly_chart(figura, width="stretch")
    st.dataframe(resumen, hide_index=True, width="stretch")

    for evento in datos:
        with st.expander(f"{evento['nombre']} ({evento['estado_stock']})"):
            st.dataframe(
                pd.DataFrame(evento["tickets_analizados"]),
                hide_index=True,
                width="stretch",
            )


def render_consultas() -> None:
    st.header("Consultas analíticas")
    tab1, tab2, tab3, tab4 = st.tabs(
        [
            "1. Compras por usuario",
            "2. Ventas por evento",
            "3. Eventos disponibles",
            "4. Riesgo de stock",
        ]
    )
    with tab1:
        render_consulta_compras()
    with tab2:
        render_consulta_ventas()
    with tab3:
        render_consulta_disponibles()
    with tab4:
        render_consulta_stock()


def admin_usuarios() -> None:
    st.subheader("Usuarios")
    try:
        usuarios = consultar("/usuarios")
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    if usuarios:
        st.dataframe(pd.DataFrame(usuarios), hide_index=True, width="stretch")
    else:
        st.info("No hay usuarios registrados.")

    st.markdown("#### Crear usuario")
    with st.form("form_crear_usuario", clear_on_submit=True):
        col1, col2 = st.columns(2)
        with col1:
            nombre = st.text_input("Nombre", key="cu_nombre")
            email = st.text_input("Email", key="cu_email")
            tipo_usuario = st.selectbox("Tipo de usuario", TIPOS_USUARIO, key="cu_tipo")
        with col2:
            fecha_nacimiento = st.date_input(
                "Fecha de nacimiento", value=date(1990, 1, 1), key="cu_fnac"
            )
            fecha_registro = st.date_input(
                "Fecha de registro", value=date.today(), key="cu_freg"
            )
            es_vip = st.checkbox("Es VIP", key="cu_vip")
            activo = st.checkbox("Activo", value=True, key="cu_activo")

        if st.form_submit_button("Crear usuario"):
            payload = {
                "nombre": nombre,
                "email": email,
                "tipo_usuario": tipo_usuario,
                "fecha_nacimiento": _fecha_iso(fecha_nacimiento),
                "fecha_registro": _fecha_iso(fecha_registro),
                "es_vip": es_vip,
                "activo": activo,
            }
            try:
                api_client.post("/usuarios", payload)
                refrescar("Usuario creado correctamente.")
            except ErrorAPI as exc:
                mostrar_error(exc)

    if not usuarios:
        return

    mapa = {usuario["id"]: usuario for usuario in usuarios}
    seleccionado = st.selectbox(
        "Selecciona un usuario para editar o eliminar",
        list(mapa),
        format_func=lambda id_usuario: (
            f"{mapa[id_usuario]['nombre']} ({mapa[id_usuario]['email']})"
        ),
        key="admin_usuario_sel",
    )
    registro = mapa[seleccionado]
    fecha_nac = _parse_fecha(registro["fecha_nacimiento"]).date()
    fecha_reg = _parse_fecha(registro["fecha_registro"]).date()

    st.markdown("#### Editar usuario")
    with st.form(f"form_editar_usuario_{seleccionado}"):
        col1, col2 = st.columns(2)
        with col1:
            nombre = st.text_input(
                "Nombre", value=registro["nombre"], key=f"eu_nombre_{seleccionado}"
            )
            email = st.text_input(
                "Email", value=registro["email"], key=f"eu_email_{seleccionado}"
            )
            tipo_usuario = st.selectbox(
                "Tipo de usuario",
                TIPOS_USUARIO,
                index=TIPOS_USUARIO.index(registro["tipo_usuario"]),
                key=f"eu_tipo_{seleccionado}",
            )
        with col2:
            fecha_nacimiento = st.date_input(
                "Fecha de nacimiento",
                value=fecha_nac,
                key=f"eu_fnac_{seleccionado}",
            )
            fecha_registro = st.date_input(
                "Fecha de registro",
                value=fecha_reg,
                key=f"eu_freg_{seleccionado}",
            )
            es_vip = st.checkbox(
                "Es VIP", value=registro["es_vip"], key=f"eu_vip_{seleccionado}"
            )
            activo = st.checkbox(
                "Activo", value=registro["activo"], key=f"eu_activo_{seleccionado}"
            )

        if st.form_submit_button("Guardar cambios"):
            payload = {
                "nombre": nombre,
                "email": email,
                "tipo_usuario": tipo_usuario,
                "fecha_nacimiento": _fecha_iso(fecha_nacimiento),
                "fecha_registro": _fecha_iso(fecha_registro),
                "es_vip": es_vip,
                "activo": activo,
            }
            try:
                api_client.put(f"/usuarios/{seleccionado}", payload)
                refrescar("Usuario actualizado correctamente.")
            except ErrorAPI as exc:
                mostrar_error(exc)

    st.markdown("#### Eliminar usuario")
    with st.form(f"form_eliminar_usuario_{seleccionado}"):
        confirmar = st.checkbox(
            "Confirmo que deseo eliminar este usuario",
            key=f"del_usuario_{seleccionado}",
        )
        if st.form_submit_button("Eliminar usuario"):
            if not confirmar:
                st.warning("Debes confirmar la eliminación.")
            else:
                try:
                    api_client.delete(f"/usuarios/{seleccionado}")
                    refrescar("Usuario eliminado correctamente.")
                except ErrorAPI as exc:
                    mostrar_error(exc)


def _campos_evento(prefijo: str, defaults: dict | None = None):
    defaults = defaults or {}
    recinto = defaults.get("recinto", {})
    fecha = _parse_fecha(defaults.get("fecha_evento")) if defaults.get("fecha_evento") else datetime.now()

    codigo = st.text_input("Código", value=defaults.get("codigo", ""), key=f"{prefijo}_codigo")
    nombre = st.text_input("Nombre", value=defaults.get("nombre", ""), key=f"{prefijo}_nombre")
    indice_categoria = (
        CATEGORIAS.index(defaults["categoria"])
        if defaults.get("categoria") in CATEGORIAS
        else 0
    )
    categoria = st.selectbox(
        "Categoría", CATEGORIAS, index=indice_categoria, key=f"{prefijo}_categoria"
    )
    descripcion = st.text_area(
        "Descripción", value=defaults.get("descripcion") or "", key=f"{prefijo}_descripcion"
    )
    col1, col2 = st.columns(2)
    with col1:
        fecha_evento = st.date_input("Fecha del evento", value=fecha.date(), key=f"{prefijo}_fecha")
    with col2:
        hora_evento = st.time_input(
            "Hora del evento",
            value=fecha.time().replace(microsecond=0),
            key=f"{prefijo}_hora",
        )
    activo = st.checkbox("Activo", value=defaults.get("activo", True), key=f"{prefijo}_activo")

    st.markdown("**Recinto**")
    rec1, rec2 = st.columns(2)
    with rec1:
        nombre_recinto = st.text_input(
            "Nombre del recinto", value=recinto.get("nombre", ""), key=f"{prefijo}_recinto_nombre"
        )
        ciudad = st.text_input(
            "Ciudad", value=recinto.get("ciudad", ""), key=f"{prefijo}_ciudad"
        )
    with rec2:
        calle = st.text_input(
            "Calle", value=recinto.get("calle", ""), key=f"{prefijo}_calle"
        )
        capacidad = st.number_input(
            "Capacidad",
            min_value=1,
            value=int(recinto.get("capacidad", 1000)),
            step=100,
            key=f"{prefijo}_capacidad",
        )

    st.markdown("**Tickets disponibles**")
    tickets_df = st.data_editor(
        _df_tickets(defaults.get("tickets_disponibles")),
        num_rows="dynamic",
        key=f"{prefijo}_tickets",
        width="stretch",
    )

    return {
        "codigo": codigo,
        "nombre": nombre,
        "categoria": categoria,
        "descripcion": descripcion or "",
        "fecha_evento": _fecha_iso(fecha_evento, hora_evento),
        "activo": activo,
        "recinto": {
            "nombre": nombre_recinto,
            "calle": calle,
            "ciudad": ciudad,
            "capacidad": int(capacidad),
        },
        "tickets_disponibles": _tickets_desde_df(tickets_df),
    }


def admin_eventos() -> None:
    st.subheader("Eventos")
    try:
        eventos = consultar("/eventos")
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    if eventos:
        st.dataframe(pd.DataFrame(eventos), hide_index=True, width="stretch")
    else:
        st.info("No hay eventos registrados.")

    st.markdown("#### Crear evento")
    with st.form("form_crear_evento", clear_on_submit=True):
        payload = _campos_evento("ce")
        if st.form_submit_button("Crear evento"):
            try:
                api_client.post("/eventos", payload)
                refrescar("Evento creado correctamente.")
            except ErrorAPI as exc:
                mostrar_error(exc)

    if not eventos:
        return

    mapa = {evento["id"]: evento for evento in eventos}
    seleccionado = st.selectbox(
        "Selecciona un evento para editar o eliminar",
        list(mapa),
        format_func=lambda id_evento: (
            f"{mapa[id_evento]['nombre']} ({mapa[id_evento]['codigo']})"
        ),
        key="admin_evento_sel",
    )
    registro = mapa[seleccionado]

    st.markdown("#### Editar evento")
    with st.form(f"form_editar_evento_{seleccionado}"):
        payload = _campos_evento(f"ee_{seleccionado}", registro)
        if st.form_submit_button("Guardar cambios"):
            try:
                api_client.put(f"/eventos/{seleccionado}", payload)
                refrescar("Evento actualizado correctamente.")
            except ErrorAPI as exc:
                mostrar_error(exc)

    st.markdown("#### Eliminar evento")
    with st.form(f"form_eliminar_evento_{seleccionado}"):
        confirmar = st.checkbox(
            "Confirmo que deseo eliminar este evento",
            key=f"del_evento_{seleccionado}",
        )
        if st.form_submit_button("Eliminar evento"):
            if not confirmar:
                st.warning("Debes confirmar la eliminación.")
            else:
                try:
                    api_client.delete(f"/eventos/{seleccionado}")
                    refrescar("Evento eliminado correctamente.")
                except ErrorAPI as exc:
                    mostrar_error(exc)


def admin_ordenes() -> None:
    st.subheader("Órdenes de compra")
    try:
        ordenes = consultar("/ordenes")
        usuarios, eventos = _cargar_base()
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    if ordenes:
        st.dataframe(pd.DataFrame(ordenes), hide_index=True, width="stretch")
    else:
        st.info("No hay órdenes registradas.")

    if not usuarios or not eventos:
        st.info("Necesitas al menos un usuario y un evento para crear órdenes.")
        return

    mapa_usuarios = {usuario["id"]: usuario for usuario in usuarios}
    mapa_eventos = {evento["id"]: evento for evento in eventos}

    st.markdown("#### Crear orden")
    col1, col2 = st.columns(2)
    with col1:
        usuario_id = st.selectbox(
            "Usuario",
            list(mapa_usuarios),
            format_func=lambda id_usuario: mapa_usuarios[id_usuario]["nombre"],
            key="co_usuario",
        )
    with col2:
        evento_id = st.selectbox(
            "Evento",
            list(mapa_eventos),
            format_func=lambda id_evento: mapa_eventos[id_evento]["nombre"],
            key="co_evento",
        )
    evento = mapa_eventos[evento_id]
    tipos = [ticket["tipo"] for ticket in evento["tickets_disponibles"]]
    st.caption(f"Tipos de ticket del evento: {', '.join(tipos)}")

    with st.form("form_crear_orden", clear_on_submit=True):
        col1, col2 = st.columns(2)
        with col1:
            fecha_compra = st.date_input("Fecha de compra", value=date.today(), key="co_fecha")
        with col2:
            hora_compra = st.time_input("Hora de compra", value=time(12, 0), key="co_hora")
        estado = st.selectbox("Estado", ESTADOS_ORDEN, key="co_estado")
        confirmado = st.checkbox("Confirmada", value=True, key="co_confirmado")
        items_df = st.data_editor(
            _df_items(),
            num_rows="dynamic",
            key="co_items",
            width="stretch",
        )
        if st.form_submit_button("Crear orden"):
            items = _items_desde_df(items_df, evento)
            if not items:
                st.error("Selecciona al menos un tipo de ticket válido.")
            else:
                payload = {
                    "usuario_id": usuario_id,
                    "evento_id": evento_id,
                    "items": items,
                    "total": round(sum(item["subtotal"] for item in items), 2),
                    "fecha_compra": _fecha_iso(fecha_compra, hora_compra),
                    "estado": estado,
                    "confirmado": confirmado,
                }
                try:
                    api_client.post("/ordenes", payload)
                    refrescar("Orden creada correctamente.")
                except ErrorAPI as exc:
                    mostrar_error(exc)

    if not ordenes:
        return

    mapa_ordenes = {orden["id"]: orden for orden in ordenes}
    seleccionada = st.selectbox(
        "Selecciona una orden para editar o eliminar",
        list(mapa_ordenes),
        format_func=lambda id_orden: (
            f"{id_orden[:8]}... | {mapa_ordenes[id_orden]['estado']} | "
            f"${mapa_ordenes[id_orden]['total']:,.0f}"
        ),
        key="admin_orden_sel",
    )
    orden = mapa_ordenes[seleccionada]
    evento_actual = mapa_eventos.get(orden["evento_id"], eventos[0])

    st.markdown("#### Editar orden")
    col1, col2 = st.columns(2)
    with col1:
        usuario_edit = st.selectbox(
            "Usuario",
            list(mapa_usuarios),
            index=(
                list(mapa_usuarios).index(orden["usuario_id"])
                if orden["usuario_id"] in mapa_usuarios
                else 0
            ),
            format_func=lambda id_usuario: mapa_usuarios[id_usuario]["nombre"],
            key=f"eo_usuario_{seleccionada}",
        )
    with col2:
        evento_edit = st.selectbox(
            "Evento",
            list(mapa_eventos),
            index=(
                list(mapa_eventos).index(orden["evento_id"])
                if orden["evento_id"] in mapa_eventos
                else 0
            ),
            format_func=lambda id_evento: mapa_eventos[id_evento]["nombre"],
            key=f"eo_evento_{seleccionada}",
        )
    evento_edit_obj = mapa_eventos[evento_edit]

    fecha_orden = _parse_fecha(orden["fecha_compra"])
    with st.form(f"form_editar_orden_{seleccionada}"):
        col1, col2 = st.columns(2)
        with col1:
            fecha_compra = st.date_input(
                "Fecha de compra", value=fecha_orden.date(), key=f"eo_fecha_{seleccionada}"
            )
        with col2:
            hora_compra = st.time_input(
                "Hora de compra",
                value=fecha_orden.time().replace(microsecond=0),
                key=f"eo_hora_{seleccionada}",
            )
        estado = st.selectbox(
            "Estado",
            ESTADOS_ORDEN,
            index=ESTADOS_ORDEN.index(orden["estado"]),
            key=f"eo_estado_{seleccionada}",
        )
        confirmado = st.checkbox(
            "Confirmada", value=orden["confirmado"], key=f"eo_confirmado_{seleccionada}"
        )
        items_df = st.data_editor(
            _df_items(orden["items"]),
            num_rows="dynamic",
            key=f"eo_items_{seleccionada}",
            width="stretch",
        )
        if st.form_submit_button("Guardar cambios"):
            items = _items_desde_df(items_df, evento_edit_obj)
            if not items:
                st.error("Selecciona al menos un tipo de ticket válido.")
            else:
                payload = {
                    "usuario_id": usuario_edit,
                    "evento_id": evento_edit,
                    "items": items,
                    "total": round(sum(item["subtotal"] for item in items), 2),
                    "fecha_compra": _fecha_iso(fecha_compra, hora_compra),
                    "estado": estado,
                    "confirmado": confirmado,
                }
                try:
                    api_client.put(f"/ordenes/{seleccionada}", payload)
                    refrescar("Orden actualizada correctamente.")
                except ErrorAPI as exc:
                    mostrar_error(exc)

    st.markdown("#### Eliminar orden")
    with st.form(f"form_eliminar_orden_{seleccionada}"):
        confirmar = st.checkbox(
            "Confirmo que deseo eliminar esta orden",
            key=f"del_orden_{seleccionada}",
        )
        if st.form_submit_button("Eliminar orden"):
            if not confirmar:
                st.warning("Debes confirmar la eliminación.")
            else:
                try:
                    api_client.delete(f"/ordenes/{seleccionada}")
                    refrescar("Orden eliminada correctamente.")
                except ErrorAPI as exc:
                    mostrar_error(exc)


def admin_resenas() -> None:
    st.subheader("Reseñas y evaluaciones")
    try:
        resenas = consultar("/resenas")
        usuarios, eventos = _cargar_base()
    except ErrorAPI as exc:
        mostrar_error(exc)
        return

    if resenas:
        st.dataframe(pd.DataFrame(resenas), hide_index=True, width="stretch")
    else:
        st.info("No hay reseñas registradas.")

    if not usuarios or not eventos:
        st.info("Necesitas al menos un usuario y un evento para crear reseñas.")
        return

    mapa_usuarios = {usuario["id"]: usuario for usuario in usuarios}
    mapa_eventos = {evento["id"]: evento for evento in eventos}

    st.markdown("#### Crear reseña")
    with st.form("form_crear_resena", clear_on_submit=True):
        col1, col2 = st.columns(2)
        with col1:
            usuario_id = st.selectbox(
                "Usuario",
                list(mapa_usuarios),
                format_func=lambda id_usuario: mapa_usuarios[id_usuario]["nombre"],
                key="cr_usuario",
            )
            puntuacion = st.slider("Puntuación", 1, 5, 5, key="cr_puntuacion")
        with col2:
            evento_id = st.selectbox(
                "Evento",
                list(mapa_eventos),
                format_func=lambda id_evento: mapa_eventos[id_evento]["nombre"],
                key="cr_evento",
            )
            fecha_resena = st.date_input("Fecha de la reseña", value=date.today(), key="cr_fecha")
        comentario = st.text_area("Comentario", key="cr_comentario")
        recomendado = st.checkbox("Recomendado", value=True, key="cr_recomendado")

        if st.form_submit_button("Crear reseña"):
            payload = {
                "usuario_id": usuario_id,
                "evento_id": evento_id,
                "puntuacion": puntuacion,
                "comentario": comentario,
                "fecha_resena": _fecha_iso(fecha_resena),
                "recomendado": recomendado,
            }
            try:
                api_client.post("/resenas", payload)
                refrescar("Reseña creada correctamente.")
            except ErrorAPI as exc:
                mostrar_error(exc)

    if not resenas:
        return

    mapa_resenas = {resena["id"]: resena for resena in resenas}
    seleccionada = st.selectbox(
        "Selecciona una reseña para editar o eliminar",
        list(mapa_resenas),
        format_func=lambda id_resena: (
            f"{id_resena[:8]}... | {mapa_resenas[id_resena]['puntuacion']} / 5"
        ),
        key="admin_resena_sel",
    )
    resena = mapa_resenas[seleccionada]
    fecha_resena_actual = _parse_fecha(resena["fecha_resena"])

    st.markdown("#### Editar reseña")
    with st.form(f"form_editar_resena_{seleccionada}"):
        col1, col2 = st.columns(2)
        with col1:
            usuario_edit = st.selectbox(
                "Usuario",
                list(mapa_usuarios),
                index=(
                    list(mapa_usuarios).index(resena["usuario_id"])
                    if resena["usuario_id"] in mapa_usuarios
                    else 0
                ),
                format_func=lambda id_usuario: mapa_usuarios[id_usuario]["nombre"],
                key=f"er_usuario_{seleccionada}",
            )
            puntuacion = st.slider(
                "Puntuación",
                1,
                5,
                int(resena["puntuacion"]),
                key=f"er_puntuacion_{seleccionada}",
            )
        with col2:
            evento_edit = st.selectbox(
                "Evento",
                list(mapa_eventos),
                index=(
                    list(mapa_eventos).index(resena["evento_id"])
                    if resena["evento_id"] in mapa_eventos
                    else 0
                ),
                format_func=lambda id_evento: mapa_eventos[id_evento]["nombre"],
                key=f"er_evento_{seleccionada}",
            )
            fecha_resena = st.date_input(
                "Fecha de la reseña",
                value=fecha_resena_actual.date(),
                key=f"er_fecha_{seleccionada}",
            )
        comentario = st.text_area(
            "Comentario", value=resena["comentario"], key=f"er_comentario_{seleccionada}"
        )
        recomendado = st.checkbox(
            "Recomendado", value=resena["recomendado"], key=f"er_recomendado_{seleccionada}"
        )

        if st.form_submit_button("Guardar cambios"):
            payload = {
                "usuario_id": usuario_edit,
                "evento_id": evento_edit,
                "puntuacion": puntuacion,
                "comentario": comentario,
                "fecha_resena": _fecha_iso(fecha_resena),
                "recomendado": recomendado,
            }
            try:
                api_client.put(f"/resenas/{seleccionada}", payload)
                refrescar("Reseña actualizada correctamente.")
            except ErrorAPI as exc:
                mostrar_error(exc)

    st.markdown("#### Eliminar reseña")
    with st.form(f"form_eliminar_resena_{seleccionada}"):
        confirmar = st.checkbox(
            "Confirmo que deseo eliminar esta reseña",
            key=f"del_resena_{seleccionada}",
        )
        if st.form_submit_button("Eliminar reseña"):
            if not confirmar:
                st.warning("Debes confirmar la eliminación.")
            else:
                try:
                    api_client.delete(f"/resenas/{seleccionada}")
                    refrescar("Reseña eliminada correctamente.")
                except ErrorAPI as exc:
                    mostrar_error(exc)


def render_administracion() -> None:
    st.header("Panel de administración")
    st.caption(
        "Operaciones de creación, edición y eliminación sobre las cuatro "
        "colecciones de Eventify. Todas las acciones se ejecutan vía API REST."
    )
    tab1, tab2, tab3, tab4 = st.tabs(
        ["Usuarios", "Eventos", "Órdenes", "Reseñas"]
    )
    with tab1:
        admin_usuarios()
    with tab2:
        admin_eventos()
    with tab3:
        admin_ordenes()
    with tab4:
        admin_resenas()


if seccion == "Indicadores":
    render_indicadores()
elif seccion == "Consultas analíticas":
    render_consultas()
else:
    render_administracion()
