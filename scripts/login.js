const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.appspot.com",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function entrar() {
    const email = document.querySelector('input#email').value
    const senha = document.querySelector('input#senha').value
    const msgErro = document.querySelector('p.msg-erro')
    msgErro.innerHTML = ''

    if (!email || !senha) {
        msgErro.innerHTML = "Por favor, preencha o email e a senha!";
        return; 
    }

    auth.signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            localStorage.setItem('userEmail', userCredential.user.email);
            window.location.href = "adm.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            // Log para verificar qual é o código de erro real
            console.log("Código do erro:", errorCode);
            console.log("Mensagem do erro:", errorMessage);

            msgErro.innerHTML = "Erro ao fazer login. Tente novamente.";
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
