
// Inicializa o Firebase
const db = firebase.firestore();
const contatosContainer = document.getElementById('contatos-container');

// Função para buscar os contatos do Firestore e exibi-los na página
async function listarContatos() {
    try {
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
    } catch (error) {
        console.error("Erro ao listar contatos: ", error);
    }
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

