document.querySelector('#side_botao').addEventListener('click', function(){
    document.querySelector('#sidebar').classList.toggle('open_sidebar')
})

document.querySelector('#saida_botao').addEventListener('click', function() {
    auth.signOut().then(() => {
        window.location.href = "../paginas-adm/login-adm.html";
    }).catch((error) => {
        console.error("Erro ao fazer logout:", error);
    });
});