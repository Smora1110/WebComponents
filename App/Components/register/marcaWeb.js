import { postWebs, getWebs, putWebs, deleteWebs } from "../../../Apis/web/webApi.js";

export class MarcaWeb extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.cargarCiudadesSelect();
    this.cargarBranches();
  }

  render() {
    this.innerHTML = /* html */ `
      <h3>Registrar Sucursal</h3>
      <form id="branchForm">
        <div class="mb-3">
          <label for="numberComercial" class="form-label">Número Comercial</label>
          <input type="text" id="numberComercial" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="niuBranch" class="form-label">NIT</label>
          <input type="text" id="niuBranch" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="contactName" class="form-label">Nombre de Contacto</label>
          <input type="text" id="contactName" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="adressBranch" class="form-label">Dirección</label>
          <input type="text" id="adressBranch" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="emailBranch" class="form-label">Email</label>
          <input type="email" id="emailBranch" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="phoneBranch" class="form-label">Teléfono</label>
          <input type="text" id="phoneBranch" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="cityBranch" class="form-label">Ciudad</label>
          <select id="cityBranch" class="form-select" required>
            <option value="">-- Selecciona una ciudad --</option>
          </select>
        </div>
        <!-- CompanyId es fijo "uk" -->
        <button type="submit" class="btn btn-primary">Guardar</button>
      </form>
      <div id="mensajeBranch" class="mt-3"></div>
      <div class="card mt-4">
        <div class="card-header">Sucursales</div>
        <div class="table-responsive">
          <table class="table table-striped table-bordered mb-0">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Número Comercial</th>
                <th>NIT</th>
                <th>Contacto</th>
                <th>Dirección</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th>Compañía</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody class="branch-list"></tbody>
          </table>
        </div>
      </div>
    `;

    this.querySelector("#branchForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const datos = {
        number_Comercial: this.querySelector("#numberComercial").value.trim(),
        niu: this.querySelector("#niuBranch").value.trim(),
        Contact_name: this.querySelector("#contactName").value.trim(),
        adress: this.querySelector("#adressBranch").value.trim(),
        email: this.querySelector("#emailBranch").value.trim(),
        phone: this.querySelector("#phoneBranch").value.trim(),
        cityId: this.querySelector("#cityBranch").value,
        CompanyId: "uk" // Valor fijo
      };
      if (Object.values(datos).some(val => !val)) {
        this.mostrarMensaje("Debes completar todos los campos", "danger");
        return;
      }
      try {
        const response = await postWebs(datos, "branches");
        if (response.ok) {
          this.mostrarMensaje("Sucursal registrada correctamente", "success");
          this.querySelector("#branchForm").reset();
          this.cargarBranches();
        } else {
          this.mostrarMensaje("Error al registrar la sucursal", "danger");
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
      const select = this.querySelector("#cityBranch");
      ciudades.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        select.appendChild(option);
      });
    } catch (err) {}
  }

  // ...existing code...
async cargarBranches() {
  const tbody = this.querySelector(".branch-list");
  tbody.innerHTML = `<tr><td colspan="10">Cargando...</td></tr>`;
  try {
    const response = await getWebs("branches");
    const branches = await response.json();
    if (!Array.isArray(branches) || branches.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="text-center">No hay sucursales registradas</td></tr>`;
      return;
    }
    tbody.innerHTML = "";
    for (const branch of branches) {
      // Obtener nombre de ciudad
      let ciudadNombre = branch.cityId;
      try {
        const ciudadResp = await getWebs(`cities/${branch.cityId}`);
        if (ciudadResp.ok) {
          const ciudad = await ciudadResp.json();
          ciudadNombre = ciudad.name;
        }
      } catch {}
      // Obtener nombre de compañía
      let companiaNombre = branch.CompanyId;
      try {
        const companiaResp = await getWebs(`companies/${branch.CompanyId}`);
        if (companiaResp.ok) {
          const compania = await companiaResp.json();
          companiaNombre = compania.name;
        }
      } catch {}
      tbody.innerHTML += `
        <tr>
          <td>${branch.id}</td>
          <td>${branch.number_Comercial}</td>
          <td>${branch.niu}</td>
          <td>${branch.Contact_name}</td>
          <td>${branch.adress}</td>
          <td>${branch.email}</td>
          <td>${branch.phone}</td>
          <td>${ciudadNombre}</td>
          <td>${companiaNombre}</td>
          <td>
            <button class="btn btn-sm btn-warning editar"
              data-id="${branch.id}"
              data-number="${branch.number_Comercial}"
              data-niu="${branch.niu}"
              data-contact="${branch.Contact_name}"
              data-adress="${branch.adress}"
              data-email="${branch.email}"
              data-phone="${branch.phone}"
              data-city="${branch.cityId}">Editar</button>
            <button class="btn btn-sm btn-danger eliminar" data-id="${branch.id}">Eliminar</button>
          </td>
        </tr>
      `;
    }
    this.agregarEventosBotones();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-danger">Error al cargar sucursales</td></tr>`;
  }
}
// ...existing code...
  agregarEventosBotones() {
    this.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("¿Seguro que deseas eliminar esta sucursal?")) {
          try {
            const response = await deleteWebs(id, "branches");
            if (response.ok) {
              this.mostrarMensaje("Sucursal eliminada", "success");
              this.cargarBranches();
            } else {
              this.mostrarMensaje("Error al eliminar la sucursal", "danger");
            }
          } catch (err) {
            this.mostrarMensaje("Error en la conexión con la API", "danger");
          }
        }
      });
    });

    this.querySelectorAll(".editar").forEach(btn => {
      btn.addEventListener("click", () => {
        this.querySelector("#numberComercial").value = btn.getAttribute("data-number");
        this.querySelector("#niuBranch").value = btn.getAttribute("data-niu");
        this.querySelector("#contactName").value = btn.getAttribute("data-contact");
        this.querySelector("#adressBranch").value = btn.getAttribute("data-adress");
        this.querySelector("#emailBranch").value = btn.getAttribute("data-email");
        this.querySelector("#phoneBranch").value = btn.getAttribute("data-phone");
        this.querySelector("#cityBranch").value = btn.getAttribute("data-city");
        const id = btn.getAttribute("data-id");
        const submitBtn = this.querySelector("#branchForm button[type='submit']");
        submitBtn.textContent = "Actualizar";
        this.querySelector("#branchForm").onsubmit = async (ev) => {
          ev.preventDefault();
          const datos = {
            number_Comercial: this.querySelector("#numberComercial").value.trim(),
            niu: this.querySelector("#niuBranch").value.trim(),
            Contact_name: this.querySelector("#contactName").value.trim(),
            adress: this.querySelector("#adressBranch").value.trim(),
            email: this.querySelector("#emailBranch").value.trim(),
            phone: this.querySelector("#phoneBranch").value.trim(),
            cityId: this.querySelector("#cityBranch").value,
            CompanyId: "uk" // Valor fijo
          };
          if (Object.values(datos).some(val => !val)) {
            this.mostrarMensaje("Debes completar todos los campos", "danger");
            return;
          }
          try {
            const response = await putWebs(id, datos, "branches");
            if (response.ok) {
              this.mostrarMensaje("Sucursal editada correctamente", "success");
              this.querySelector("#branchForm").reset();
              submitBtn.textContent = "Guardar";
              this.cargarBranches();
              this.querySelector("#branchForm").onsubmit = null;
              this.render();
              this.cargarCiudadesSelect();
              this.cargarBranches();
            } else {
              this.mostrarMensaje("Error al editar la sucursal", "danger");
            }
          } catch (err) {
            this.mostrarMensaje("Error en la conexión con la API", "danger");
          }
        };
      });
    });
  }

  mostrarMensaje(msg, tipo) {
    const div = this.querySelector("#mensajeBranch");
    div.innerHTML = `<div class="alert alert-${tipo}" role="alert">${msg}</div>`;
  }
}

customElements.define("marca-web", MarcaWeb);