import * as api from '../js/api.js'

class Tabla extends HTMLElement{
    constructor(data,db){
        super();
        this.render(data);
        this.db=db;
    }
    render(data){
        if(data.length > 0){
        this.innerHTML = /* html */
        `
        <style rel="stylesheet">
        @import "./components/contentStyle.css";
        </style>
        <table class="table table-hover">
            <tr>
                ${Object.keys(data[0]).map( key => `<th>${key}</th>`).join('')}
                <th scope="col">Acciones</th>
            </tr>
            ${data.map(item => this.renderRow(item)).join('')}
        </table>
        `}
        else{
            this.innerText = "No hay datos"
        }
    }
    renderRow(data){
        return /* html */ `
        <tr class="rowTable">
            ${Object.values(data).map(value => `<td id='rows'>${value}</td>`).join('')}
            <td> <button class='buttonTable actionBtn'>${this.renderAction()}</button> </td>
        </tr>`;
    }
    renderAction(){
        return ``
    }
}
export class Eliminar extends Tabla{
    constructor(data,db){
        super(data,db);
        this.render(data);
        this.btonAction();
    }
    renderAction(){
        return `<i class='bx bx-trash'></i>`
    }
    btonAction(){
        try {
            let tableHeader = this.querySelector('.table').getElementsByTagName('tr')[0];
            let rows = this.querySelectorAll(".rowTable");
            rows.forEach(row => {
                let dataRow = `\n`;
                for (let i = 0; i < tableHeader.cells.length; i++) {
                    let columna = tableHeader.cells[i].innerText;
                    let valueCol = row.cells[i].innerText;
                    dataRow += columna!= 'Acciones' ? `${columna} : ${valueCol}\n` : ''
                }
    
                const handleClick = async () => {
                    if (confirm(`Desea eliminar el siguiente elemento ?\n ${dataRow}`)) {
                        await api.delete(this.db,row.cells[0].innerText);
                        const newData = await api.getElement(this.db);
                        this.render(newData,this.db);
                        this.btonAction(); 
                    }   
                };
    
                row.querySelector(".actionBtn").addEventListener('click',handleClick);
            });
        } catch (error) {
        }

    }
}
export class Buscar extends Tabla{
    constructor(data,db){
        super(data,db);
        this.render(data)
    }
    renderAction(){
        return `<i class='bx bx-search-alt icon'></i>`
    }
    connectedCallback() {
        this.addEventListener('click', (event) => {
            if (event.target.classList.contains('actionBtn')) {
                // Obtener el ID de la fila
                const id = this.getRowId(event.target);
                
                let modalBtn = document.querySelector("#modal-btn");
                modalBtn.checked = true;

            }
        });
    }
}
export class Editar extends Tabla{
    constructor(data,db){
        super(data,db);
        this.render(data);
    }
    renderAction(){
        return `<i class='bx bxs-pencil icon'></i>`
    }
    connectedCallback() {
        this.querySelector('.actionBtn') .addEventListener('click', async (event) => {
            
                // Obtener el ID de la fila
                const id = this.getRowId(event.target);
                const modal = document.getElementById('modalWindow');


                modal.innerHTML = '';
                // let claseFormulario = ('Agregar' + this.db[0].charAt(0).toUpperCase() + this.db.slice(1)).replace(/"'/g, '');
                let instancia = new AgregarActivos('Guardar');
                modal.appendChild(instancia);
                const element = await api.getCategoryElement(this.db,id);
                instancia.idElement = id;
                
                fillForm(document.querySelector('#formulario'),element);
                
                let modalBtn = document.querySelector("#modal-btn");
                modalBtn.checked = true;

        });
    }
    getRowId(target) {
        const row = target.closest('.rowTable');
        const idCell = row.querySelector('#rows');
        return idCell.textContent;
    }

    
}
export class CrearAsignacion extends HTMLElement{
    constructor(){
        super();
        this.render();
        this.fillPersona();
    }
    render(){
        this.innerHTML = /* html */`
        <div class="formAgg" style="height: fit-content;">
            <header id='test'>Crear Asignacion</header>
            <form action="" id='formulario'>
                <div class="form first">
                    <div class="details personal">
                        <div class="fields">
                            <div class="input-field">
                                <label>Fecha</label>
                                <input type="date" placeholder="" required name="fecha">
                            </div>
                            <div class="input-field">
                                <label>Persona Responsable</label>
                                <select id="idPersonaResp" required name="idPersonaResp">
                                    <option disabled selected>Selecciona la persona</option>
                                </select>
                            </div>
                        </div>
                        <button>
                            <span class="btnText">Crear</span>
                        </button>
                    </div> 
                </div>
            </form>
        </div>
`,
        this.querySelector('#formulario').addEventListener('submit',async ()=>{
        let form = this.querySelector("#formulario");
        const data = Object.fromEntries(new FormData(form).entries());
        let lastId = await getLastId('asignacion');
        data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
        await api.post(data,'asignacion');
        }),
        this.querySelector('#idPersonaResp')
    }
    async fillPersona(){
        let options = this.querySelector('#idPersonaResp');
        let datos = await api.getElement('personas');
        let html =``; 
        
        datos.forEach(element => {
            html += `<option value="${element['id']}">${element['nombre']}</option>`
        })

        console.log(html);
        options.innerHTML += html;
        console.log(options.innerHTML);
    }
}

// export class AsignarAsignacion extends HTMLElement{
//     constructor(){
//         super();
//         this.getData();
//         this.render(this.getData());
//     }
//     render(data){
//         if(data.length > 0){
//         this.innerHTML = /* html */
//         `
//         <style rel="stylesheet">
//         @import "./components/contentStyle.css";
//         </style>
//         <table class="table table-hover">
//             <tr>
//                 ${Object.keys(data[0]).map( key => `<th>${key}</th>`).join('')}
//                 <th scope="col">Acciones</th>
//             </tr>
//             ${data.map(item => this.renderRow(item)).join('')}
//         </table>
//         `}
//         else{
//             this.innerText = "No hay datos"
//         }
//     }
//     renderRow(data){
//         return /* html */ `
//         <tr class="rowTable">
//             ${Object.values(data).map(value => `<td id='rows'>${value}</td>`).join('')}
//             <td> <button class='buttonTable actionBtn'>${this.renderAction()}</button> </td>
//         </tr>`;
//     }
//     renderAction(){
//         return ``
//     }
//     async getData(){
//         const data = await api.getElement('asignacion');
//         const personas = await api.getElement('personas');
//         let personasInData;
//         personas['id'].forEach( id => 
//             {
//                 data['id'].forEach(idPersona => {
//                     if(id == idPersona)
//                     {
//                         personasInData += `<option value="${personas['id']}">${personas['nombre']}</option>`
//                     }
//                 })
//             })
//         document.querySelector('#buscador'.setAtribute(list,listaPersonas))
//     }
// }


export class AgregarActivos extends HTMLElement{
    constructor(btnInnerText){
        super();
        this.render(btnInnerText);
        this.idElement = '';
        this.aggMarcas();
        this.aggTipoActivo();
        this.aggCategoria();
    }
    render(btnInnerText){   
        this.innerHTML = /* html */`
        <div class="formAgg">
            <header id='test'>Agregar Activo</header>
            <form action="" id='formulario'>
                <div class="form first">
                    <div class="details personal">
                        <div class="fields">
                            <div class="input-field">
                                <label>Codigo transaccion</label>
                                <input type="text" placeholder="" required name="codTransaccion">
                            </div>
                            <div class="input-field">
                                <label>Formulario</label>
                                <input type="text" placeholder="" required name="formulario">
                            </div>
                            <div class="input-field">
                                <label>Marca</label>
                                <select id="marcas" required name="marca">
                                    <option disabled selected>Selecciona la marca</option>
                                </select>
                            </div>
                            <div class="input-field">
                                <label>Categoria</label>
                                <select id="categoria" required name="categoria">
                                    <option disabled selected>Selecciona la categoria del activo</option>
                                </select>
                            </div>
                            <div class="input-field">
                                <label>Tipo</label>
                                <select id="tipoActivo" required name="tipoActivo">
                                    <option disabled selected>Selecciona el tipo de activo</option>
                                </select>
                            </div>
                            <div class="input-field">
                                <label>Valor Unitario</label>
                                <input type="text" placeholder="" required name="valor">
                            </div>
                            <div class="input-field">
                                <label>Proveedor</label>
                                <input type="text" placeholder="" required name="proveedor">
                            </div>
                            <div class="input-field">
                                <label>Serial</label>
                                <input type="text" placeholder="" required name="serial">
                            </div>
                            <div class="input-field">
                                <label>Empresa Responsable</label>
                                <input type="text" placeholder="" required name="empresa">
                            </div>
                            <div class="input-field">
                                <label>Ubicacion</label>
                                <input type="text" placeholder="" required name="ubicacion">
                            </div>
                            <div class="input-field">
                                <label>Estado</label>
                                <select id="estado" required name="estado">
                                    <option disabled selected>Selecciona el tipo de activo</option>
                                    <option>No asignado</option>
                                    <option>Asignado</option>
                                    <option>Dado de baja por daño</option>
                                    <option>En reparacion</option>
                                </select>
                            </div>
                        </div>
                        <button>
                            <span class="btnText">${btnInnerText == 'Agregar' ? 'Crear': 'Guardar'}</span>
                        </button>
                    </div> 
                </div>
            </form>
        </div>
`,
    this.querySelector('#formulario').addEventListener('submit',async ()=>{
        let form = this.querySelector("#formulario");
        const data = Object.fromEntries(new FormData(form).entries());
        let lastId = await getLastId('activos');
        data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
        this.querySelector(".btnText") == 'Crear' ? await api.post(data,'activos') : await api.patch(data,'activos',this.idElement);
})
    }
    async aggMarcas(){
        const htmlContent = await getDatos('marcas');
        this.querySelector("#marcas").innerHTML += htmlContent;
    }
    async aggTipoActivo(){
        const htmlContent = await getDatos('tipoActivo');
        this.querySelector("#tipoActivo").innerHTML += htmlContent;
    }
    async aggCategoria(){
        const htmlContent = await getDatos('categoriaActivos');
        this.querySelector("#categoria").innerHTML += htmlContent;
    }
}

export class AgregarSencillo extends HTMLElement{
    constructor(btnInnerText){
        super();
        this.render(btnInnerText);
    }
    render(btnInnerText){   
        this.innerHTML = /* html */`
        <div class="formAgg">
            <header id='test'>Agregar Marca</header>
            <form action="" id='formulario'>
                <div class="form first">
                    <div class="details personal">
                        <div class="fields">
                            <div class="input-field">
                                <label>Codigo transaccion</label>
                                <input type="text" placeholder="" required name="codTransaccion">
                            </div>
                            <div class="input-field">
                                <label>Formulario</label>
                                <input type="text" placeholder="" required name="formulario">
                            </div>
                            <div class="input-field">
                                <label>Marca</label>
                                <select id="marcas" required name="idMarca">
                                    <option disabled selected>Selecciona la marca</option>
                                </select>
                            </div>
                            <div class="input-field">
                                <label>Categoria</label>
                                <select id="idCategoria" required name="idCategoria">
                                    <option disabled selected>Selecciona la categoria del activo</option>
                                </select>
                            </div>
                            <div class="input-field">
                                <label>Tipo</label>
                                <select id="tipoActivo" required name="idTipoActivo">
                                    <option disabled selected>Selecciona el tipo de activo</option>
                                </select>
                            </div>
                            <div class="input-field">
                                <label>Valor Unitario</label>
                                <input type="text" placeholder="" required name="valor">
                            </div>
                            <div class="input-field">
                                <label>Proveedor</label>
                                <input type="text" placeholder="" required name="idProveedor">
                            </div>
                            <div class="input-field">
                                <label>Serial</label>
                                <input type="text" placeholder="" required name="serial">
                            </div>
                            <div class="input-field">
                                <label>Empresa Responsable</label>
                                <input type="text" placeholder="" required name="empresa">
                            </div>
                            <div class="input-field">
                                <label>Ubicacion</label>
                                <input type="text" placeholder="" required name="ubicacion">
                            </div>
                            <div class="input-field">
                                <label>Estado</label>
                                <select id="estado" required name="estado">
                                    <option disabled selected>Selecciona el tipo de activo</option>
                                    <option>No asignado</option>
                                    <option>Asignado</option>
                                    <option>Dado de baja por daño</option>
                                    <option>En reparacion</option>
                                </select>
                            </div>
                        </div>
                        <button>
                            <span class="btnText">${btnInnerText == 'Agregar' ? 'Crear': 'Editar'}</span>
                        </button>
                    </div> 
                </div>
            </form>
        </div>
`,
    this.querySelector('#formulario').addEventListener('submit',async ()=>{
        let form = this.querySelector("#formulario");
        const data = Object.fromEntries(new FormData(form).entries());
        let lastId = await getLastId('activos');
        data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
        data["idMarca"] = data["idMarca"].replace(/^\d+\.\s*/, '');
        data["idTipoActivo"] = data["idTipoActivo"].replace(/^\d+\.\s*/, '');
        data["idCategoria"] = data["idCategoria"].replace(/^\d+\.\s*/, '');
        saveData(data,'activos');
})
    }
    async aggMarcas(){
        const htmlContent = await getDatos('marcas');
        this.querySelector("#marcas").innerHTML += htmlContent;
    }
    async aggTipoActivo(){
        const htmlContent = await getDatos('tipoActivo');
        this.querySelector("#tipoActivo").innerHTML += htmlContent;
    }
    async aggCategoria(){
        const htmlContent = await getDatos('categoriaActivos');
        this.querySelector("#idCategoria").innerHTML += htmlContent;
    }
}




async function getDatos(url){
    let marcas = await api.getElement(url);
    let html = ``;
    marcas.forEach(item => {
        html += `<option>${item['nombre']}</option>`
    });
    return html
}

async function getLastId(tipo){
    let datos = await api.getElement(tipo);
    return datos[(Object.keys(datos).length - 1)]["id"];
}

function fillForm(form, data) {
    for (const campo in data) {
        console.log("campo: ",campo," data: ",data[campo]);
        if (Object.hasOwnProperty.call(data, campo)) {
            const elementoCampo = form.elements[campo];
            if (elementoCampo) {
                elementoCampo.value = data[campo];
            }
        }
    }
}

customElements.define('table-buscar',Buscar);
customElements.define('form-agregar',AgregarActivos);
customElements.define('table-eliminar',Eliminar);
customElements.define('table-editar',Editar);
customElements.define('asignacion-crear',CrearAsignacion);

