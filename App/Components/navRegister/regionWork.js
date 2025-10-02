import { postWorks, getWorks } from "../../../Apis/work/workApi.js";

export class RegionWork extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  async render() {
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
    `;

    // cargar países en el select
    await this.cargarPaises();

    // evento submit
    this.querySelector("#regionForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombreRegion = this.querySelector("#nombreRegion").value.trim();
      const paisId = this.querySelector("#paisSelect").value;

      if (!nombreRegion || !paisId) {
        this.mostrarMensaje("⚠️ Debes completar todos los campos", "danger");
        return;
      }

      const datos = { name: nombreRegion, CountryId: parseInt(paisId) };

      try {
        const response = await postWorks(datos, "regions");
        if (response.ok) {
          this.mostrarMensaje("✅ Región registrada correctamente", "success");
          this.querySelector("#regionForm").reset();
        } else {
          this.mostrarMensaje("❌ Error al registrar la región", "danger");
        }
      } catch (err) {
        console.error(err);
        this.mostrarMensaje("❌ Error en la conexión con la API", "danger");
      }
    });
  }

  async cargarPaises() {
    try {
      const response = await fetch("http://localhost:3000/countries");
      const paises = await response.json();
      const select = this.querySelector("#paisSelec t");

      paises.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.name;
        select.appendChild(option);
      });
    } catch (err) {
      console.error("Error cargando países:", err);
    }
  }

  mostrarMensaje(msg, tipo) {
    const div = this.querySelector("#mensajeRegion");
    div.innerHTML = `<div class="alert alert-${tipo}" role="alert">${msg}</div>`;
  }
}

customElements.define("region-work", RegionWork);
