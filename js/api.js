const URT_API = 'http://localhost:3000';
const myHeaders = new Headers({
    "Content-Type": "application/json"
});


const getCategory = async(element) =>{
    try {
        const respuesta = await fetch(`${URT_API}/${element}`);
        if (respuesta.status == 200) {
            let datos = await respuesta.json();
            return datos;
        }
    } catch (error) {
        console.log('Error con el metodo GET: ', error);
    }
}

const getCategoryElement = async(element,id) =>{
    try {
        const respuesta =await fetch(`${URT_API}/${element}/${id}`);
        if (respuesta.status == 200) {
            let datos = await respuesta.json();
            return datos;
        }
    } catch (error) {
        alert(error)
        console.log('Error con el metodo GET: ', error);
    }
}

const post = async(data, element) =>{
    fetch(`${URT_API}/${element}`,{
        method:"POST",
        headers: myHeaders,
        body: JSON.stringify(data)
    })
    .then(res => {return res.json})
    .catch(err  => {console.log("Error en la preticion de POST: ",err)})
}

const patch = async(data, element,id) =>{
    fetch(`${URT_API}/${element}/${id}`,{
        method:"PATCH",
        headers: myHeaders,
        body: JSON.stringify(data)
    })
    .then(res => {return res.json})
    .catch(err  => {console.log("Error en la preticion de PATCH: ",err)})
}


const del = async(element,id) =>{
    try{
        return await fetch(`${URT_API}/${element}/${id}`,{
            method: "delete",
            headers: myHeaders
        })
    }
    catch (error){
        console.log('Error en la preticion de delete:',error.message)
    }
}

export{
    // getAll as getAll,
    getCategory as getElement,
    post as post,
    patch as patch,
    del as delete,
    getCategoryElement as getCategoryElement
}