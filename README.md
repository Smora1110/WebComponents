# WebComponents CRUD SEBASTIAN ANDRES MORA VALENZUELA

Aplicación web modular con **Web Components** para gestionar entidades de una base de datos relacional: Países, Regiones, Ciudades, Compañías y Sucursales.

---

---

## Componentes

- **paisWeb.js**: Países
- **regionWeb.js**: Regiones
- **ciudadWeb.js**: Ciudades
- **companiaWeb.js**: Compañías
- **marcaWeb.js / branchesWeb.js**: Sucursales
- **listarComponent.js**: Listado completo

---

## API Genérica

```js
getWebs(ruta)                // GET /ruta
postWebs(datos, ruta)        // POST /ruta
putWebs(id, datos, ruta)     // PUT /ruta/:id
deleteWebs(id, ruta)         // DELETE /ruta/:id