import { postWorks, getWorks, putWorks, deleteWorks } from "../../../Apis/work/workApi.js";

export class CiudadWork extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.cargarCiudades();
    this.cargarRegionesSelect();
  }

  render() {
    this.innerHTML = /* html */ `
      <h3>Registrar Ciudad</h3>
      <form id="ciudadForm">
        <div class="mb-3">
          <label for="nombreCiudad" class="form-label">Nombre de la ciudad</label>
          <input type="text" id="nombreCiudad" class="form-control" placeholder="Ej: Medellín" required />
        </div>
        <div class="mb-3">
          <label for="regionSelect" class="form-label">Región</label>
          <select id="regionSelect" class="form-select" required>
            <option value="">-- Selecciona una región --</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </form>
      <div id="mensajeCiudad" class="mt-3"></div>
      <div class="card mt-4">
        <div class="card-header">Ciudades</div>
        <div class="table-responsive">
          <table class="table table-striped table-bordered mb-0">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Región</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody class="ciudad-list"></tbody>
          </table>
        </div>
      </div>
    `;

    this.querySelector("#ciudadForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombreCiudad = this.querySelector("#nombreCiudad").value.trim();
      const regionId = this.querySelector("#regionSelect").value;
      if (!nombreCiudad || !regionId) {
        this.mostrarMensaje("Debes completar todos los campos", "danger");
        return;
      }
      const datos = { name: nombreCiudad, RegionId: parseInt(regionId) };
      try {
        const response = await postWorks(datos, "cities");
        if (response.ok) {
          this.mostrarMensaje("Ciudad registrada correctamente", "success");
          this.querySelector("#ciudadForm").reset();
          this.cargarCiudades();
        } else {
          this.mostrarMensaje("Error al registrar la ciudad", "danger");
        }
      } catch (err) {
        this.mostrarMensaje("Error en la conexión con la API", "danger");
      }
    });
  }

  async cargarRegionesSelect() {
    try {
      const response = await getWorks("regions");
      const regiones = await response.json();
      const select = this.querySelector("#regionSelect");
      regiones.forEach(r => {
        const option = document.createElement("option");
        option.value = r.id;
        option.textContent = r.name;
        select.appendChild(option);
      });
    } catch (err) {
      // Puedes mostrar un mensaje si lo deseas
    }
  }

  async cargarCiudades() {
    const tbody = this.querySelector(".ciudad-list");
    tbody.innerHTML = `<tr><td colspan="4">Cargando...</td></tr>`;
    try {
      const response = await getWorks("cities");
      const ciudades = await response.json();
      if (!Array.isArray(ciudades) || ciudades.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center">No hay ciudades registradas</td></tr>`;
        return;
      }
      tbody.innerHTML = "";
      for (const ciudad of ciudades) {
        // Obtener nombre de la región
        let regionNombre = "";
        try {
          const regionResp = await getWorks(`regions/${ciudad.RegionId}`);
          if (regionResp.ok) {
            const region = await regionResp.json();
            regionNombre = region.name;
          }
        } catch {}
        tbody.innerHTML += `
          <tr>
            <td>${ciudad.id}</td>
            <td>${ciudad.name}</td>
            <td>${regionNombre}</td>
            <td>
              <button class="btn btn-sm btn-warning editar" data-id="${ciudad.id}" data-nombre="${ciudad.name}" data-region="${ciudad.RegionId}">Editar</button>
              <button class="btn btn-sm btn-danger eliminar" data-id="${ciudad.id}">Eliminar</button>
            </td>
          </tr>
        `;
      }
      this.agregarEventosBotones();
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-danger">Error al cargar ciudades</td></tr>`;
    }
  }

  agregarEventosBotones() {
    this.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("¿Seguro que deseas eliminar esta ciudad?")) {
          try {
            const response = await deleteWorks(id, "cities");
            if (response.ok) {
              this.mostrarMensaje("Ciudad eliminada", "success");
              this.cargarCiudades();
            } else {
              this.mostrarMensaje("Error al eliminar la ciudad", "danger");
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
        const regionId = btn.getAttribute("data-region");
        this.querySelector("#nombreCiudad").value = nombre;
        this.querySelector("#regionSelect").value = regionId;
        const submitBtn = this.querySelector("#ciudadForm button[type='submit']");
        submitBtn.textContent = "Actualizar";
        this.querySelector("#ciudadForm").onsubmit = async (ev) => {
          ev.preventDefault();
          const nuevoNombre = this.querySelector("#nombreCiudad").value.trim();
          const nuevaRegionId = this.querySelector("#regionSelect").value;
          if (!nuevoNombre || !nuevaRegionId) {
            this.mostrarMensaje("Debes completar todos los campos", "danger");
            return;
          }
          try {
            const response = await putWorks(id, { name: nuevoNombre, RegionId: parseInt(nuevaRegionId) }, "cities");
            if (response.ok) {
              this.mostrarMensaje("Ciudad editada correctamente", "success");
              this.querySelector("#ciudadForm").reset();
              submitBtn.textContent = "Guardar";
              this.cargarCiudades();
              this.querySelector("#ciudadForm").onsubmit = null;
              this.render();
              this.cargarCiudades();
              this.cargarRegionesSelect();
            } else {
              this.mostrarMensaje("Error al editar la ciudad", "danger");
            }
          } catch (err) {
            this.mostrarMensaje("Error en la conexión con la API", "danger");
          }
        };
      });
    });
  }

  mostrarMensaje(msg, tipo) {
    const div = this.querySelector("#mensajeCiudad");
    div.innerHTML = `<div class="alert alert-${tipo}" role="alert">${msg}</div>`;
  }
}

customElements.define("ciudad-work", CiudadWork);