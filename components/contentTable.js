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

export class Editar extends Tabla{
    constructor(data,db){
        super(data,db);
        this.action = 'Editar';
        this.disableInputs = false;
        this.disableBtn = "flex";
        this.render(data);
        this.btonAction();
    }
    renderAction(){
        return `<i class='bx bxs-pencil icon'></i>`
    }
    btonAction() {
        this.querySelectorAll('.actionBtn').forEach( btn => 
            
            btn.addEventListener('click', async (event) => {
        
            // Obtener el ID de la fila
            const id = this.getRowId(event.target);
            const modal = document.getElementById('modalWindow');


            modal.innerHTML = '';
            // let claseFormulario = ('Agregar' + this.db[0].charAt(0).toUpperCase() + this.db.slice(1)).replace(/"'/g, '');
            let instancia = (() => {
                switch (this.db) {
                case 'activos':
                    return new AgregarActivos(this.action);
            
                case 'marcas':
                    return new AgregarMarcas(this.action);
            
                case 'personas':
                    return new AgregarPersonas(this.action);
            
                case 'estado':
                    return new AgregarEstado(this.action);
            
                case 'tipoPersona':
                    return new AgregarTipoPersona(this.action);
            
                case 'tipoMovActivo':
                    return new AgregarTipoMovActivo(this.action);
            
                case 'tipoActivo':
                    return new AgregarTipoActivo(this.action);
            
                case 'asignacion':
                    return new CrearAsignacion(this.action);
            
                case 'proveedores':
                    return new AgregarProveedores(this.action);
                }
            })();   
            modal.appendChild(instancia);
            const element = await api.getCategoryElement(this.db,id);
            instancia.idElement = id;
            
            fillForm(document.querySelector('#formulario'),element);
            
            let modalBtn = document.querySelector("#modal-btn");
            modalBtn.checked = true;
            document.querySelector("#formulario").querySelectorAll('input').forEach(input => this.disableInputs == false ? '' :input.disabled = this.disableInputs)
            document.querySelector("#formulario").querySelector('button').style.display = this.disableBtn;
    })
    )}
    getRowId(target) {
        const row = target.closest('.rowTable');
        const idCell = row.querySelector('#rows');
        return idCell.textContent;
    }

    
}

export class Buscar extends Editar{
    constructor(data,db){
        super(data,db);
        this.action ='Detalles'
        this.render(data);
        this.btonAction();
        this.disableInputs = true;
        this.disableBtn = "none";
    }
    renderAction(){
        return `<i class='bx bx-search-alt icon'></i>`
    }
    // connectedCallback() {
    //     this.addEventListener('click', (event) => {
    //         if (event.target.classList.contains('actionBtn')) {
    //             // Obtener el ID de la fila
    //             const id = this.getRowId(event.target);
                
    //             let modalBtn = document.querySelector("#modal-btn");
    //             modalBtn.checked = true;

    //         }
    //     });
    // }
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
        let idUltimo = await getLastId('asignacion');
        data['id'] = ((idUltimo != (null || undefined) ? parseInt(idUltimo) : 0) + 1).toString();
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

        options.innerHTML += html;
    }
}

export class CrearMovimientoActivo extends HTMLElement{
    constructor(idAsignacion,data) {
        super();
        this.idAsignacion = idAsignacion;
        this.render('Crear',data);
    }

    render(btnInnerText, data) {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
            @import "./components/modalStyle.css";
            </style>
            <div class="formAgg">
                <header id='test'>Crear Movimiento de Activo</header>
                <form action="" id='formulario'>
                    <div class="form first">
                        <div class="details personal">
                            <div class="fields">
                                <div class="input-field">
                                    <label>Asignacion</label>
                                    <input type="text" placeholder="" readonly required name="idAsignacion" value = ${this.idAsignacion}>
                                </div>
                                <div class="input-field">
                                    <label>Fecha</label>
                                    <input type="date" placeholder="" required name="fecha">
                                </div>
                                <div class="input-field">
                                    <label>Comentario</label>
                                    <input type="text" placeholder="" required name="comentario">
                                </div>
                                <div class="input-field">
                                    <label>Activo</label>
                                    <input type="text" placeholder="" readonly required name="idActivo" id='idActivo'>
                                </div>
                            </div>
                            <button>
                                <span class="btnText">${btnInnerText == 'Agregar' ? 'Crear': 'Guardar'}</span>
                            </button>
                        </div> 
                    </div>
                </form>
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="buscador" ">
                <div class="container-fluid">
				<!-- customElement Agregado por javascript -->
                <table class="table table-hover">
                <tr>
                    ${(Object.keys(data[0]).map( key => `<th>${key}</th>`).join(''))}
                    <th scope="col">Acciones</th>
                </tr>
                ${data.map(item => this.renderRow(item)).join('')}
                </table>
			    </div>
            </div>
        `;
        this.querySelector('button').addEventListener('click', async (e) => {
            e.preventDefault()
            let form = this.querySelector("#formulario");
            const data = Object.fromEntries(new FormData(form).entries());
            let ultimoID = await getLastId('movActivo');
            alert(data['idActivo']);
            let itemActivo = await api.getCategoryElement('activos',data['idActivo'])
            itemActivo['estado'] = 'Asignado';
            data['id'] = ((ultimoID != (null || undefined) ? parseInt(ultimoID) : 0) + 1).toString();
            await api.post(data, 'movActivo');
            await api.patch(itemActivo,'activos',itemActivo['id'])
        });
        this.querySelector("#buscador").addEventListener('keyup',()=>{
            let input = this.querySelector("#buscador").value.toLowerCase();
            let rows = this.querySelectorAll('.rowTable');
            rows.forEach(row =>{
                let rowVisibility = false;
                row.querySelectorAll("#rows").forEach(rowContent =>{
                    let content = rowContent.innerText.toLowerCase();
                    content.includes(input) ? rowVisibility = true : ""
                })
                if(rowVisibility){
                    row.style.display = "table-row"
                }else{
                    row.style.display = "none"
                }
            })
        })
        this.querySelector('#btnMovActivos').addEventListener('click',(e)=>{
            this.querySelectorAll("#idActivo").forEach(icon => {icon.classList.remove('bx-checkbox-checked')})
            let btn = this.querySelector('.btnSelect')
            this.querySelector("#idActivo").value = this.getRowId(e.target)
            btn.classList.toggle("bx-checkbox")
            btn.classList.toggle("bx-checkbox-checked")
        })
    }
    renderRow(data){
        return /* html */ `
        <tr class="rowTable">
            ${Object.values(data).map(value => `<td id='rows'>${value}</td>`).join('')}
            <td> <button class='buttonTable actionBtn' id='btnMovActivos'><i class='bx btnSelect bx-checkbox'></i></button> </td>
        </tr>`;
    }
    getRowId(target) {
        const row = target.closest('.rowTable');
        const idCell = row.querySelector('#rows');
        return idCell.textContent;
    }
}



export class AsignarAsignacion extends HTMLElement{
    constructor(){
        super();
        this.getDataAndRender();
        this.idAsignaciones = {};
    }
    async getDataAndRender(){
        this.data = await this.getDataPersonas();
        this.render(this.data);
        this.btnAction();
    }
    render(data){
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
        `
    }
    renderRow(data){
        return /* html */ `
        <tr class="rowTable">
        ${Object.values(data).map(value => `<td id='rows'>${value}</td>`).join('')}
            <td> <button class='buttonTable actionBtn'>${this.renderAction()}</button> </td>
        </tr>`;
    }
    renderAction(){
        return `<i class='bx bxs-bookmark-plus'></i>`
    }
    async getDataPersonas(){
        const data = await api.getElement('asignacion');
        const personas = await api.getElement('personas');
        let listaPersonas =[];
        personas.forEach( dataPersonas => 
            {
                data.forEach(asignacion => {
                    if(dataPersonas['id'] == asignacion['idPersonaResp'])
                    {
                        listaPersonas.push(dataPersonas)
                        this.idAsignaciones[dataPersonas['id']]=(asignacion['id'])
                    }
                })
        })
        return listaPersonas;
    }
    btnAction(){
        this.querySelectorAll('.actionBtn').forEach( btn => 
            btn.addEventListener('click', async (event) => {
        
            // Obtener el ID de la fila
            const id = this.getRowId(event.target);
            const modal = document.getElementById('modalWindow');


            modal.innerHTML = '';
            
            const element = await api.getElement('activos');
            
            let noAsignados=[];
            element.forEach(activo =>{
                activo['estado'] == "No asignado" ? noAsignados.push(activo) : '';
            })
            if (noAsignados.length >0 ){
                let idAsignacion = this.idAsignaciones[id]
                let instancia = new CrearMovimientoActivo(idAsignacion,noAsignados);  
                instancia.idAsignacion = idAsignacion;
                
                let modalBtn = document.querySelector("#modal-btn");
                modalBtn.checked = true;
                
                modal.appendChild(instancia);
            }else{
                alert('No hay activos disponibles para asignar');
            }

        })
    )}
    getRowId(target) {
        const row = target.closest('.rowTable');
        const idCell = row.querySelector('#rows');
        return idCell.textContent;
    }
}

//Agregar Persona

export class AgregarPersonas extends HTMLElement {
    constructor(btnInnerText) {
        super();
        this.render(btnInnerText);
        rellenarSelect('tipoPersona','#idTipoPersona');
    }

    render(btnInnerText) {
        this.innerHTML = /* html */ `
            <div class="formAgg">
                <header id='test'>Agregar Personas</header>
                <form action="" id='formulario'>
                    <div class="form first">
                        <div class="details personal">
                            <div class="fields">
                                <div class="input-field">
                                    <label>Id (CC, NIT)</label>
                                    <input type="text" placeholder="" required name="id">
                                </div>
                                <div class="input-field">
                                    <label>Nombre</label>
                                    <input type="text" placeholder="" required name="nombre">
                                </div>
                                <div class="input-field">
                                    <label>Email</label>
                                    <input type="text" placeholder="" required name="email">
                                </div>
                                <div class="input-field">
                                    <label>Tipo Persona</label>
                                    <select id="idTipoPersona" required name="idTipoPersona">
                                        <option disabled selected>Selecciona el tipo de persona</option>
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
        `;
        this.querySelector('#formulario').addEventListener('submit', async (e) => {
            let form = this.querySelector("#formulario");
            const data = Object.fromEntries(new FormData(form).entries());
            let lastId = await getLastId('personas');
            data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
            await api.post(data, 'personas');
        });
    }
}

// Agregar Estado ------------------------------------------------------------------------------------------------------------

export class AgregarEstado extends HTMLElement{
    constructor(btnInnerText) {
        super();
        this.render(btnInnerText);
    }

    render(btnInnerText){   
        this.innerHTML = /* html */`
        <div class="formAgg">
            <header id='test'>Agregar Estados</header>
            <form action="" id='formulario'>
                <div class="form first">
                    <div class="details personal">
                        <div class="fields">
                            <div class="input-field">
                                <label>Nombre</label>
                                <input type="text" placeholder="" required name="nombre">
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
this.querySelector('#formulario').addEventListener('submit', async () => {
    let form = this.querySelector("#formulario");
    const data = Object.fromEntries(new FormData(form).entries());
    let lastId = await getLastId('estados'); 
    data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
    this.querySelector(".btnText") == 'Crear' ? await api.post(data,'estados') : await api.patch(data,'estados',this.idElement)
})
    }
}

// Tipo de persona ---------------------------------------------------------------------------

export class AgregarTipoPersona extends HTMLElement{
    constructor(btnInnerText) {
        super();
        this.render(btnInnerText);
    }
    render(btnInnerText){   
        this.innerHTML = /* html */`
        <div class="formAgg">
            <header id='test'>Agregar Tipo Persona</header>
            <form action="" id='formulario'>
                <div class="form first">
                    <div class="details personal">
                        <div class="fields">
                            <div class="input-field">
                                <label>Nombre</label>
                                <input type="text" placeholder="" required name="nombre">
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
this.querySelector('#formulario').addEventListener('submit', async () => {
    let form = this.querySelector("#formulario");
    const data = Object.fromEntries(new FormData(form).entries());
    let lastId = await getLastId('tiposPersona'); // Cambiar por el nombre correcto del recurso
    data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
    this.querySelector(".btnText") == 'Crear' ? await api.post(data,'tiposPersona') : await api.patch(data,'tiposPersona',this.idElement); // Cambiar por el nombre correcto del recurso
});
}
}


// Agregar tipo Activo ------------------------------------------------------------------------------------

export class AgregarTipoActivo extends HTMLElement{
    constructor(btnInnerText) {
        super();
        this.render(btnInnerText);
    }

    render(btnInnerText){   
        this.innerHTML = /* html */`
        <div class="formAgg">
            <header id='test'>Agregar Tipo Activo</header>
            <form action="" id='formulario'>
                <div class="form first">
                    <div class="details personal">
                        <div class="fields">
                            <div class="input-field">
                                <label>Nombre</label>
                                <input type="text" placeholder="" required name="nombre">
                            </div>
                            <div class="input-field">
                                <label>Email</label>
                                <input type="text" placeholder="" required name="email">
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
this.querySelector('#formulario').addEventListener('submit', async () => {
    let form = this.querySelector("#formulario");
    const data = Object.fromEntries(new FormData(form).entries());
    let lastId = await getLastId('tipoActivo'); // Reemplaza 'tipoActivo' con el nombre correcto de tu recurso
    data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
    this.querySelector(".btnText") == 'Crear' ? await api.post(data,'tipoActivo') : await api.patch(data,'tipoActivo',this.idElement); // Reemplaza 'tipoActivo' con el nombre correcto de tu recurso
});
}

async aggMarcas() {
const htmlContent = await getDatos('marcas');
this.querySelector("#marcas").innerHTML += htmlContent;
}

async aggTipoActivo() {
const htmlContent = await getDatos('tipoActivo');
this.querySelector("#tipoActivo").innerHTML += htmlContent;
}

async aggCategoria() {
const htmlContent = await getDatos('categoriaActivos');
this.querySelector("#categoria").innerHTML += htmlContent;
}
}


// Agregar movimietno tipo Activo ------------------------------------------------------------------------------------

export class AgregarTipoMovActivo extends HTMLElement{
    constructor(btnInnerText) {
        super();
        this.render(btnInnerText);
    }

    render(btnInnerText){   
        this.innerHTML = /* html */`
        <div class="formAgg">
            <header id='test'>Agregar Tipo Movimiento Activo</header>
            <form action="" id='formulario'>
                <div class="form first">
                    <div class="details personal">
                        <div class="fields">
                            <div class="input-field">
                                <label>Nombre</label>
                                <input type="text" placeholder="" required name="nombre">
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
    this.querySelector('#formulario').addEventListener('submit', async () => {
            let form = this.querySelector("#formulario");
            const data = Object.fromEntries(new FormData(form).entries());
            let lastId = await getLastId('tipoMovActivo');
            data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
            this.querySelector(".btnText") == 'Crear' ? await api.post(data,'tipoMovActivo') : await api.patch(data,'tipoMovActivo',this.idElement);
        });
    }
}


// Agregar proveedor ------------------------------------------------------------------------------------

export class AgregarProveedores extends HTMLElement{
    constructor(btnInnerText) {
        super();
        this.render(btnInnerText);
    }

    render(btnInnerText){   
        this.innerHTML = /* html */`
        <div class="formAgg">
            <header id='test'>Agregar Proveedor</header>
            <form action="" id='formulario'>
                <div class="form first">
                    <div class="details personal">
                        <div class="fields">
                            <div class="input-field">
                                <label>Nombre</label>
                                <input type="text" placeholder="" required name="nombre">
                            </div>
                            <div class="input-field">
                                <label>Email</label>
                                <input type="text" placeholder="" required name="email">
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
    this.querySelector('#formulario').addEventListener('submit', async () => {
            let form = this.querySelector("#formulario");
            const data = Object.fromEntries(new FormData(form).entries());
            let lastId = await getLastId('proveedores');
            data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
            this.querySelector(".btnText") == 'Crear' ? await api.post(data,'proveedores') : await api.patch(data,'proveedores',this.idElement);
        });
    }
}

// Agregar Aactivos
export class AgregarActivos extends HTMLElement{
    constructor(btnInnerText){
        super();
        this.render(btnInnerText);
        this.idElement = '';
        rellenarSelect('marcas','#idMarcas');
        rellenarSelect('tipoActivo','#idTipoActivo');
        rellenarSelect('categoriaActivos','#idCategoriaActivos');
    }
    render(btnInnerText){   
        this.innerHTML = /* html */`
        <div class="formAgg">
            <header id='test'>${btnInnerText} Activo</header>
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
                                <select id="idMarcas" required name="idMarcas">
                                    <option disabled selected>Selecciona la marca</option>
                                </select>
                            </div>
                            <div class="input-field">
                                <label>Categoria</label>
                                <select id="idCategoriaActivos" required name="idCategoriaActivos">
                                    <option disabled selected>Selecciona la categoria del activo</option>
                                </select>
                            </div>
                            <div class="input-field">
                                <label>Tipo</label>
                                <select id="idTipoActivo" required name="idTipoActivo">
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
        this.querySelector(".btnText").innerText == 'Crear' ? await api.post(data,'activos') : await api.patch(data,'activos',this.idElement);
        document.querySelector('.modalBtn').checked = false;
    })
        }
}
// Agregar Marcas
export class AgregarMarcas extends HTMLElement{
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
                                <label>Nombre</label>
                                <input type="text" placeholder="" required name="nombre">
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
        let lastId = await getLastId('marcas');
        data['id'] = ((lastId != (null || undefined) ? parseInt(lastId) : 0) + 1).toString();
        saveData(data,'marcas');
    })
    }
}


async function getDatos(url){
    let marcas = await api.getElement(url);
    let html = ``;
    marcas.forEach(item => {
        html += `<option value=${item['id']}>${item['nombre']}</option>`
    });
    return html
}
async function getLastId(tipo){
    let datos = await api.getElement(tipo);
    let lastid = datos!='' ? datos[(Object.keys(datos).length - 1)]["id"] : 0;
    return lastid;
}
async function fillForm(form, data) {
    for (const campo in data) {
        if (Object.hasOwnProperty.call(data, campo)) {
            const elementoCampo = form.elements[campo];
            if (elementoCampo && !campo.startsWith('id')) {
                elementoCampo.value = data[campo];
            }
            else if(campo.startsWith('id')&& campo.length > 2 )
            {
                let nameOfId = await api.getCategoryElement((campo.charAt(2).toLowerCase() + campo.substring(3)),data[campo]);
                elementoCampo.innerHTML = `<option value=${data[campo]}>${nameOfId['nombre']}</option>`;
            }else if(campo == "id" && elementoCampo) {
                elementoCampo.value = data[campo]
                elementoCampo.disabled = true;
            }
        }
    }
}
async function rellenarSelect(categoria,idContainer){
    const htmlContent = await getDatos(categoria);
    let container = document.querySelector(idContainer);
    container.innerHTML += htmlContent;
}



customElements.define('table-buscar',Buscar);
customElements.define('table-eliminar',Eliminar);
customElements.define('table-editar',Editar);


customElements.define('asignacion-crear',CrearAsignacion);
customElements.define('asignacion-asignar',AsignarAsignacion)


customElements.define('form-activos',AgregarActivos);
customElements.define('form-personas',AgregarPersonas);
customElements.define('form-tipopersonas',AgregarTipoPersona);
customElements.define('form-estados',AgregarEstado);
customElements.define('form-proveedores',AgregarProveedores);
customElements.define('form-tipoactivo',AgregarTipoActivo);
customElements.define('form-tipomovactivo',AgregarTipoMovActivo);
customElements.define('form-marcas',AgregarMarcas);

customElements.define('form-movactiv',CrearMovimientoActivo)
