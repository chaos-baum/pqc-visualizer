# PQC KEM Visualizer

## Technologie-Stack

### Backend

*   **Sprache:** Python 3.11
*   **Framework:** FastAPI
*   **Kryptographie-Bibliothek:** `liboqs-python` (Python-Wrapper für die C-Bibliothek `liboqs`)

### Frontend

*   **Technologien:** Vanilla JavaScript (ES6 Module), HTML5, CSS3
*   **MathJax:** Zum Rendern von LaTeX-Formeln im Browser.

## Installation und Ausführung

### Voraussetzungen

*   Python 3.11+
*   Der Paketmanager `uv`

## Anleitung

### Backend starten

Öffnen Sie ein Terminal und führen Sie die folgenden Befehle aus:

```sh
cd webapp/backend

uv sync

uvicorn main:app --reload --port 7888
```

Das Backend ist nun unter `http://localhost:7888` erreichbar.

### Frontend starten

Öffnen Sie ein zweites Terminal und führen Sie die folgenden Befehle aus:

```sh
cd webapp/frontend

python3 -m http.server 8222
```

