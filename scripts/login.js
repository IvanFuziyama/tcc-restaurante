//fazer com firebase

function verSenha(){
    const senhaTxt = document.querySelector('input#senha')
    const senhaVer = document.querySelector('span#ver-senha')

    if (senhaTxt.type === 'password') {
        senhaTxt.type = 'text';
        senhaVer.textContent = 'visibility_off'; // olho fechado
    } else {
        senhaTxt.type = 'password';
        senhaVer.textContent = 'visibility'; // olho aberto
    }
}
