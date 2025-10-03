import './ciudadWork.js'
import './companiaWork.js'
import './marcaWork.js'
import './regionWork.js'
import './paisWork.js'

export class WorkComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = /* html */ `
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link mnuwork" href="#" data-verocultar='["#paisWork", ["#regionWork", "#companiaWork", "#ciudadWork", "#marcaWork"]]'>País</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuwork" href="#" data-verocultar='["#regionWork", ["#paisWork", "#companiaWork", "#ciudadWork", "#marcaWork"]]'>Región</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuwork" href="#" data-verocultar='["#ciudadWork", ["#paisWork", "#regionWork", "#companiaWork", "#marcaWork"]]'>Ciudad</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuwork" href="#" data-verocultar='["#companiaWork", ["#paisWork", "#regionWork", "#ciudadWork", "#marcaWork"]]'>Compañía</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuwork" href="#" data-verocultar='["#marcaWork", ["#paisWork", "#regionWork", "#ciudadWork", "#companiaWork"]]'>Marca</a>
        </li>
      </ul>

      <div class="container " id="paisWork" style="display:block;">
          <pais-work></pais-work>
      </div>
      <div class="container" id="regionWork" style="display:none;">
          <region-work></region-work>
      </div>
      <div class="container" id="ciudadWork" style="display:none;">
          <ciudad-work></ciudad-work>
      </div> 
      <div class="container" id="companiaWork" style="display:none;">
          <compania-work></compania-work>
      </div>
      <div class="container" id="marcaWork" style="display:none;">
          <marca-work></marca-work>
      </div> 
    `;

    this.querySelectorAll(".mnuwork").forEach((val, id) => {
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

customElements.define("work-component", WorkComponent);
