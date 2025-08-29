# SPRINT 1 — Data models

## Entidades
- User, GmailAccount, Rule, Whitelist/Blacklist, LabelMapping, MessageCandidate, AuditLog, Schedule, RateLimitState, UnsubscribeTask.

## Esquemas (Zod)
- `src/schemas/*.ts` definen validación para Rule, Lists y MessageCandidate.

## Fixtures
- `fixtures/*.json` con ejemplos para tests.

## Tests
- `tests/schemas.spec.ts` valida que los fixtures pasan los esquemas.

## Próximo
- Integración Firestore (colecciones y reglas de indexado).
