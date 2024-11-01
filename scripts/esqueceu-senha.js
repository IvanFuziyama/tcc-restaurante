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


function esqueceu() {
    const email = document.querySelector('#email').value;
    
    if (!email) {
        alert("Por favor, insira seu email para redefinir a senha.");
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('Email de redefinição de senha enviado com sucesso!');
        })
        .catch((error) => {
            console.error("Erro ao enviar email:", error.message);
            alert("Erro ao enviar email de redefinição de senha. Verifique o email e tente novamente.");
        });
}

function voltar(){
    window.location.href = "login-usuario.html"
}