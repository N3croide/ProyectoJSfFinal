import * as content from '../components/contentTable.js'
import * as api from './api.js'

const contentContiner = document.querySelector('.container-fluid');
const modalWindow = document.querySelector('#modalWindow');

document.querySelectorAll(".btnSection").forEach(element =>{
    element.addEventListener('click',async()=>{
        let category = getComputedStyle(element).getPropertyValue('--dataSection').replace(/'/g, '');
        let action = element.textContent;
        let tituloTabla  = document.querySelector('#tituloTabla');
        let actionPlusCategory = action + " " +category[0].charAt(0).toUpperCase() + category.slice(1);
        tituloTabla.innerText = actionPlusCategory;
        let data = await api.getElement(category);
        if (category != 'asignacion')
        {
            let createClass = (action != 'Agregar') ? content[action] : content[actionPlusCategory.replace(/ /g, '')];
            let elementoAgg = (action != 'Agregar') ? new createClass(data,category) : new createClass(action);
            contentContiner.innerHTML ="";
            modalWindow.innerHTML = "";
            action != 'Agregar' ? contentContiner.appendChild(elementoAgg) : modalWindow.appendChild(elementoAgg);
        }else{
            let createClass = content[actionPlusCategory.replace(/ /g, '')];
            let elementAgg = new createClass();
            contentContiner.innerHTML = "";
            contentContiner.appendChild(elementAgg)
        }
    })
})

document.querySelector("#buscador").addEventListener('keyup',()=>{
    let input = buscador.value.toLowerCase();
    let rows = document.querySelectorAll('.rowTable');
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
