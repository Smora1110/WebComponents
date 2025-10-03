const URL_API = "http://localhost:3001";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

// GET: Traer todos los elementos de una ruta
export const getWebs = async (ruta) => {
    try {
        const respuesta = await fetch(`${URL_API}/${ruta}`);
        if (respuesta.status === 200) {
            return respuesta;
        } else if (respuesta.status === 401) {
            console.log('La url no es correcta');
        } else if (respuesta.status === 404) {
            console.log('El recurso no existe');
        } else {
            console.log('Se presentó un error en la petición, consulte al Administrador');
        }
    } catch (error) {
        console.log(error);
    }
};

// POST: Crear un elemento en una ruta
export const postWebs = async (datos, ruta) => {
    try {
        return await fetch(`${URL_API}/${ruta}`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
};

// PUT: Actualizar un elemento por id en una ruta
export const putWebs = async (id, datos, ruta) => {
    try {
        return await fetch(`${URL_API}/${ruta}/${id}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud PUT:', error.message);
    }
};

// PATCH: Actualizar parcialmente un elemento por id en una ruta
export const patchWebs = async (id, datos, ruta) => {
    try {
        return await fetch(`${URL_API}/${ruta}/${id}`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud PATCH:', error.message);
    }
};

// DELETE: Eliminar un elemento por id en una ruta
export const deleteWebs = async (id, ruta) => {
    try {
        return await fetch(`${URL_API}/${ruta}/${id}`, {
            method: "DELETE",
            headers: myHeaders,
        });
    } catch (error) {
        console.error('Error en la solicitud DELETE:', error.message);
    }
};