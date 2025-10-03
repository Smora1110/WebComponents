import { postWorks, getWorks, putWorks, deleteWorks } from "../../../Apis/work/workApi.js";

export class RegionWork extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.cargarRegiones();
    this.cargarPaisesSelect();
  }

  render() {
    this.innerHTML = /* html */ `
      <h3>Registrar Región</h3>
      <form id="regionForm">
        <div class="mb-3">
          <label for="nombreRegion" class="form-label">Nombre de la Región</label>
          <input type="text" id="nombreRegion" class="form-control" placeholder="Ej: Antioquia" required />
        </div>
        <div class="mb-3">
          <label for="paisSelect" class="form-label">País</label>
          <select id="paisSelect" class="form-select" required>
            <option value="">-- Selecciona un país --</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </form>
      <div id="mensajeRegion" class="mt-3"></div>
      <div class="card mt-4">
        <div class="card-header">Regiones</div>
        <div class="table-responsive">
          <table class="table table-striped table-bordered mb-0">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>País</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody class="region-list"></tbody>
          </table>
        </div>
      </div>
    `;

    this.querySelector("#regionForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombreRegion = this.querySelector("#nombreRegion").value.trim();
      const paisId = this.querySelector("#paisSelect").value;
      if (!nombreRegion || !paisId) {
        this.mostrarMensaje("Debes completar todos los campos", "danger");
        return;
      }
      const datos = { name: nombreRegion, CountryId: parseInt(paisId) };
      try {
        const response = await postWorks(datos, "regions");
        if (response.ok) {
          this.mostrarMensaje("Región registrada correctamente", "success");
          this.querySelector("#regionForm").reset();
          this.cargarRegiones();
        } else {
          this.mostrarMensaje("Error al registrar la región", "danger");
        }
      } catch (err) {
        this.mostrarMensaje("Error en la conexión con la API", "danger");
      }
    });
  }

  async cargarPaisesSelect() {
    try {
      const response = await getWorks("countries");
      const paises = await response.json();
      const select = this.querySelector("#paisSelect");
      paises.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.name;
        select.appendChild(option);
      });
    } catch (err) {
      // Puedes mostrar un mensaje si lo deseas
    }
  }

  async cargarRegiones() {
    const tbody = this.querySelector(".region-list");
    tbody.innerHTML = `<tr><td colspan="4">Cargando...</td></tr>`;
    try {
      const response = await getWorks("regions");
      const regiones = await response.json();
      if (!Array.isArray(regiones) || regiones.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center">No hay regiones registradas</td></tr>`;
        return;
      }
      tbody.innerHTML = "";
      for (const region of regiones) {
        // Obtener nombre del país
        let paisNombre = "";
        try {
          const paisResp = await getWorks(`countries/${region.CountryId}`);
          if (paisResp.ok) {
            const pais = await paisResp.json();
            paisNombre = pais.name;
          }
        } catch {}
        tbody.innerHTML += `
          <tr>
            <td>${region.id}</td>
            <td>${region.name}</td>
            <td>${paisNombre}</td>
            <td>
              <button class="btn btn-sm btn-warning editar" data-id="${region.id}" data-nombre="${region.name}" data-pais="${region.CountryId}">Editar</button>
              <button class="btn btn-sm btn-danger eliminar" data-id="${region.id}">Eliminar</button>
            </td>
          </tr>
        `;
      }
      this.agregarEventosBotones();
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-danger">Error al cargar regiones</td></tr>`;
    }
  }

  agregarEventosBotones() {
    this.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("¿Seguro que deseas eliminar esta región?")) {
          try {
            const response = await deleteWorks(id, "regions");
            if (response.ok) {
              this.mostrarMensaje("Región eliminada", "success");
              this.cargarRegiones();
            } else {
              this.mostrarMensaje("Error al eliminar la región", "danger");
            }
          } catch (err) {
            this.mostrarMensaje("Error en la conexión con la API", "danger");
          }
        }
      });
    });

    this.querySelectorAll(".editar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const nombre = btn.getAttribute("data-nombre");
        const paisId = btn.getAttribute("data-pais");
        this.querySelector("#nombreRegion").value = nombre;
        this.querySelector("#paisSelect").value = paisId;
        const submitBtn = this.querySelector("#regionForm button[type='submit']");
        submitBtn.textContent = "Actualizar";
        this.querySelector("#regionForm").onsubmit = async (ev) => {
          ev.preventDefault();
          const nuevoNombre = this.querySelector("#nombreRegion").value.trim();
          const nuevoPaisId = this.querySelector("#paisSelect").value;
          if (!nuevoNombre || !nuevoPaisId) {
            this.mostrarMensaje("Debes completar todos los campos", "danger");
            return;
          }
          try {
            const response = await putWorks(id, { name: nuevoNombre, CountryId: parseInt(nuevoPaisId) }, "regions");
            if (response.ok) {
              this.mostrarMensaje("Región editada correctamente", "success");
              this.querySelector("#regionForm").reset();
              submitBtn.textContent = "Guardar";
              this.cargarRegiones();
              this.querySelector("#regionForm").onsubmit = null;
              this.render();
              this.cargarRegiones();
              this.cargarPaisesSelect();
            } else {
              this.mostrarMensaje("Error al editar la región", "danger");
            }
          } catch (err) {
            this.mostrarMensaje("Error en la conexión con la API", "danger");
          }
        };
      });
    });
  }

  mostrarMensaje(msg, tipo) {
    const div = this.querySelector("#mensajeRegion");
    div.innerHTML = `<div class="alert alert-${tipo}" role="alert">${msg}</div>`;
  }
}

customElements.define("region-work", RegionWork);