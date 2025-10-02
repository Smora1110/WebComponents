import { postWorks } from "../../../Apis/work/workApi.js";

export class RegionWork extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <h3>Registrar region</h3>
      <form id="regionForm">
        <div class="mb-3">
          <label for="nombreRegion" class="form-label">Nombre de region</label>
          <input type="text" id="nombreRegion" class="form-control" placeholder="Ej: Santander" required />
        </div>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </form>
      <div id="mensajeRegion" class="mt-3"></div>
    `;

    this.querySelector("#regionForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombreRegion = this.querySelector("#nombreRegion").value.trim();

      if (!nombreRegion) {
        this.mostrarMensaje("⚠️ Ingresa un nombre de region", "danger");
        return;
      }

      const datos = { name: nombreRegion };

      try {
        const response = await postWorks(datos, "regions");
        if (response.ok) {
          this.mostrarMensaje("✅ Region registrado correctamente", "success");
          this.querySelector("#regionForm").reset();
        } else {
          this.mostrarMensaje("❌ Error al registrar el país", "danger");
        }
      } catch (err) {
        console.error(err);
        this.mostrarMensaje("❌ Error en la conexión con la API", "danger");
      }
    });
  }

  mostrarMensaje(msg, tipo) {
    const div = this.querySelector("#mensajeRegion");
    div.innerHTML = `<div class="alert alert-${tipo}" role="alert">${msg}</div>`;
  }
}

customElements.define("region-work", RegionWork);
