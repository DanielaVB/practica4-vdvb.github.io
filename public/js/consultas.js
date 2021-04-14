"use strict"

sessionStorage.alumnoToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoic2k3MjI3NTJAaXRlc28ubXgiLCJpYXQiOjE2MTgzODU3ODJ9.JgXhy079d0xXh9CxC2ygahBza3VPyg2xtWDLI18iVXw";
sessionStorage.userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoic2k3MjI3NTJAaXRlc28ubXgiLCJjb3JyZW8iOiJzaTcyMjc1MkBpdGVzby5teCIsImlpZCI6OCwiaWF0IjoxNjE4Mzg5OTAxLCJleHAiOjE2MTgzOTM1MDF9.Bf2xX5GfU2ovtMrPCDTj4jPFzu5UQrDuPsiqkvwKAI4";
let edit = document.getElementById("edit");
let editBtn = document.getElementById("editBtn");
let deleteBtn = document.getElementById("deleteBtn");
let currentUser = null;

// MOSTRAR TODOS LOS USUARIOS
let getAllUsers = () => {
    let data = "";

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://users-dasw.herokuapp.com/api/users");
    xhr.setRequestHeader("x-admin", sessionStorage.alumnoToken);
    xhr.setRequestHeader("x-auth", sessionStorage.userToken);
    xhr.send(data);
    xhr.onload = () => {
        if (xhr.status != 200) {
            alert(JSON.parse(xhr.responseText).error); 
        } 
        else {
            displayUsers(JSON.parse(xhr.responseText));
        }
    };
}

// MANDAR LOS USUARIOS A HTML
let displayUsers = (users) => {
    let lista = document.getElementById("lista");
    let user = "";
    users.forEach((e, i) => {
        user = `            
        <div class="media col-8 mt-2">
            <div class="media-left align-self-center mr-3">
                <img class="rounded-circle" style="width: inherit;" src="${e.url}">
            </div>
            <div class="media-body">
                <h4>${e.nombre} ${e.apellido}</h4>
                <p >Correo: ${e.correo}</p>
            </div>
            <div class="media-right align-self-center">
                <div class="row">
                    <button onclick="verDetalle(\'${e.correo}\')" data-toggle="modal" data-target="#edit" class="btn btn-primary edit"><i class="fas fa-search edit  "></i></button>
                </div>
                <div class="row">
                    <button onclick="editarUsuario(\'${e.correo}\')" data-toggle="modal" data-target="#edit" class="btn btn-primary edit"><i class="fas fa-pencil-alt edit"></i></button>
                </div>
                <div class="row">
                    <button onclick="borrarUsuario(\'${e.correo}\')" data-toggle="modal" data-target="#delete" class="btn btn-primary edit"><i class="fas fa-trash-alt  remove"></i></button>
                </div>
            </div>
        </div>
        `;
        lista.insertAdjacentHTML("beforeend", user);
    });
}
getAllUsers();

// EDITAR EL USUARIO MEDIANTE EL CORREO
async function editarUsuario(correo) {
    getUser(correo, editModal);
}

// MODAL DE EDICIÓN
let editModal = () => {
    let input = document.querySelectorAll("#edit input");
    input[0].value = currentUser.nombre;
    input[1].value = currentUser.apellido;
    input[2].value = currentUser.password;
    input[3].value = currentUser.password;
    input[4].value = currentUser.fecha;
    input[5].value = currentUser.url;
}

// VALIDAR EDICIÓN DE USUARIO
edit.addEventListener("change", () => {
    let validField = document.querySelectorAll("#edit input:valid");    
    let invalidField = document.querySelectorAll("#edit input:invalid");
    let password = document.querySelectorAll("#edit input")[2];
    let cPassword = document.querySelectorAll("#edit input")[3];

    invalidField.forEach((e) => {
        e.classList.add("is-invalid");
    });

    validField.forEach((e) => {
        e.classList.remove("is-invalid");     
        e.classList.add("is-valid");   
    });
    
    //VALIDA QUE LAS CONTRASEÑAS SEAN IGUALES
    if (password.value !== cPassword.value) {
        cPassword.classList.add("is-invalid");
    }
    else {
        cPassword.classList.remove("is-invalid");
        password.classList.remove("is-invalid");
    }

    // VALIDAR QUE EL BOTÓN ESTÉ DESACTIVADO SI NO SE CUMPLE CON QUE TODO ESTÉ LLENO Y LAS CONTRASEÑAS COINCIDAN
    if (invalidField.length < 1 && password.value === cPassword.value) {
        editBtn.disabled = false;
    }
    else {
        editBtn.disabled = true;
    }
});

// MANDAR SOLICITUD AL BACKEND PARA EDICIÓN
editBtn.addEventListener("click", (e) => {
    let form = document.querySelectorAll("#edit input");
    let nombre = form[0].value;
    let apellido = form[1].value;
    let password = form[2].value;
    let url = form[5].value;
    let fecha = form[4].value;
    let correo = currentUser.correo;
    let sexo = currentUser.sexo;

    let editedUser = {
        nombre,
        apellido,
        correo,
        password,
        sexo,
        fecha
    };

    if (url) {
        editedUser.url = url;
    }
    
    console.log("VDVB", editedUser);

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://users-dasw.herokuapp.com/api/users/" + editedUser.correo);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-admin", sessionStorage.alumnoToken);
    xhr.setRequestHeader("x-auth", sessionStorage.userToken);
    xhr.send([JSON.stringify(editedUser)]);

    xhr.onload = () => {
        if (xhr.status != 200) {
            alert(JSON.parse(xhr.responseText).error); 
        } 
        else {
            alert("Se actualizó la información de manera correcta.");
            location.reload();
        }
    }
});

// PETICIÓN PARA OBTENER UN SÓLO USUARIO
let getUser = (correo, cb) => {
    let data = null;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://users-dasw.herokuapp.com/api/users/" + correo);
    xhr.setRequestHeader("x-admin", sessionStorage.alumnoToken);
    xhr.setRequestHeader("x-auth", sessionStorage.userToken);
    xhr.send(data);

    xhr.onload = () => {
        if (xhr.status != 200) { 
            alert(JSON.parse(xhr.responseText).error); 
        } 
        else {
            currentUser = JSON.parse(xhr.responseText);
            cb();
        }
    };
}

