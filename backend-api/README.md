# Amanecer Literario

Backend para la libreria `Amanecer Literario`, construido con `Node.js`, `Express`, `MySQL` y `Sequelize`, siguiendo arquitectura por capas:

- `models`
- `repositories`
- `services`
- `controllers`
- `middlewares`

Incluye autenticacion JWT, inventario por ubicacion, carrito de compras, pedidos, dashboard administrativo y documentacion Swagger.

## Tecnologias

- `Node.js`
- `Express`
- `MySQL`
- `Sequelize`
- `JWT`
- `Swagger UI`

## Estructura

```txt
src/
├─ config/
├─ controllers/
├─ middlewares/
├─ models/
├─ repositories/
├─ routes/
├─ services/
├─ utils/
├─ app.js
└─ server.js
```

## Requisitos

- `Node.js` instalado
- `MySQL` instalado y corriendo
- Base de datos creada con nombre `amanecer`

## Variables de entorno

Archivo `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=amanecer
DB_USER=root
DB_PASSWORD=12345
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1d
FRONTEND_URL=https://ydtoloza-13082019.github.io
```

Para Supabase/PostgreSQL en Render, usa preferiblemente una sola variable:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1d
FRONTEND_URL=https://ydtoloza-13082019.github.io
```

## Instalacion

```bash
npm install
```

## Ejecucion

Modo normal:

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

## Usuario administrador inicial

Si la tabla `usuarios` esta vacia al arrancar, el sistema crea automaticamente este usuario:

- `email`: `admin@amanecerliterario.com`
- `password`: `Admin12345`

## URLs importantes

- Health check: [http://localhost:3000/health](http://localhost:3000/health)
- API base: [http://localhost:3000/api](http://localhost:3000/api)
- Swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Autenticacion

La API usa JWT con el header:

```txt
Authorization: Bearer <token>
```

Flujo basico:

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. usar el token recibido en las demas rutas protegidas

## Modulos principales

### Auth y usuarios

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/usuarios`
- `POST /api/usuarios`

### Categorias

- `GET /api/categorias`
- `GET /api/categorias/:id`
- `POST /api/categorias`
- `PUT /api/categorias/:id`
- `DELETE /api/categorias/:id`

### Libros

- `GET /api/libros`
- `GET /api/libros/:id`
- `POST /api/libros`
- `PUT /api/libros/:id`
- `DELETE /api/libros/:id`

### Ferias

- `GET /api/ferias`
- `GET /api/ferias/:id`
- `POST /api/ferias`
- `PUT /api/ferias/:id`
- `DELETE /api/ferias/:id`

### Inventario

- `GET /api/inventarios`
- `GET /api/inventarios/:id`
- `POST /api/inventarios`
- `PUT /api/inventarios/:id`
- `DELETE /api/inventarios/:id`
- `GET /api/inventarios/libro/:libroId/disponibilidad`

## Regla clave de inventario

El inventario no es general, sino por ubicacion:

- `ubicacion_tipo`: `almacen` o `feria`
- `ubicacion_id`: `0` si es almacen, o el `id` de la feria

Esto permite responder:

`¿Donde esta disponible este libro?`

## Carrito y pedidos

### Carrito

- `GET /api/carrito`
- `POST /api/carrito/agregar`
- `PUT /api/carrito/item/:id`
- `DELETE /api/carrito/item/:id`
- `POST /api/carrito/confirmar`

### Pedidos

- `GET /api/pedidos`
- `GET /api/pedidos/:id`
- `PATCH /api/pedidos/:id/cancelar`

## Flujo de compra

El flujo implementado es:

1. el cliente agrega libros al carrito
2. el carrito no guarda precios ni toca inventario
3. al confirmar la compra:
   - se valida stock real
   - se bloquean filas de inventario con transaccion
   - se crea el pedido
   - se crean los detalles con el precio actual del libro
   - se descuenta inventario
   - se eliminan los items del carrito
   - el carrito confirmado se cierra y luego se crea uno nuevo cuando se consulte otra vez

## Restriccion importante de base de datos

La base de datos impide que un usuario tenga mas de un carrito activo al mismo tiempo.

Al arrancar el servidor:

- se corrigen duplicados viejos si existieran
- se crea una restriccion unica funcional en MySQL para `carritos`

## Dashboard admin

Endpoint:

- `GET /api/admin/dashboard`

Devuelve:

- resumen de ventas
- pedidos por estado
- libros mas vendidos
- inventario con stock bajo

Solo lo puede consumir un usuario con rol `admin`.

## Paginacion y filtros

Varios listados responden con esta forma:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total_items": 0,
    "total_pages": 0
  }
}
```

## Postman

Archivos listos para importar:

- [Amanecer-Literario-JWT.postman_collection.json](C:\Users\Usuario\Documents\Codex\2026-04-28-quiero-que-me-ayudes-a-construir\amanecer-literario\postman\Amanecer-Literario-JWT.postman_collection.json)
- [Amanecer-Literario-JWT.postman_environment.json](C:\Users\Usuario\Documents\Codex\2026-04-28-quiero-que-me-ayudes-a-construir\amanecer-literario\postman\Amanecer-Literario-JWT.postman_environment.json)

Flujo recomendado:

1. `Login Admin`
2. crear categoria
3. crear libro
4. crear feria
5. crear inventario
6. `Register Cliente`
7. `Login Cliente`
8. carrito
9. confirmar compra
10. revisar pedidos

## Estado actual del proyecto

El backend ya incluye:

- autenticacion JWT
- roles `admin` y `cliente`
- CRUD base de categorias, libros, ferias e inventario
- inventario por ubicacion
- carrito de compras
- pedidos y detalle de pedidos
- cancelacion de pedidos con devolucion de stock
- dashboard administrativo
- Swagger

## Notas

- Si cambias el schema o agregas nuevas restricciones, reinicia el servidor.
- Si estas probando con Postman, asegurate de usar la coleccion JWT y no una coleccion vieja con `x-rol`.
