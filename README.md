# Neos Lab

## Cerbot:

Standalone (use port 80)

```
# Install cerificates
sudo apt install certbot
sudo certbot certonly --standalone -d example.com -d www.example.com

# Check current certificates
sudo certbot certificates
```

### Cerbot dir

```
/etc/letsencrypt/
├── live/
│   └── tudominio.com/
│       ├── cert.pem         # Certificado
│       ├── chain.pem        # Cadena de certificados
│       ├── fullchain.pem    # Certificado completo (cert + cadena)
│       ├── privkey.pem      # Clave privada
├── archive/
└── renewal/

```

## Architecture

```


                 +-------------------+
                 |  Cliente (Web/App) |
                 +-------------------+
                          |
                          v
                 +------------------+
                 |  Proxy Inverso    |
                 |      (Nginx)      |
                 +------------------+
                          |
    +---------------------+---------------------+
    |                     |                     |
    v                     v                     v
+-------------+     +-------------+     +----------------+
| Node Frontend |  |   PHP API    |     |  Ollama API    |
+-------------+     +-------------+     +----------------+

```

---

## Despliegue desde red doméstica (Home Lab / ISP Router)

Este proyecto puede desplegarse perfectamente desde una red doméstica, **sin necesidad de infraestructura cloud**, siempre que se realicen correctamente ciertas configuraciones en el router del proveedor de internet (ISP).

> **Estado actual:**
> El despliegue **funciona correctamente desde internet externo**. Sin embargo, **el acceso desde la misma red local (LAN) presenta limitaciones debido al router del ISP (NAT Loopback / Hairpin NAT)**. Este punto queda **pendiente de solución definitiva**.

---

### 1. Esquema de red

```
Internet
    |
    v
IP pública (ISP)
    |
    v
Router doméstico
    |
    v
Servidor local (Ubuntu + Docker + Nginx)
```

El servidor corre dentro de la LAN, pero expone servicios HTTPS al exterior mediante **port forwarding**.

---

### 2. Requisitos mínimos

* IP pública (dinámica o estática)
* Router con soporte de:

  * Reenvío de puertos (Port Forwarding)
  * NAT estándar
* Dominio público apuntando a tu IP

---

### 3. Configuración crítica del router

Estas configuraciones son **imprescindibles** para que el despliegue funcione correctamente:

#### 3.1 Reenvío de puertos (Port Forwarding)

Se deben mapear los siguientes puertos del router hacia la IP local del servidor:

| Puerto Público | Protocolo | IP LAN Servidor | Puerto LAN |
| -------------- | --------- | --------------- | ---------- |
| 80             | TCP       | 192.168.1.94    | 80         |
| 443            | TCP       | 192.168.1.94    | 443        |

> Esto permite que Let's Encrypt, los navegadores y clientes externos puedan acceder correctamente a los servicios.

---

### 4. Certificados SSL (Let's Encrypt)

Los certificados se generan correctamente mediante **certbot en modo standalone**, utilizando el puerto 80 expuesto por el router.

Ejemplo:

```
sudo certbot certonly --standalone -d neoslab.dev -d www.neoslab.dev
sudo certbot certonly --standalone -d neosoir.com -d www.neosoir.com
```

---

### 5. Problema actual: NAT Loopback / Hairpin NAT

Muchos routers domésticos **NO soportan NAT loopback**. Esto provoca el siguiente comportamiento:

* Desde **internet externo (datos móviles, otra red)** → los dominios funcionan correctamente.
* Desde la **misma red local (LAN)** → el router intercepta la conexión y muestra páginas propias como:

```
http://192.168.1.254/interception.html
```

o presenta **certificados autofirmados del router**.

Esto **NO es un error del servidor, Docker ni Nginx**, sino una **limitación del firmware del router del ISP**.

---

### 6. Estado de mitigación

Se realizaron pruebas con:

* `/etc/hosts`
* Resolución DNS local
* Redirección directa a IP LAN

**Resultado:**

> Ninguna de estas soluciones resolvió completamente el problema debido a la arquitectura interna del router.

Por el momento, el flujo queda documentado y **se deja pendiente una solución definitiva**, que podrá abordarse mediante:

* Router neutro propio (reemplazando el del ISP)
* DNS interno local (Pi-hole / Unbound)
* Split-horizon DNS

---

### 7. Flujo final de producción

```
Usuarios externos → Internet → IP pública → Router → Port Forward → Nginx → Docker → App
```

```
Usuarios internos → LAN → Router → (limitación NAT Loopback) → Intercepción del router
```

---

### Nota pendiente

> ⚠️ **Pendiente:** Resolver acceso limpio desde la misma red LAN hacia los dominios públicos sin redirección del router.
>
> Este punto se abordará posteriormente mediante mejoras en infraestructura de red local.
