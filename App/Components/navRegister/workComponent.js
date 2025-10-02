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
          <a class="nav-link" href="#" data-verocultar='["#paisWork", ["#regionWork", "#companiaWork", "#ciudadWork", "#marcaWork"]]'>País</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" data-verocultar='["#regionWork", ["#paisWork", "#companiaWork", "#ciudadWork", "#marcaWork"]]'>Región</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" data-verocultar='["#ciudadWork", ["#paisWork", "#regionWork", "#companiaWork", "#marcaWork"]]'>Ciudad</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" data-verocultar='["#companiaWork", ["#paisWork", "#regionWork", "#ciudadWork", "#marcaWork"]]'>Compañía</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" data-verocultar='["#marcaWork", ["#paisWork", "#regionWork", "#ciudadWork", "#companiaWork"]]'>Marca</a>
        </li>
      </ul>

      <div class="container" id="paisWork" style="display:block;">
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
    }
}

customElements.define("work-component", WorkComponent);
