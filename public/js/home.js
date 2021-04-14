"use strict"

sessionStorage.alumnoToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoic2k3MjI3NTJAaXRlc28ubXgiLCJpYXQiOjE2MTgzODU3ODJ9.JgXhy079d0xXh9CxC2ygahBza3VPyg2xtWDLI18iVXw";
sessionStorage.userToken = "";
let register = document.getElementById("registro");
let login = document.getElementById("login");

// VALIDACIÓN DE REGISTRO
register.addEventListener("change", () => {
    let validField = document.querySelectorAll("#registro input:valid");    
    let invalidField = document.querySelectorAll("#registro input:invalid");
    let rButton = document.querySelectorAll("#registro button")[2];
    let password = document.querySelectorAll("#registro input")[3];
    let confirmPassword = document.querySelectorAll("#registro input")[4];
    
    invalidField.forEach((e) => {
        e.classList.add("is-invalid");
    })

    validField.forEach((e) => {
        e.classList.remove("is-invalid");     
        e.classList.add("is-valid");   
    })
    
    // CONFIRMAR CONTRASEÑA
    if (password.value !== confirmPassword.value){
        confirmPassword.classList.add("is-invalid");
    }
    else {
        confirmPassword.classList.remove("is-invalid");
    }

    // VALIDAR QUE EL BOTÓN ESTÉ DESACTIVADO SI NO SE CUMPLE CON QUE TODO ESTÉ LLENO Y LAS CONTRASEÑAS COINCIDAN
    if (invalidField.length < 1 && password.value === confirmPassword.value) {
        rButton.disabled = false;
    }
    else {
        rButton.disabled = true;
    }
});

// REALIZAR REGISTRO EN EL BACKEND
register.addEventListener("submit", (e) => {

    let form = document.querySelectorAll("#registro input");
    let nombre = form[0].value;
    let apellido = form[1].value;
    let correo = form[2].value;
    let password = form[3].value;
    let url = form[8].value;
    let sexo = form[6].checked ? "M" : "H";
    let fecha = form[5].value;

    let newUser = {
        nombre,
        apellido,
        correo,
        password,
        sexo,
        fecha
    };

    console.log('VDVB', newUser);

    if(url) {
        newUser.url = url;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://users-dasw.herokuapp.com/api/users");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-admin", sessionStorage.alumnoToken);
    xhr.send([JSON.stringify(newUser)]);

    xhr.onload = () => {
        if (xhr.status != 201) { 
            alert(JSON.parse(xhr.responseText).error); 
        } 
        else {
            alert("El registro fue un éxito."); 
        }
    };
    e.preventDefault();
});

// VALIDACIÓN DE LOGIN
login.addEventListener("change", (e) => {
    let input = document.querySelectorAll("#login input");   
    let validField = document.querySelectorAll("#login input:valid");    
    let invalidField = document.querySelectorAll("#login input:invalid");
    let password = input[1].value;

    invalidField.forEach((e) => {
        e.classList.add("is-invalid");
    })

    validField.forEach((e) => {
        e.classList.remove("is-invalid");     
        e.classList.add("is-valid");   
    })
    
    // CONFIRMA QUE SÍ HAY UNA CONTRASEÑA
    if (password.length < 1) {
        input[1].classList.add("is-invalid");
    }
    else {
        input[1].classList.remove("is-invalid");     
        input[1].classList.add("is-valid");   
    }

    // VALIDAR QUE EL BOTÓN ESTÉ DESACTIVADO SI NO SE CUMPLE CON QUE TODO ESTÉ LLENO Y EXISTE UNA PASSWORD
    if (invalidField.length < 1 && password) {
        btnLogin.disabled = false;
    }
    else {
        btnLogin.disabled = true;
    }
});

// REALIZAR PETICIÓN DE LOGIN AL BACKEND
login.addEventListener("click", (e) => {
    let input = document.querySelectorAll("#login input");
    let correo = input[0].value;
    let password = input[1].value;

    let loginUser = {
        correo,
        password
    }

    console.log('VDVB', loginUser);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://users-dasw.herokuapp.com/api/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-admin", sessionStorage.alumnoToken);
    xhr.send([JSON.stringify(loginUser)]);

    xhr.onload = () => {
        if (xhr.status != 200) {
            alert(JSON.parse(xhr.responseText).error); 
        } 
        else {
            sessionStorage.userToken = JSON.parse(xhr.responseText).token;
            window.location.href = "consultas.html";
        }
    };
})
