function Entrar(){
    let email = document.querySelector('input#email').value
    let senha = document.querySelector('input#senha').value

    if(email == "" || senha == ""){
        alert("Coloque as informações")
    }else{
        window.location.href="../paginas-adm/adm.html"
    }
}