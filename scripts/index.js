
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

// Função para abrir o menu de perfil ao clicar no ícone
function abrirPerfil() {
    const perfilMenu = document.getElementById("user-perfil");
    // Toggle para mostrar/esconder o menu de opções
    perfilMenu.style.display = (perfilMenu.style.display === "block") ? "none" : "block";
}

// Função para abrir o modal de perfil
function abrirModalPerfil() {
    const modal = document.getElementById("modal-perfil");
    modal.style.display = "block";

    // Preencher os campos do modal com os dados do usuário atual
    const user = firebase.auth().currentUser;
    if (user) {
        document.getElementById("nome-perfil").value = user.displayName || "";
        document.getElementById("email-perfil").value = user.email || "";
    }
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById("modal-perfil");
    modal.style.display = "none";
}

// Função para salvar as alterações no perfil
document.getElementById("form-perfil").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome-perfil").value;
    const email = document.getElementById("email-perfil").value;
    const senha = document.getElementById("senha-perfil").value;

    if (!nome || !email) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const user = firebase.auth().currentUser;

    if (user) {
        try {
            if (nome) await user.updateProfile({ displayName: nome });
            if (email && email !== user.email) await user.updateEmail(email);
            if (senha) await user.updatePassword(senha);

            alert("Informações atualizadas com sucesso!");
            fecharModal();
        } catch (error) {
            console.error("Erro ao atualizar o perfil:", error.message);
            alert(`Erro: ${error.message}`);
        }
    } else {
        alert("Nenhum usuário logado. Faça login para atualizar o perfil.");
    }
});

// Função para sair da conta
function sair() {
    firebase.auth().signOut()
        .then(() => {
            alert("Você saiu com sucesso!");
            location.reload();
        })
        .catch((error) => {
            console.error("Erro ao sair:", error.message);
            alert("Erro ao sair. Tente novamente.");
        });
}

// Verificar estado de autenticação
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