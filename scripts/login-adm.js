// Configuração do Firebase (substitua pelas suas próprias credenciais)
const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.appspot.com",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Email autorizado para o login
const emailAutorizado = "ivanseiji21@gmail.com";

// Função para realizar o login
function entrar() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const msgErro = document.querySelector(".msg-erro");

     // Define a persistência da sessão para que não interfira em outros usuários
     auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
     .then(() => {
         return auth.signInWithEmailAndPassword(email, senha);
     })
     .then((userCredential) => {
         const user = userCredential.user;

         // Verifica se o email do usuário logado corresponde ao autorizado
         if (user.email === emailAutorizado) {
             // Redireciona para a página do administrador se o email for autorizado
             window.location.href = "../paginas-adm/adm.html";
         } else {
             // Desloga o usuário se o email não for autorizado
             auth.signOut();
             msgErro.textContent = "Este usuário não tem permissão para acessar.";
         }
     })
     .catch((error) => {
         console.error("Erro ao fazer login:", error);
         msgErro.textContent = "Email ou senha incorretos.";
     });
}

// Função para redefinir senha
function esquecer() {
    const email = document.getElementById("email").value;
    const msgErro = document.querySelector(".msg-erro");

    if (!email) {
        msgErro.textContent = "Digite seu email para redefinir a senha.";
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("Email para redefinição de senha enviado!");
        })
        .catch((error) => {
            console.error("Erro ao enviar email de redefinição:", error);
            msgErro.textContent = "Erro ao enviar email de redefinição de senha.";
        });
}

function esquecer(){
    window.location.href = "adm-esqueceu-senha.html"
}

// Função para alternar visibilidade da senha
function verSenha() {
    const senhaInput = document.getElementById("senha");
    const iconeSenha = document.getElementById("ver-senha");

    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        iconeSenha.textContent = "visibility";
    } else {
        senhaInput.type = "password";
        iconeSenha.textContent = "visibility_off";
    }
}
