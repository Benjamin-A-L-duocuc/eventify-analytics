from __future__ import annotations

import os
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
PREFIJO = "/api/v1"


class ErrorAPI(Exception):
    """Error controlado al comunicarse con la API REST."""


def _url(path: str) -> str:
    if not path.startswith("/"):
        path = "/" + path
    return f"{API_BASE_URL}{PREFIJO}{path}"


def _solicitar(metodo: str, path: str, **kwargs):
    try:
        respuesta = requests.request(metodo, _url(path), timeout=20, **kwargs)
    except requests.RequestException as exc:
        raise ErrorAPI(
            f"No se pudo conectar con la API en {API_BASE_URL}. "
            f"Verifica que uvicorn esté ejecutándose. Detalle: {exc}"
        ) from exc

    if respuesta.status_code >= 400:
        try:
            detalle = respuesta.json().get("detail", respuesta.text)
        except ValueError:
            detalle = respuesta.text

        if isinstance(detalle, list):
            detalle = "; ".join(
                str(item.get("msg", item)) if isinstance(item, dict) else str(item)
                for item in detalle
            )
        raise ErrorAPI(f"Error {respuesta.status_code}: {detalle}")

    if respuesta.content:
        return respuesta.json()
    return None


def get(path: str, params: dict | None = None):
    return _solicitar("GET", path, params=params)


def post(path: str, payload: dict):
    return _solicitar("POST", path, json=payload)


def put(path: str, payload: dict):
    return _solicitar("PUT", path, json=payload)


def delete(path: str):
    return _solicitar("DELETE", path)
