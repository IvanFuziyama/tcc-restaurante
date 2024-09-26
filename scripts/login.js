function Entrar(){
    let nome = document.getElementById('email').value
    let senha = document.getElementById('senha').value
    if(nome == "" || senha == ""){
        alert("Coloque as informações")
    }else{
        window.location.href="../paginas-adm/adm.html"
    }
}