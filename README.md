# Markethers — Loyalty & Wallet OS

Plataforma integral de fidelización de clientes para negocios locales (cafeterías, restaurantes, barberías, boutiques, etc.) basada en **Apple Wallet** y **Google Wallet**, eliminando las tarjetas de cartón y las aplicaciones móviles pesadas.

---

## 🌟 Características Principales

1. **Tarjetas de Sellos Digitales en Apple Wallet & Google Wallet:**
   - Acumulación de sellos (punch cards) o puntos por consumo.
   - Guardado nativo en 1 toque en iPhone (Apple Wallet `.pkpass`) y Android (Google Wallet).
   - Notificaciones push en la pantalla de bloqueo al recibir sellos o al estar cerca del local.
   - Vista web interactiva para clientes con código QR único para caja.

2. **PWA Escáner para Personal / Cajeros (`/scanner`):**
   - Lectura de cámara de alta velocidad en tiempo real para cualquier celular o tablet.
   - Teclado de código manual para casos sin cámara.
   - Bloqueo por código PIN (PIN demo: `1234`).
   - Botones rápidos: `+1 Sello`, `+2 Sellos` o `Canjear Premio`.
   - Audio feedback (bip de escáner) y animación de confeti.

3. **InfoLink & Menú Digital (`/[slug]`):**
   - Landing page móvil ultra rápida para Instagram bio o QR en mesas.
   - Catálogo de productos con categorías, precios y fotos.
   - Carrito de compras integrado con checkout directo a **WhatsApp**.
   - Ubicación, horarios y redes sociales.

4. **Dashboard de Negocio (`/dashboard`):**
   - **Métricas:** Clientes registrados, pases en Wallet, sellos entregados, recompensas y tasa de retorno.
   - **CRM:** Base de clientes con búsqueda, visitas y botón directo para reactivar clientes inactivos por WhatsApp.
   - **Diseñador de Tarjeta en Vivo:** Cambia colores, logo, cantidad de sellos (5, 6, 8, 10), íconos (café, tijeras, comida, estrellas) y previsualiza la tarjeta de Apple Wallet en tiempo real.
   - **Generador de Stand para Mostrador:** Genera pósters y stands de mesa con código QR listos para imprimir en PDF.

---

## 🚀 Inicio Rápido Local

### 1. Requisitos
- Node.js 18+ (o Node 22+)
- npm

### 2. Ejecutar en Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧭 Rutas Clave de la Plataforma

| Ruta | Descripción |
| :--- | :--- |
| `/` | Landing page principal de la plataforma SaaS |
| `/aroma-cafe` | Tienda de demostración para clientes (Cafetería) |
| `/barber-king` | Tienda de demostración (Barbería) |
| `/burger-craft` | Tienda de demostración (Hamburguesería) |
| `/scanner` | Escáner PWA para cajeros y meseros (PIN: `1234`) |
| `/dashboard` | Panel de control para el dueño del comercio |
| `/api/wallet/apple/[token]` | Endpoint para descarga e inspección de pases Apple Wallet |
| `/api/wallet/google/[token]` | Endpoint para pases Google Wallet |

---

## ☁️ ¿Cómo Montarlo en la Web (Producción)?

### Paso 1: Subir a GitHub
```bash
git add .
git commit -m "feat: initial commit markethers loyalty platform"
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

### Paso 2: Desplegar en Vercel (Recomendado)
1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
2. Haz clic en **Add New... > Project** y selecciona tu repositorio.
3. Haz clic en **Deploy**. ¡En menos de 2 minutos tu sistema estará en internet con HTTPS gratis!

---

## 📱 Configuración Oficial de Wallets

### Apple Wallet (`.pkpass`):
1. Inscríbete en el [Apple Developer Program](https://developer.apple.com) ($99/año).
2. Crea un **Pass Type ID** (ej: `pass.com.tudominio.loyalty`).
3. Genera el certificado `.p12` y el certificado intermedio de Apple WWDR.
4. Configura tus variables de entorno en Vercel:
   - `APPLE_PASS_TYPE_ID`
   - `APPLE_TEAM_ID`
   - `APPLE_CERT_P12_BASE64`

### Google Wallet:
1. Crea una cuenta en [Google Cloud Console](https://console.cloud.google.com) y habilita **Google Wallet API**.
2. Ve a [Google Pay & Wallet Business Console](https://pay.google.com/business/console) y crea un **Issuer ID**.
3. Descarga las credenciales de tu Service Account (JSON) y configura:
   - `GOOGLE_ISSUER_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
