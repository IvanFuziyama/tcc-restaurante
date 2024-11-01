    
const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.appspot.com",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  function cadastrar(){
    const email = document.querySelector('input#email').value;
    const senha = document.querySelector('input#senha').value;
    const msgErro = document.querySelector('p.msg-erro')
    msgErro.innerHTML = ''

    const confirmarSenha = document.querySelector('input#confirmar-senha').value;
    if (senha !== confirmarSenha) {
        msgErro.innerHTML = ("As senhas não coincidem.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
        alert("Seus dados foram cadastrados com sucesso!");
        document.querySelector('input#email').value = '';
        document.querySelector('input#senha').value = '';
        document.querySelector('input#confirmar-senha').value = '';
        window.location.href="login-usuario.html"
    })
    .catch((error) => {
        alert("Falha ao cadastrar: " + error.message);
    });
}

function verSenha(){
    const senhaTxt = document.querySelector('input#senha')
    const senhaVer = document.querySelector('span#ver-senha')


    if (senhaTxt.type === 'password') {
        senhaTxt.type = 'text';
        senhaVer.textContent = 'visibility'; // olho fechado
    } else {
        senhaTxt.type = 'password';
        senhaVer.textContent = 'visibility_off'; // olho aberto
    }
}
function verSenhaConfirme(){
    const senhaConfirmeTxt = document.querySelector('input#confirmar-senha')
    const senhaConfirmeVer = document.querySelector('span#ver-senhaConfirme')


    if (senhaConfirmeTxt.type === 'password') {
        senhaConfirmeTxt.type = 'text';
        senhaConfirmeVer.textContent = 'visibility'; // olho fechado
    } else {
        senhaConfirmeTxt.type = 'password';
        senhaConfirmeVer.textContent = 'visibility_off'; // olho aberto
    }
}

function voltar(){
    window.location.href = "index.html"
}