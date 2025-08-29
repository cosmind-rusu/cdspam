# cdspam

cdspam limpia tu Gmail: mueve spam a Spam y archiva/etiqueta newsletters y notificaciones con revisión manual.

- Backend: Node.js/TypeScript (serverless en GCP).
- OAuth2: scopes gmail.readonly + gmail.modify.
- Privacidad: no almacenamos contenido de emails; solo metadatos mínimos y cifrados.

## Sprints
- 0: Requisitos (este repo incluye PRD inicial en `docs/SPRINT-0.md`)
- 1: Data models
- 2: APIs
- 3: UI/UX
- 4: Despliegue
- Documentación

## Estado MVP
- Autenticación Google OAuth.
- Listado de candidatos según reglas conservadoras (DKIM/SPF/List-Unsubscribe/antigüedad/whitelists).
- Confirmación manual y ejecución de mover a Spam/archivar/etiquetar.

## Desarrollo
- Requisitos: Node 18+, proyecto GCP, credenciales OAuth (pendiente de SPRINT 2).
- CI: GitHub Actions básico (`.github/workflows/ci.yml`).

## Seguridad y privacidad
- Sin contenido persistido; ver `docs/privacy.md` y `docs/terms.md`.

## Licencia
MIT
