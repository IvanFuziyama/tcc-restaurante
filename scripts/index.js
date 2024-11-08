// Inicializar Firebase (importante configurar isso conforme seu firebaseConfig)
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

// Listener para verificar o estado de autenticação
// Verifica o estado de autenticação do Firebase
auth.onAuthStateChanged((user) => {
    const loginUsu = document.getElementById("login-usu");
    const cadastroUsu = document.getElementById("cadastro-usu");
    const userIcon = document.getElementById("user-ativo");
    const userPerfil = document.getElementById("user-perfil"); 
    const emailUsuario = document.getElementById("email-usuario");

    if (user) {
        // Usuário está logado
        loginUsu.style.display = "none";
        cadastroUsu.style.display = "none";
        userIcon.style.display = "inline-block";
        if (emailUsuario) {
            emailUsuario.textContent = user.email; // Exibe o email como texto, não como link
        }
    } else {
        // não logado
        loginUsu.style.display = "inline-block";
        cadastroUsu.style.display = "inline-block";
        userIcon.style.display = "none";
        userPerfil.style.display = "none"; // Garante que o menu do usuário está oculto
    }
});
function abrirPerfil() {
    const menu = document.getElementById("user-perfil");
    menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
}
function sair() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../paginas/index.html";
    }).catch((error) => {
        console.error("Erro ao fazer logout:", error);
    });
}