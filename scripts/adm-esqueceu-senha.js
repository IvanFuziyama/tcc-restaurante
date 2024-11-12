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

    if (!email) {
        alert("Por favor, insira o email do administrador.");
        return;
    }

    // Verifica se o email digitado corresponde ao email autorizado
    if (email !== adminEmail) {
        alert("Esse email não está autorizado para redefinição de senha.");
        return;
    }

    // Envia o email de redefinição caso o email seja autorizado
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Um email de redefinição de senha foi enviado para " + email);
        })
        .catch((error) => {
            console.error("Erro ao enviar email de redefinição:", error);
            alert("Não foi possível enviar o email de redefinição. Verifique o email e tente novamente.");
        });
}


function voltar(){
    window.location.href = "login-adm.html"
}