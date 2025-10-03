import { postWebs, getWebs, putWebs, deleteWebs } from "../../../Apis/web/webApi.js";

export class CompaniaWeb extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.cargarCiudadesSelect();
    this.cargarCompanies();
  }

  render() {
    this.innerHTML = /* html */ `
      <h3>Registrar Compañía</h3>
      <form id="companyForm">
        <div class="mb-3">
          <label for="nombreCompany" class="form-label">Nombre</label>
          <input type="text" id="nombreCompany" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="niuCompany" class="form-label">NIT</label>
          <input type="text" id="niuCompany" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="citySelect" class="form-label">Ciudad</label>
          <select id="citySelect" class="form-select" required>
            <option value="">-- Selecciona una ciudad --</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="adressCompany" class="form-label">Dirección</label>
          <input type="text" id="adressCompany" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="emailCompany" class="form-label">Email</label>
          <input type="email" id="emailCompany" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </form>
      <div id="mensajeCompany" class="mt-3"></div>
      <div class="card mt-4">
        <div class="card-header">Compañías</div>
        <div class="table-responsive">
          <table class="table table-striped table-bordered mb-0">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>NIT</th>
                <th>Ciudad</th>
                <th>Dirección</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody class="company-list"></tbody>
          </table>
        </div>
      </div>
    `;

    this.querySelector("#companyForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = this.querySelector("#nombreCompany").value.trim();
      const niu = this.querySelector("#niuCompany").value.trim();
      const cityId = this.querySelector("#citySelect").value;
      const adress = this.querySelector("#adressCompany").value.trim();
      const email = this.querySelector("#emailCompany").value.trim();
      if (!nombre || !niu || !cityId || !adress || !email) {
        this.mostrarMensaje("Debes completar todos los campos", "danger");
        return;
      }
      const datos = { name: nombre, niu, CityId: parseInt(cityId), adress, email };
      try {
        const response = await postWebs(datos, "companies");
        if (response.ok) {
          this.mostrarMensaje("Compañía registrada correctamente", "success");
          this.querySelector("#companyForm").reset();
          this.cargarCompanies();
        } else {
          this.mostrarMensaje("Error al registrar la compañía", "danger");
        }
      } catch (err) {
        this.mostrarMensaje("Error en la conexión con la API", "danger");
      }
    });
  }

  async cargarCiudadesSelect() {
    try {
      const response = await getWebs("cities");
      const ciudades = await response.json();
      const select = this.querySelector("#citySelect");
      ciudades.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        select.appendChild(option);
      });
    } catch (err) {}
  }

  async cargarCompanies() {
    const tbody = this.querySelector(".company-list");
    tbody.innerHTML = `<tr><td colspan="7">Cargando...</td></tr>`;
    try {
      const response = await getWebs("companies");
      const companies = await response.json();
      if (!Array.isArray(companies) || companies.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay compañías registradas</td></tr>`;
        return;
      }
      tbody.innerHTML = "";
      for (const company of companies) {
        // Obtener nombre de la ciudad
        let cityNombre = "";
        try {
          const cityResp = await getWebs(`cities/${company.CityId}`);
          if (cityResp.ok) {
            const city = await cityResp.json();
            cityNombre = city.name;
          }
        } catch {}
        tbody.innerHTML += `
          <tr>
            <td>${company.id}</td>
            <td>${company.name}</td>
            <td>${company.niu}</td>
            <td>${cityNombre}</td>
            <td>${company.adress}</td>
            <td>${company.email}</td>
            <td>
              <button class="btn btn-sm btn-warning editar" data-id="${company.id}" data-nombre="${company.name}" data-niu="${company.niu}" data-city="${company.CityId}" data-adress="${company.adress}" data-email="${company.email}">Editar</button>
              <button class="btn btn-sm btn-danger eliminar" data-id="${company.id}">Eliminar</button>
            </td>
          </tr>
        `;
      }
      this.agregarEventosBotones();
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-danger">Error al cargar compañías</td></tr>`;
    }
  }

  agregarEventosBotones() {
    this.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("¿Seguro que deseas eliminar esta compañía?")) {
          try {
            const response = await deleteWebs(id, "companies");
            if (response.ok) {
              this.mostrarMensaje("Compañía eliminada", "success");
              this.cargarCompanies();
            } else {
              this.mostrarMensaje("Error al eliminar la compañía", "danger");
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
        this.querySelector("#nombreCompany").value = btn.getAttribute("data-nombre");
        this.querySelector("#niuCompany").value = btn.getAttribute("data-niu");
        this.querySelector("#citySelect").value = btn.getAttribute("data-city");
        this.querySelector("#adressCompany").value = btn.getAttribute("data-adress");
        this.querySelector("#emailCompany").value = btn.getAttribute("data-email");
        const submitBtn = this.querySelector("#companyForm button[type='submit']");
        submitBtn.textContent = "Actualizar";
        this.querySelector("#companyForm").onsubmit = async (ev) => {
          ev.preventDefault();
          const nombre = this.querySelector("#nombreCompany").value.trim();
          const niu = this.querySelector("#niuCompany").value.trim();
          const cityId = this.querySelector("#citySelect").value;
          const adress = this.querySelector("#adressCompany").value.trim();
          const email = this.querySelector("#emailCompany").value.trim();
          if (!nombre || !niu || !cityId || !adress || !email) {
            this.mostrarMensaje("Debes completar todos los campos", "danger");
            return;
          }
          try {
            const response = await putWebs(id, { name: nombre, niu, CityId: parseInt(cityId), adress, email }, "companies");
            if (response.ok) {
              this.mostrarMensaje("Compañía editada correctamente", "success");
              this.querySelector("#companyForm").reset();
              submitBtn.textContent = "Guardar";
              this.cargarCompanies();
              this.querySelector("#companyForm").onsubmit = null;
              this.render();
              this.cargarCompanies();
              this.cargarCiudadesSelect();
            } else {
              this.mostrarMensaje("Error al editar la compañía", "danger");
            }
          } catch (err) {
            this.mostrarMensaje("Error en la conexión con la API", "danger");
          }
        };
      });
    });
  }

  mostrarMensaje(msg, tipo) {
    const div = this.querySelector("#mensajeCompany");
    div.innerHTML = `<div class="alert alert-${tipo}" role="alert">${msg}</div>`;
  }
}

customElements.define("compania-web", CompaniaWeb);