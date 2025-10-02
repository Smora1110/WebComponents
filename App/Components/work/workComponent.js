import '/App/Components/work/regionWork.js'
import '/App/Components/work/companiaWork.js'
import '/App/Components/work/ciudadWork.js'
import '/App/Components/work/marcaWork.js'

export class WorkComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = /* html */ `
      <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link " href="#" data-verocultar='["#regionWork",["#commpaniaWork",#ciudadWork",#marcaWork"]]'>Region</a>
      </li>
      <li class="nav-item">
        <a class="nav-link " href="#" data-verocultar='["#ciudadWork",["#commpaniaWork",#regionWork",#marcaWork"]]'>Ciudad</a>
      </li>
      <li class="nav-item">
        <a class="nav-link " href="#" data-verocultar='["#commpaniaWork",["#regionWork",#ciudadWork",#marcaWork"]]'>Compañia</a>
      </li>
      <li class="nav-item">
        <a class="nav-link " href="#" data-verocultar='["#marcaWork",["#commpaniaWork",#ciudadWork",#regionWork"]]'>Marca</a>
      </li>
      </ul>
    <div class="container" id="regionWork" style="display:block;">
        <region-work></region-work>
    </div>
    <div class="container" id="companiaWork" style="display:none;">
        <commpania-work></commpania-work>
    </div>
    <div class="container" id="ciudadWork" style="display:none;">
        <ciudad-work></ciudad-work>
    </div> 
    <div class="container" id="marcaWork" style="display:none;">
        <marca-work></marca-work>
    </div> 
    `;
    }
}

customElements.define("work-component", WorkComponent);