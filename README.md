# Catálogo de cuentas (Aravia)

Módulo que administra el catálogo de cuentas contables: API en NestJS y pantalla en React.

## Cómo correrlo

Requiere Node 22 y npm 10 o superior.

```bash
npm install     # instala la raíz, api/ y web/
npm run dev     # levanta la API (3000) y el front (5173)
```

Abre http://localhost:5173. La API arranca precargada con el catálogo de ejemplo del enunciado.

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/accounts` | Devuelve el catálogo como árbol anidado (con `level` y `nature`) |
| POST | `/accounts` | Crea una cuenta: `{ code, name, nature? }` |
| DELETE | `/accounts/:code` | Elimina una cuenta; rechaza si tiene hijas |

Los errores de negocio responden con `{ "field": "code", "message": "..." }` y estado 400 (validación), 404 (no existe) o 409 (código repetido o cuenta con hijas).

## Decisiones

**Backend con Clean Architecture** (`api/src/accounts/`):
- `domain/`: la entidad `Account`, los errores de dominio y la interfaz `AccountRepository`. No importa nada de NestJS ni de base de datos. Aquí viven las reglas de la estructura: el nivel sale de la longitud del código y el padre es el prefijo del nivel anterior.
- `application/`: casos de uso `CreateAccount`, `GetCatalogTree` y `DeleteAccount`. Orquestan el dominio y reciben el repositorio por constructor. No usan decoradores de Nest, para que esta capa tampoco dependa del framework.
- `infrastructure/`: `InMemoryAccountRepository`, la implementación del repositorio.
- `presentation/`: el controlador HTTP y un filtro que convierte los errores de dominio en respuestas `{ field, message }`.
- `accounts.module.ts` es el único sitio donde se conecta la interfaz con su implementación (inyección de dependencias con un token). Cambiar la persistencia es cambiar esa línea.

**Persistencia en memoria.** Son 2 horas y la prueba lo permite. Como el dominio solo conoce la interfaz, pasar a una base de datos es escribir otra clase de repositorio, sin tocar reglas ni casos de uso. El costo: los datos se pierden al reiniciar la API.

**Naturaleza.** Solo las clases (1 dígito) reciben la naturaleza al crearse; el resto la hereda de su padre.

**Frontend organizado por feature** (`web/src/features/accounts/`):
- `api.ts`: único lugar que habla con el backend. Convierte los errores en un `ApiError` con el campo y el mensaje.
- `AccountTree.tsx`: árbol recursivo con expandir y colapsar, nivel y naturaleza por nodo, y eliminar con confirmación y error en el propio nodo.
- `AccountForm.tsx`: validación antes de enviar y errores de la API junto al campo que corresponda.
- `App.tsx`: carga el catálogo y muestra los estados de carga, error con reintento, y árbol.

Usé solo React, `fetch` y CSS plano, sin librerías de componentes ni de estado: para esta pantalla no justifican su costo. Prioricé el núcleo mínimo del frontend y del backend completo y funcionando antes que opcionales.

**Uso de IA.** Usé Claude y Claude Code para generar y revisar partes del código, y los revisé y ajusté en la prueba (por ejemplo, el filtro de errores y los imports ESM).

## Qué dejé afuera

- Todos los opcionales: búsqueda, crear hija desde el nodo padre, renombrar y caché con invalidación.
- Pruebas automáticas.
- Validación de los DTO con una librería (la validación está en el caso de uso).
- Persistencia real.

## Qué haría con más tiempo

- Mover el cálculo del padre y la herencia de naturaleza a una fábrica `Account.create(...)` en el dominio, para que el caso de uso solo orqueste.
- Pruebas unitarias de los casos de uso con un repositorio en memoria, y pruebas e2e de los endpoints.
- Persistencia en PostgreSQL implementando `AccountRepository`.
- Crear hija desde el nodo padre con el código prellenado, y renombrar desde el árbol.
- Búsqueda por código o nombre abriendo las ramas con coincidencia.
- TanStack Query para el estado del servidor, con caché e invalidación en lugar de recargar todo a mano.
- Validar el contenido de la petición con DTOs en la capa de presentación.