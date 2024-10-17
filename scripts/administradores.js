// administradores.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getAuth, updatePassword, deleteUser } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função para carregar todos os administradores
export function loadAdmins() {
    fetch('http://localhost:3000/listUsers') // Chama o endpoint para listar usuários
        .then(response => response.json())
        .then(userRecords => {
            const adminList = document.getElementById('adminList');
            userRecords.forEach(user => {
                const row = document.createElement('tr');
                const emailCell = document.createElement('td');
                emailCell.innerText = user.email;

                const actionCell = document.createElement('td');
                const changePasswordButton = document.createElement('button');
                changePasswordButton.innerText = 'Alterar Senha';
                changePasswordButton.onclick = () => changePassword(user.uid);
                
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Remover';
                deleteButton.onclick = () => deleteAdmin(user.uid);

                actionCell.appendChild(changePasswordButton);
                actionCell.appendChild(deleteButton);
                row.appendChild(emailCell);
                row.appendChild(actionCell);
                adminList.appendChild(row);
            });
        }).catch(error => {
            console.error("Error fetching users:", error);
        });
}

// Função para alterar a senha
function changePassword(uid) {
    const newPassword = prompt("Digite a nova senha:");
    if (newPassword) {
        const user = auth.currentUser; // Obtém o usuário atual
        updatePassword(user, newPassword).then(() => {
            alert('Senha alterada com sucesso!');
        }).catch((error) => {
            console.error("Error updating password:", error);
        });
    }
}

// Função para remover um administrador
function deleteAdmin(uid) {
    const user = auth.currentUser; // Obtém o usuário atual
    deleteUser(user).then(() => {
        alert('Administrador removido com sucesso!');
        loadAdmins(); // Atualiza a lista após a remoção
    }).catch((error) => {
        console.error("Error removing user:", error);
    });
}

// Chama a função para carregar administradores ao iniciar
document.addEventListener('DOMContentLoaded', loadAdmins);



