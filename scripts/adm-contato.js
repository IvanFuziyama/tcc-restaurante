
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
            <p id="mensagem"><strong>Mensagem:</strong> ${contatoData.mensagem}</p>
            <textarea id="resposta-${doc.id}" placeholder="Escreva a resposta aqui"></textarea>
            <button onclick="enviarResposta('${doc.id}')">Enviar Resposta</button>
        `;
        
        contatosContainer.appendChild(contatoDiv);
    });
}

// Função para enviar a resposta ao Firestore
async function enviarResposta(contatoId) {
    const resposta = document.getElementById(`resposta-${contatoId}`).value;
    try {
        await db.collection('respostas').add({
            contatoId: contatoId,
            resposta: resposta,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        alert('Resposta enviada com sucesso!');
        document.getElementById(`resposta-${contatoId}`).value = ''; // Limpa o campo de resposta após enviar
    } catch (error) {
        console.error("Erro ao enviar resposta: ", error);
        alert('Erro ao enviar a resposta. Tente novamente.');
    }
}

// Chama a função para listar os contatos quando a página carregar
listarContatos();

