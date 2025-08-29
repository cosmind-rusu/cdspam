# SPRINT 0 — Requisitos (resumen)

- Objetivo: mover spam a Spam; archivar/etiquetar newsletters/notificaciones; sin eliminación automática.
- Alcance: Gmail personal; 1 cuenta/usuario.
- Señales: DKIM/SPF/Authentication-Results; List-Unsubscribe; remitente nuevo.
- Enfoque: conservador, revisión manual, whitelists/blacklists; regla antigüedad (>90 días promos).
- Privacidad: sin contenido persistido; metadatos cifrados; logs mínimos.
- Auth: OAuth2; gmail.readonly + gmail.modify; polling.
- Métricas: reducción de no deseados, falsos positivos, mails limpiados; alertas backend.
- Stack: Node.js/TS; GCP serverless + SPA; CI con GitHub Actions.
- Repo: público `cdspam` (usuario cosmind-rusu); MIT; plantillas de issues/PR.
