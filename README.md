# WebComponents CRUD SEBASTIAN ANDRES MORA VALENZUELA

Aplicación web modular con **Web Components** para gestionar entidades de una base de datos relacional: Países, Regiones, Ciudades, Compañías y Sucursales.

---

---

## Componentes

- **paisWork.js**: Países
- **regionWork.js**: Regiones
- **ciudadWork.js**: Ciudades
- **companiaWork.js**: Compañías
- **marcaWork.js / branchesWork.js**: Sucursales
- **listarComponent.js**: Listado completo

---

## API Genérica

```js
getWorks(ruta)                // GET /ruta
postWorks(datos, ruta)        // POST /ruta
putWorks(id, datos, ruta)     // PUT /ruta/:id
deleteWorks(id, ruta)         // DELETE /ruta/:id