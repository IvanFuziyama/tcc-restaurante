
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
// Função para enviar a resposta do administrador para o e-mail do usuário
async function enviarResposta(email, resposta) {
    try {
        const response = await fetch('http://localhost:3000/enviar-resposta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, resposta })
        });

        if (response.ok) {
            alert('Resposta enviada com sucesso!');
        } else {
            alert('Erro ao enviar a resposta.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar a resposta.');
    }
}


// Chama a função para listar os contatos quando a página carregar
listarContatos();

