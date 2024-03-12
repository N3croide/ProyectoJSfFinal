# Cliente URL API

Este módulo proporciona un cliente JavaScript simple para interactuar con la API URL (Unified Resource Locator) alojada en 'http://localhost:3000'. Incluye funciones para realizar operaciones comunes de CRUD (Crear, Leer, Actualizar, Eliminar) en diferentes categorías.

### Funciones

#### `getCategory(elemento)`

Obtener todos los elementos de una categoría específica de la API URL.

- **Parámetros:**
  - `elemento` (cadena): El nombre de la categoría.

- **Devuelve:**
  - Una Promesa que resuelve a los datos de la categoría especificada si la solicitud es exitosa. De lo contrario, se registra un error.

#### `getCategoryElement(elemento, id)`

Obtener un elemento específico de una categoría dada utilizando su ID.

- **Parámetros:**
  - `elemento` (cadena): El nombre de la categoría.
  - `id` (cadena): El ID del elemento.

- **Devuelve:**
  - Una Promesa que resuelve a los datos del elemento especificado si la solicitud es exitosa. De lo contrario, se registra un error.

#### `post(datos, elemento)`

Crear un nuevo elemento en la categoría especificada.

- **Parámetros:**
  - `datos` (objeto): Los datos a enviar.
  - `elemento` (cadena): El nombre de la categoría.

- **Devuelve:**
  - Una Promesa que resuelve a los datos de la respuesta si la solicitud es exitosa. De lo contrario, se registra un error.

#### `patch(datos, elemento, id)`

Actualizar un elemento existente en la categoría especificada utilizando su ID.

- **Parámetros:**
  - `datos` (objeto): Los datos a parchear.
  - `elemento` (cadena): El nombre de la categoría.
  - `id` (cadena): El ID del elemento a actualizar.

- **Devuelve:**
  - Una Promesa que resuelve a los datos de la respuesta si la solicitud es exitosa. De lo contrario, se registra un error.

#### `del(elemento, id)`

Eliminar un elemento de la categoría especificada utilizando su ID.

- **Parámetros:**
  - `elemento` (cadena): El nombre de la categoría.
  - `id` (cadena): El ID del elemento a eliminar.

- **Devuelve:**
  - Una Promesa que resuelve a los datos de la respuesta si la solicitud es exitosa. De lo contrario, se registra un error.


INTEGRANTES
Andres Enrique Bustmante Acevedo
Angeli Nicol Corredor Rodriguez