# MongoDB Backup

API REST para realizar backup y restore de bases de datos MongoDB.

## Funcionalidades

- **Backup**: Genera un dump de MongoDB, lo comprime en ZIP y lo sube a la nube
- **Restore**: Restaura una base de datos desde un archivo ZIP de backup

## Requisitos

- Node.js 20+
- MongoDB Database Tools (mongodump, mongorestore)
- Docker (opcional)

## Instalación

```bash
npm install
```

## Configuración

Crear un archivo `.env` con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Password para autenticar las peticiones
API_PASSWORD=tu_password_seguro

# URI de conexión a MongoDB
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/baseDatos

# Ruta donde se almacenan temporalmente los backups
BACKUP_PATH=./backups

# URL de la API para subir archivos a la nube
PHPFILES_URL=https://tu-api.com/backup

# Password de la API de cloud
PHPFILES_PASSWORD=password_api
```

## Ejecución

### Modo desarrollo

```bash
npm start
```

### Con Docker

```bash
npm run docker
```

## API Endpoints

### GET `/`

Verifica que el servidor esté corriendo.

**Respuesta:**
```json
{ "success": true }
```

---

### POST `/backup`

Crea un backup de la base de datos MongoDB.

**Headers:**
- `x-password`: Password de la API

**Body:**
```json
{
  "password": "tu_password"
}
```

**Respuesta exitosa:**
```json
{ "success": true }
```

**Respuesta de error:**
```json
{
  "success": false,
  "error": "mensaje de error"
}
```

---

### POST `/restore`

Restaura un backup desde un archivo ZIP.

**Headers:**
- `x-password`: Password de la API

**Body (form-data):**
- `backup`: Archivo ZIP del backup
- `databaseName`: Nombre de la base de datos a restaurar
- `password`: Password de la API

**Respuesta exitosa:**
```json
{ "success": true }
```

**Respuesta de error:**
```json
{
  "success": false,
  "error": "mensaje de error"
}
```

## Ejemplo de uso con curl

```bash
# Crear backup
curl -X POST http://localhost:3000/backup \
  -H "Content-Type: application/json" \
  -d '{"password": "tu_password"}'

# Restaurar backup
curl -X POST http://localhost:3000/restore \
  -H "x-password: tu_password" \
  -F "backup=@/path/to/backup.zip" \
  -F "databaseName=nombre_base_datos"
```

## Notas

- El directorio `backups` y `uploads` deben existir o ser creados automáticamente
- Los archivos de backup se eliminan después de subirse a la nube
- El restore usa la opción `--drop` para reemplazar la base de datos existente