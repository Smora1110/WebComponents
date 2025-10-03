import { getWorks } from "../../../Apis/work/workApi.js";

export class ListarComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listarTodo();
  }

  render() {
    this.innerHTML = `
      <h2 class="mb-4">Listado Completo de la Base de Datos</h2>
      <div id="db-listado"></div>
    `;
  }

  async listarTodo() {
    const cont = this.querySelector("#db-listado");
    cont.innerHTML = `<div class="text-center my-5"><span class="spinner-border"></span> Cargando...</div>`;

    // Define entidades y columnas
    const entidades = [
      { nombre: "Países", ruta: "countries", columnas: ["id", "name"] },
      { nombre: "Regiones", ruta: "regions", columnas: ["id", "name", "CountryId"] },
      { nombre: "Ciudades", ruta: "cities", columnas: ["id", "name", "RegionId"] },
      { nombre: "Compañías", ruta: "companies", columnas: ["id", "name", "niu", "CityId", "adress", "email"] },
      { nombre: "Sucursales", ruta: "branches", columnas: ["id", "number_Comercial", "niu", "Contact_name", "adress", "email", "phone", "cityId", "CompanyId"] }
    ];

    let html = "";

    for (const entidad of entidades) {
      html += `<h4 class="mt-5 mb-3">${entidad.nombre}</h4>`;
      html += `
        <div class="table-responsive mb-4">
          <table class="table table-striped table-bordered">
            <thead class="table-dark">
              <tr>
                ${entidad.columnas.map(col => `<th>${col}</th>`).join("")}
              </tr>
            </thead>
            <tbody id="tb-${entidad.ruta}">
              <tr><td colspan="${entidad.columnas.length}" class="text-center">Cargando...</td></tr>
            </tbody>
          </table>
        </div>
      `;
    }

    cont.innerHTML = html;

    // Cargar datos de cada entidad
    for (const entidad of entidades) {
      const tbody = this.querySelector(`#tb-${entidad.ruta}`);
      try {
        const response = await getWorks(entidad.ruta);
        const datos = await response.json();
        if (!Array.isArray(datos) || datos.length === 0) {
          tbody.innerHTML = `<tr><td colspan="${entidad.columnas.length}" class="text-center">No hay datos</td></tr>`;
          continue;
        }
        tbody.innerHTML = "";
        datos.forEach(item => {
          tbody.innerHTML += `
            <tr>
              ${entidad.columnas.map(col => `<td>${item[col] ?? ""}</td>`).join("")}
            </tr>
          `;
        });
      } catch (err) {
        tbody.innerHTML = `<tr><td colspan="${entidad.columnas.length}" class="text-danger">Error al cargar datos</td></tr>`;
      }
    }
  }
}

customElements.define("listar-component", ListarComponent);