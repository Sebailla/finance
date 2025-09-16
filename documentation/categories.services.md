# Módulo Categories

## CategoriesService

### Descripción
El `CategoriesService` es la capa de **lógica de negocio** del módulo `Categories`.  
Se encarga de orquestar las operaciones sobre la entidad `Category` utilizando un repositorio de **TypeORM**.

### Dependencias
- `@InjectRepository(Category)` → Inyecta el repositorio de la entidad `Category` para realizar operaciones en la base de datos.
- `Repository<Category>` → Clase de TypeORM que provee métodos de persistencia.
- `CreateCategoryDto` y `UpdateCategoryDto` → Objetos de transferencia de datos que definen la forma y validación de los datos de entrada.
- `NotFoundException` → Excepción de NestJS lanzada cuando no se encuentra una categoría.

### Métodos y Funcionalidad

#### `create(createCategoryDto: CreateCategoryDto)`
- **Función:** Crear una nueva categoría en la base de datos.  
- **Proceso:**  
  1. Se instancia un nuevo objeto `Category`.  
  2. Se asigna el nombre (`cat_name`) desde el DTO.  
  3. Se persiste con `categoryRepository.save()`.  
- **Retorna:** La categoría recién creada.

---

#### `findAll()`
- **Función:** Obtener todas las categorías.  
- **Proceso:** Llama a `categoryRepository.find()` para traer todos los registros.  
- **Retorna:** Array de categorías.

---

#### `findOne(id: string)`
- **Función:** Buscar una categoría por su `id`.  
- **Proceso:**  
  1. Llama a `categoryRepository.findOneBy({ id })`.  
  2. Si no encuentra nada, lanza `NotFoundException('Category not found')`.  
- **Retorna:** Una categoría si existe, si no, lanza error.

---

#### `update(id: string, updateCategoryDto: UpdateCategoryDto)`
- **Función:** Actualizar el nombre de una categoría existente.  
- **Proceso:**  
  1. Busca la categoría usando `findOne()`.  
  2. Si no existe, lanza `NotFoundException`.  
  3. Si existe, actualiza el campo `cat_name` con el valor del DTO.  
  4. Guarda los cambios con `categoryRepository.save()`.  
- **Retorna:** Un objeto con un mensaje confirmando la actualización.

---

#### `remove(id: string)`
- **Función:** Eliminar una categoría existente.  
- **Proceso:**  
  1. Busca la categoría usando `findOne()`.  
  2. Si no existe, lanza `NotFoundException`.  
  3. Si existe, la elimina con `categoryRepository.remove()`.  
- **Retorna:** Un objeto con un mensaje confirmando la eliminación.

---

### Interacciones dentro del módulo
- **Controller → Service:**  
  Los controladores del módulo Categories delegan a estos métodos toda la lógica de negocio.  
- **Service → Database:**  
  El servicio se comunica con la base de datos a través del `Repository<Category>`.  
- **DTOs → Service:**  
  Aseguran que los datos de entrada tengan el formato correcto antes de llegar al servicio.