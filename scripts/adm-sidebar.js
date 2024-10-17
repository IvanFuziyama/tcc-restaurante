document.querySelector('#side_botao').addEventListener('click', function(){
    document.querySelector('#sidebar').classList.toggle('open_sidebar')
})

function sair() {
    if (confirm('Você realmente deseja sair?')) {
        window.location.href = 'login-adm.html';
    }
}