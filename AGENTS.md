# NeosLab Site - Documentación del Proyecto

## Descripción

NeosLab es una aplicación web que funciona como asistente virtual basado en Ollama (LLM local). El proyecto está configurado con Docker Compose para facilitar el desarrollo y despliegue.

## Estructura del Proyecto

```
Projects/Neos-Lab-Site/
├── .env                    # Variables de entorno
├── docker-compose.yml      # Configuración de producción
├── docker-compose.dev.yml  # Configuración de desarrollo
├── Docker/                 # Configuraciones Nginx (producción)
├── Docker.dev/             # Configuraciones Nginx (desarrollo)
└── frontend/               # Aplicación React/Vite
```

## Configuración de Red y Puertos (Desarrollo)

### Servicios

| Servicio | Contenedor | Puerto Interno | Expuesto a Host |
|----------|------------|----------------|-----------------|
| **revproxy** | `ctr_neoslab_revproxy_dev` | 80 | ✅ 80 |
| **frontend** | `ctr_neoslab_frontend_dev` | 5173 | ❌ |
| **ollama** | `ctr_neoslab_ollama_dev` | 11434 | ❌ |

### Arquitectura de Red

- **Red Docker:** `net_neoslab_dev` (driver bridge)
- Los contenedores se comunican entre sí usando nombres de servicio como hostnames
- Solo el puerto 80 (HTTP) está expuesto al host

### Flujo de Solicitudes

```
Navegador → http://localhost:80
                    │
                    ▼
            ┌───────────────┐
            │ Nginx (revproxy)│
            │   Puerto 80    │
            └───────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   / (frontend)            /ollama
        │                       │
        ▼                       ▼
  frontend:5173         ollama:11434
```

## Variables de Entorno (.env)

```bash
APP_URL=http://neoslab
OLLAMA_URL=http://ollama.neoslab
API_URL=http://api.neoslab
PRIMARY_DOMAIN=neoslab
SECONDARY_DOMAIN=neosoir

# Puertos (desarrollo)
INTERNAL_PORT=80
EXTERNAL_PORT=80
INTERNAL_PORT_SSL=443
EXTERNAL_PORT_SSL=443

# Ollama
OLLAMA_CONTEXT_LENGTH=4096
OLLAMA_USE_OPTIONS=false
OLLAMA_CPU_LIMIT=2
OLLAMA_RAM_LIMIT=6.5GB

# Permisos
HOST_UID=1000
HOST_GID=1000
```

## Cómo Ejecutar en Desarrollo

```bash
cd Projects/Neos-Lab-Site
docker-compose -f docker-compose.dev.yml up --build
```

Esto iniciara:
- Nginx reverse proxy en `localhost:80`
- Frontend Vite en modo desarrollo (puerto 5173 interno)
- Ollama API (puerto 11434 interno)

## Endpoints

- **Frontend:** `http://localhost:80`
- **Ollama API:** `http://localhost/ollama` (proxificado)
- **Vite Dev Server:** `http://localhost:5173` (solo acceso interno desde contenedor)

## Notas

- Los contenedores de frontend y ollama no exponen puertos directamente al host
- Toda comunicación pasa por el reverse proxy de Nginx
- Los certificados SSL no son necesarios en desarrollo

## Estilos

- **CSS puro** con CSS Nesting (anidamiento nativo)
- **NO** se usa Tailwind CSS u otras librerías de estilos
- Los archivos de estilos están en `frontend/src/*.css`
- Se utilizan variables CSS en `:root` para colores y theme
