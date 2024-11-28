const db = firebase.firestore();
const contatosContainer = document.getElementById('contatos-container');

// Função para buscar os contatos do Firestore
async function listarContatos() {
    const contatosContainer = document.getElementById('contatos-container');
    contatosContainer.innerHTML = ''; // Limpa o container antes de adicionar novos contatos

    const contatosSnapshot = await db.collection('contatos').orderBy('timestamp', 'desc').get();
    
    contatosSnapshot.forEach((doc) => {
        const contatoData = doc.data();
        const contatoDiv = document.createElement('div');
        contatoDiv.classList.add('contato');
        
        // Formatar a data
        const data = contatoData.timestamp ? contatoData.timestamp.toDate().toLocaleString() : 'Data não disponível';

        contatoDiv.innerHTML = `
            <p><strong>Nome:</strong> ${contatoData.nome}</p>
            <p><strong>E-mail:</strong> ${contatoData.email}</p>
            <p><strong>Data:</strong> ${data}</p>
            <p id="mensagem"><strong>Mensagem:</strong> ${contatoData.mensagem}</p>
            <textarea id="resposta-${doc.id}" placeholder="Escreva a resposta aqui"></textarea>
            <button class="but-enviar-resposta" onclick="enviarResposta('${doc.id}')">Enviar Resposta</button>
            <button class ="but-excluir-resposta" onclick="excluirContato('${doc.id}')">Excluir</button>
        `;
        
        contatosContainer.appendChild(contatoDiv);
    });
}

// Função para excluir o contato
async function excluirContato(id) {
    try {
        await db.collection('contatos').doc(id).delete(); // Exclui o documento do Firestore
        alert("Contato excluído com sucesso!");
        listarContatos(); // Atualiza a lista de contatos
    } catch (error) {
        console.error("Erro ao excluir contato: ", error);
        alert("Erro ao excluir contato.");
    }
}


// Função para enviar a resposta do administrador para o e-mail do usuário
// Função de envio do formulário
  document.getElementById("enviar-resposta").onclick = function(){
  const nodemailer = require('nodemailer')
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const resposta = document.getElementById('resposta').value;  // Corrigido para 'msg'
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
      user: 'ivanseiji21@gmail.com',
      pass: 'pzxprlcwjrqfrzbi',
    }
  })

  transport.sendMail({
    from: 'ivan <ivanseiji21@gmail.com>',
    name: nome,
    to: email,
    subject: 'Sobre o feedback',
    html: '<h1>Olá </h1> <p>Agradeço pelo seu feedback</p>',
    text: resposta,
  })
  .then(() => console.log ("E-mail enviado com sucesso"))
  .catch((error) => console.log("Erro ao enviar o email", error))
  }
// Chama a função para listar os contatos quando a página carregar
listarContatos();



