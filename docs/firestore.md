# Firestore — Esquema propuesto (SPRINT 1.2)

Colección raíz: `users/{userId}`

Subcolecciones y docs:
- `rules/{ruleId}`: Regla de limpieza.
  - Índice: orderBy(`priority` asc)
- `whitelist/{entryId}`: Lista blanca.
- `config/labelMapping` (doc único): IDs de etiquetas Gmail (`review`, `archive`, `junk`).
- `candidates/{messageId}`: Candidatos detectados para limpiar.
  - Opcional TTL: campo `ttlAt` (timestamp) para expirar candidatos antiguos.
- `auditLogs/{autoId}`: Historial de acciones.
  - Índice: orderBy(`timestamp` desc)

Campos (resumen):
- Rule: `id`, `type`, `params`, `enabled`, `priority`, `createdAt`.
- WhitelistEntry: `id`, `userId`, `senderOrDomain`, `createdAt`.
- LabelMapping: `userId`, `labels.{review,archive,junk}`.
- MessageCandidate: `messageId`, `signals.*`, `appliedRuleId?`, `proposedAction`.
- AuditLog: `messageId`, `action`, `ruleId?`, `timestamp`.

Buenas prácticas:
- Minimizar datos: no guardar contenidos, solo metadatos.
- Cifrado: usar CMEK si aplica; evitar datos sensibles.
- Retención: TTL en `candidates` y políticas de borrado para `auditLogs` si se requiere.
- Seguridad: reglas restringidas por `userId`; el backend valida el sujeto OAuth.
