import { postWebs, getWebs, putWebs, deleteWebs } from "../../../Apis/web/webApi.js";

export class PaisWeb extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.cargarPaises();
  }

  render() {
    this.innerHTML = /* html */ `
      <h3>Registrar País</h3>
      <form id="paisForm">
        <div class="mb-3">
          <label for="nombrePais" class="form-label">Nombre del País</label>
          <input type="text" id="nombrePais" class="form-control" placeholder="Ej: Colombia" required />
        </div>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </form>
      <div id="mensajePais" class="mt-3"></div>
      <div class="card mt-4">
        <div class="card-header">Países</div>
        <div class="table-responsive">
          <table class="table table-striped table-bordered mb-0">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody class="pais-list"></tbody>
          </table>
        </div>
      </div>
    `;

    this.querySelector("#paisForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombrePais = this.querySelector("#nombrePais").value.trim();
      if (!nombrePais) {
        this.mostrarMensaje("Ingresa un nombre de país", "danger");
        return;
      }
      const datos = { name: nombrePais };
      try {
        const response = await postWebs(datos, "countries");
        if (response.ok) {
          this.mostrarMensaje("País registrado correctamente", "success");
          this.querySelector("#paisForm").reset();
          this.cargarPaises();
        } else {
          this.mostrarMensaje("Error al registrar el país", "danger");
        }
      } catch (err) {
        this.mostrarMensaje("Error en la conexión con la API", "danger");
      }
    });
  }

  async cargarPaises() {
    const tbody = this.querySelector(".pais-list");
    tbody.innerHTML = `<tr><td colspan="3">Cargando...</td></tr>`;
    try {
      const response = await getWebs("countries");
      const paises = await response.json();
      if (!Array.isArray(paises) || paises.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center">No hay países registrados</td></tr>`;
        return;
      }
      tbody.innerHTML = "";
      paises.forEach(pais => {
        tbody.innerHTML += `
          <tr>
            <td>${pais.id}</td>
            <td>${pais.name}</td>
            <td>
              <button type="button" class="btn btn-sm btn-warning editar" data-id="${pais.id}" data-nombre="${pais.name}">Editar</button>
              <button type="button" class="btn btn-sm btn-danger eliminar" data-id="${pais.id}">Eliminar</button>
            </td>
          </tr>
        `;
      });
      this.agregarEventosBotones();
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-danger">Error al cargar países</td></tr>`;
    }
  }

  agregarEventosBotones() {
    // Botón eliminar
    this.querySelectorAll(".eliminar").forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("¿Seguro que deseas eliminar este país?")) {
          try {
            const response = await deleteWebs(id, "countries");
            if (response.ok) {
              this.mostrarMensaje("País eliminado", "success");
              this.cargarPaises();
            } else {
              this.mostrarMensaje("Error al eliminar el país", "danger");
            }
          } catch (err) {
            this.mostrarMensaje("Error en la conexión con la API", "danger");
          }
        }
      };
    });

    // Botón editar
    this.querySelectorAll(".editar").forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        const nombre = btn.getAttribute("data-nombre");
        const input = this.querySelector("#nombrePais");
        input.value = nombre;
        input.focus();
        const submitBtn = this.querySelector("#paisForm button[type='submit']");
        submitBtn.textContent = "Actualizar";
        this.querySelector("#paisForm").onsubmit = async (ev) => {
          ev.preventDefault();
          const nuevoNombre = input.value.trim();
          if (!nuevoNombre) {
            this.mostrarMensaje("Ingresa un nombre de país", "danger");
            return;
          }
          try {
            const response = await putWebs(id, { name: nuevoNombre }, "countries");
            if (response.ok) {
              this.mostrarMensaje("País editado correctamente", "success");
              this.querySelector("#paisForm").reset();
              submitBtn.textContent = "Guardar";
              this.cargarPaises();
              this.querySelector("#paisForm").onsubmit = null;
              this.render();
              this.cargarPaises();
            } else {
              this.mostrarMensaje("Error al editar el país", "danger");
            }
          } catch (err) {
            this.mostrarMensaje("Error en la conexión con la API", "danger");
          }
        };
      };
    });
  }

  mostrarMensaje(msg, tipo) {
    const div = this.querySelector("#mensajePais");
    div.innerHTML = `<div class="alert alert-${tipo}" role="alert">${msg}</div>`;
  }
}

customElements.define("pais-web", PaisWeb);