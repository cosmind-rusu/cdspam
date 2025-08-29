# Configuración de entorno

## Variables
- `STORAGE_DRIVER`: `inmemory` (por defecto) o `firestore`.
- `FIRESTORE_PROJECT_ID`: requerido si usas Firestore real.
- `GOOGLE_APPLICATION_CREDENTIALS`: ruta a credencial de cuenta de servicio (JSON) para ADC.
- `FIRESTORE_EMULATOR_HOST`: host del emulador (p.ej. `localhost:8080`). Si está definida, el SDK usa el emulador.

## Opciones de autenticación
- Emulador Firestore: no requiere login; arranca el emulador y define `FIRESTORE_EMULATOR_HOST`.
- Producción GCP:
  - Opción A: credencial de servicio (recomendada en backend). Asigna roles mínimos (Firestore User/Viewer segun operación). Exporta `GOOGLE_APPLICATION_CREDENTIALS` apuntando al JSON.
  - Opción B: `gcloud auth application-default login` en entorno de desarrollo.

## Ejemplos (.env)
Consulta `.env.example` y copia a `.env` ajustando valores.
