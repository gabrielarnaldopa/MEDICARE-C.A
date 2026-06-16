# MEDICARE — Panel de ventas

Panel web para administrar el bot de ventas "Sofía": ver chats de WhatsApp,
inventario, vendedores por zona, cotizaciones y configuración del bot.

Hecho con React + Vite + Tailwind CSS.

## Probar en tu computadora
```bash
npm install
npm run dev
```
Abre la dirección que aparece (normalmente http://localhost:5173).

## Subir a Railway
1. Sube esta carpeta a un repositorio de GitHub.
2. En Railway: New Project → Deploy from GitHub repo → elige el repo.
3. Railway detecta el `Dockerfile` y construye la página solo.
4. Cuando termine: Settings → Networking → Generate Domain.
5. Abre ese dominio y verás el panel en línea.

> Alternativa sin GitHub: instala la CLI con `npm i -g @railway/cli`,
> luego `railway login`, `railway init` y `railway up` dentro de esta carpeta.

## Nota
Por ahora el panel muestra datos de ejemplo. Conectarlo a datos reales
(Supabase + n8n) es el siguiente paso.
