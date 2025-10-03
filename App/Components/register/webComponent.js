import './ciudadWeb.js'
import './companiaWeb.js'
import './marcaWeb.js'
import './regionWeb.js'
import './paisWeb.js'

export class WebComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = /* html */ `
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link mnuweb" href="#" data-verocultar='["#paisWeb", ["#regionWeb", "#companiaWeb", "#ciudadWeb", "#marcaWeb"]]'>País</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuweb" href="#" data-verocultar='["#regionWeb", ["#paisWeb", "#companiaWeb", "#ciudadWeb", "#marcaWeb"]]'>Región</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuweb" href="#" data-verocultar='["#ciudadWeb", ["#paisWeb", "#regionWeb", "#companiaWeb", "#marcaWeb"]]'>Ciudad</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuweb" href="#" data-verocultar='["#companiaWeb", ["#paisWeb", "#regionWeb", "#ciudadWeb", "#marcaWeb"]]'>Compañía</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuweb" href="#" data-verocultar='["#marcaWeb", ["#paisWeb", "#regionWeb", "#ciudadWeb", "#companiaWeb"]]'>Marca</a>
        </li>
      </ul>

      <div class="container " id="paisWeb" style="display:block;">
          <pais-web></pais-web>
      </div>
      <div class="container" id="regionWeb" style="display:none;">
          <region-web></region-web>
      </div>
      <div class="container" id="ciudadWeb" style="display:none;">
          <ciudad-web></ciudad-web>
      </div> 
      <div class="container" id="companiaWeb" style="display:none;">
          <compania-web></compania-web>
      </div>
      <div class="container" id="marcaWeb" style="display:none;">
          <marca-web></marca-web>
      </div> 
    `;

    this.querySelectorAll(".mnuweb").forEach((val, id) => {
        val.addEventListener("click", (e)=>{
            let data = JSON.parse(e.target.dataset.verocultar);
            let cardVer = document.querySelector(data[0]);
            cardVer.style.display = 'block';
            data[1].forEach(card => {
                let cardActual = document.querySelector(card);
                cardActual.style.display = 'none';
            });
            e.stopImmediatePropagation();
            e.preventDefault();
        })
    });
    }
}

customElements.define("web-component", WebComponent);
