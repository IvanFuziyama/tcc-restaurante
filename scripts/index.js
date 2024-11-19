
const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.appspot.com",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};
// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Função para abrir o menu de perfil ao clicar no ícone
function abrirPerfil() {
    const perfilMenu = document.getElementById("user-perfil");
    perfilMenu.style.display = (perfilMenu.style.display === "block") ? "none" : "block";
}

// Função para abrir o modal de perfil
function abrirModalPerfil() {
    const modal = document.getElementById("modal-perfil");
    modal.style.display = "block";
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById("modal-perfil");
    modal.style.display = "none";
}

// Função para exibir as informações do usuário no modal
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("nome").value = user.displayName || "";
        document.getElementById("email").value = user.email || "";
    }
});

// Função para habilitar edição nos campos de nome e email
function habilitarEdicao(campo) {
    const input = document.getElementById(campo);
    input.disabled = false;
    input.style.backgroundColor = "#272727";
    input.focus();
}

// Função para enviar email de redefinição de senha
function redefinirSenha() {
    const user = auth.currentUser;
    if (user) {
        auth.sendPasswordResetEmail(user.email)
            .then(() => {
                alert("Email para redefinição de senha enviado!");
            })
            .catch((error) => {
                console.error("Erro ao enviar email de redefinição de senha:", error);
                alert(`Erro: ${error.message}`);
            });
    } else {
        alert("Nenhum usuário logado!");
    }
}

// Função para salvar alterações no perfil
document.getElementById("form-perfil").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !email) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const user = auth.currentUser;

    if (user) {
        try {
            // Atualizar nome no Firebase Authentication
            if (nome !== user.displayName) {
                await user.updateProfile({ displayName: nome });
                console.log("Nome atualizado no Firebase Authentication.");
            }

            // Verificar se o email foi alterado
            if (email && email !== user.email) {
                alert(
                    "Para alterar seu email, precisamos verificar o novo endereço. Um email de verificação será enviado."
                );

                // Enviar email de verificação para o novo endereço
                await user.verifyBeforeUpdateEmail(email);

                alert(
                    "Email de verificação enviado para o novo endereço. Verifique sua caixa de entrada para confirmar."
                );
                return; // Aguarda a confirmação para completar o processo
            }

            // Atualizar dados no Firestore (somente se o email já foi verificado)
            const userDocRef = db.collection("usuarios").doc(user.uid);

            await userDocRef.update({
                nome: nome,
                email: email, // Opcional, mas útil se o email foi alterado
            });
            console.log("Nome e email atualizados no Firestore.");

            alert("Perfil atualizado com sucesso!");
            fecharModal();
        } catch (error) {
            console.error("Erro ao atualizar o perfil:", error);
            alert(`Erro ao atualizar perfil: ${error.message}`);
        }
    } else {
        alert("Nenhum usuário logado.");
    }
});


// Função para sair da conta
function sair() {
    auth.signOut()
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

        // Sincronizar dados do Authentication com o Firestore
        const userDocRef = db.collection("usuarios").doc(user.uid);
        userDocRef.set({
            nome: user.displayName,
            email: user.email
        }, { merge: true })
            .then(() => {
                console.log("Dados sincronizados no Firestore.");
            })
            .catch((error) => {
                console.error("Erro ao sincronizar com o Firestore:", error);
            });
    } else {
        // não logado
        loginUsu.style.display = "inline-block";
        cadastroUsu.style.display = "inline-block";
        userIcon.style.display = "none";
        userPerfil.style.display = "none"; // Garante que o menu do usuário está oculto
    }
});

