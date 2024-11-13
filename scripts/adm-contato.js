import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.firebasestorage.app",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};

// Firebase já configurado no seu projeto
const db = firebase.firestore();
const contatosContainer = document.getElementById('contatos-container');

// Função para buscar os contatos do Firestore
async function listarContatos() {
    const contatosSnapshot = await db.collection('contatos').orderBy('timestamp', 'desc').get();
    
    contatosSnapshot.forEach((doc) => {
        const contatoData = doc.data();
        const contatoDiv = document.createElement('div');
        contatoDiv.classList.add('contato');
        
        contatoDiv.innerHTML = `
            <p><strong>Nome:</strong> ${contatoData.nome}</p>
            <p><strong>E-mail:</strong> ${contatoData.email}</p>
            <p><strong>Mensagem:</strong> ${contatoData.mensagem}</p>
            <button onclick="responderMensagem('${doc.id}')">Responder</button>
        `;
        
        contatosContainer.appendChild(contatoDiv);
    });
}

// Função para mostrar o formulário de resposta
function responderMensagem(contatoId) {
    const respostaForm = document.getElementById('resposta-form');
    respostaForm.style.display = 'block';  // Exibe o formulário de resposta
    
    // Configura o campo para enviar a resposta ao contato
    respostaForm.onsubmit = (event) => {
        event.preventDefault();
        const resposta = document.getElementById('resposta').value;
        enviarResposta(contatoId, resposta);
    };
}

// Função para enviar a resposta ao Firestore
async function enviarResposta(contatoId, resposta) {
    try {
        // Adiciona a resposta ao Firestore
        await db.collection('respostas').add({
            contatoId: contatoId,
            resposta: resposta,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        alert('Resposta enviada com sucesso!');
        
        // Oculta o formulário de resposta e limpa o campo
        document.getElementById('resposta').value = '';
        document.getElementById('resposta-form').style.display = 'none';
    } catch (error) {
        console.error("Erro ao enviar resposta: ", error);
        alert('Erro ao enviar a resposta. Tente novamente.');
    }
}

// Chama a função para listar os contatos quando a página carregar
listarContatos();
