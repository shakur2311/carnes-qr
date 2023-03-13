const URI = "http://localhost:8000"


const validarLogin= (e)=>{
    e.preventDefault()
    let usuarioInput = document.getElementById("usuarioInput").value;
    let passInput = document.getElementById("passInput").value;
    let data = {usuarioInput,passInput};
    fetch("/login",{
        method:'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res=>res.json()).then(data=>{
        if(data.msg=="Credenciales correctas!"){
            window.location.href = `${URI}/home`
        }else if(data.msg=="Contraseña incorrecta!"){
            toastr.error("Contraseña incorrecta!","Intente denuevo!")
        }else if(data.msg=="Usuario incorrecto!"){
            toastr.error("Usuario incorrecto!","Intente denuevo!")
        }
    })
}

const crearCarne = (e)=>{
    e.preventDefault()
    let formularioCrearCD = document.getElementById('formularioCrearCD');
    let creandoCarneModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('creandoCarneModal'));
    let codigoInput = document.getElementById("codigoInput").value;
    let nombreInput = document.getElementById("nombreInput").value;
    let apellidoInput = document.getElementById("apellidoInput").value;
    let correoiInput = document.getElementById("correoiInput").value;
    let oficinaInput = document.getElementById("oficinaInput").value;
    let cargoInput = document.getElementById("cargoInput").value;
    let imagenInput = document.getElementById("imagenInput").files[0];
    if(codigoInput!="" && nombreInput!="" && apellidoInput!="" && 
    correoiInput!="" && oficinaInput!="" && cargoInput!="" && imagenInput!=null){
        let formdata = new FormData();
        formdata.append('codigoInput',codigoInput);
        formdata.append('nombreInput',nombreInput);
        formdata.append('apellidoInput',apellidoInput);
        formdata.append('correoiInput',correoiInput);
        formdata.append('oficinaInput',oficinaInput);
        formdata.append('cargoInput',cargoInput);
        formdata.append('imagenInput',imagenInput);
        creandoCarneModal.show();
        fetch("/home",{
            method:"POST",
            body: formdata
        }).then(res=>res.json()).then(data=>{
            if(data.msg=="Carne creado!"){
                formularioCrearCD.reset();
                creandoCarneModal.hide();
                toastr.success('Carne digital creado!','Éxito!')
            }else{
                toastr.error('Error inesperado!',"Error!")
            }
        });
    }else{
        toastr.error('Faltan llenar datos!',"Completar!");
    }
}