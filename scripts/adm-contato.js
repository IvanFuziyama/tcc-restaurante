// Configurações Firebase e inicialização
const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.appspot.com",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};

const db = firebase.firestore();

// Função para carregar mensagens de contato
async function carregarMensagens() {
    const mensagensContainer = document.getElementById('mensagens-container');
    mensagensContainer.innerHTML = ''; // Limpa o conteúdo atual

    const mensagensSnapshot = await db.collection('mensagens').get();
    mensagensSnapshot.forEach(doc => {
        const dados = doc.data();
        
        const mensagemDiv = document.createElement('div');
        mensagemDiv.classList.add('mensagem');

        mensagemDiv.innerHTML = `
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>Email:</strong> ${dados.email}</p>
            <p><strong>Mensagem:</strong> ${dados.mensagem}</p>
            <textarea placeholder="Responder..."></textarea>
            <button class="enviar-resposta" data-id="${doc.id}">Enviar Resposta</button>
        `;
        
        mensagensContainer.appendChild(mensagemDiv);
    });
}

// Função para enviar a resposta
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('enviar-resposta')) {
        const docId = event.target.getAttribute('data-id');
        const resposta = event.target.previousElementSibling.value;

        if (resposta.trim()) {
            await db.collection('mensagens').doc(docId).update({ resposta });
            alert('Resposta enviada com sucesso!');
            carregarMensagens(); // Recarrega para mostrar a resposta
        } else {
            alert('Por favor, escreva uma resposta.');
        }
    }
});

// Carregar as mensagens ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarMensagens);
