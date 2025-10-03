import { postWorks, getWorks } from "../../../Apis/work/workApi.js";

export class CiudadWork extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  async render() {
    this.innerHTML = /* html */ `
      <h3>Registrar ciudad</h3>
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
    `;

    // cargar regiones en el select
    await this.cargarRegiones();

    // evento submit
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
        } else {
          this.mostrarMensaje("Error al registrar la ciudad", "danger");
        }
      } catch (err) {
        console.error(err);
        this.mostrarMensaje("Error en la conexión con la API", "danger");
      }
    });
  }

  async cargarRegiones() {
    try {
      const response = await fetch("http://localhost:3000/regions");
      const regiones = await response.json();
      const select = this.querySelector("#regionSelect");

      regiones.forEach(r => {
        const option = document.createElement("option");
        option.value = r.id;
        option.textContent = r.name;
        select.appendChild(option);
      });
    } catch (err) {
      console.error("Error cargando regiones:", err);
    }
  }

  mostrarMensaje(msg, tipo) {
    const div = this.querySelector("#mensajeCiudad");
    div.innerHTML = `<div class="alert alert-${tipo}" role="alert">${msg}</div>`;
  }
}

customElements.define("ciudad-work", CiudadWork);