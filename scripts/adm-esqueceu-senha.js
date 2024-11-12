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

const adminEmail = "ivanseiji21@gmail.com";

function esqueceu() {
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem");

    if (!email) {
        mensagem.textContent = ("Por favor, insira o email do administrador.");
        mensagem.style.color = "red"
        return;
    }

    if (email !== adminEmail) {
        mensagem.textContent = ("Esse email não está autorizado para redefinição de senha.");
        mensagem.style.color = "red"
        return;
    }

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            mensagem.textContent = ("Um email de redefinição de senha foi enviado");
            mensagem.style.color = "green"
        })
        .catch((error) => {
            console.error("Erro ao enviar email de redefinição:", error);
            mensagem.textContent = ("Não foi possível enviar o email de redefinição. Verifique o email e tente novamente.");
            mensagem.style.color = "red"
        });
}


function voltar(){
    window.location.href = "login-adm.html"
}