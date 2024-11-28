
  
  // Função de envio do formulário
  const form = document.getElementById('form-contato');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('msg').value;  // Corrigido para 'msg'
  
    try {
      await db.collection('contatos').add({
        nome: nome,
        email: email,
        mensagem: mensagem,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      alert('Mensagem enviada com sucesso!');
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar mensagem: ", error);
      alert('Erro ao enviar a mensagem. Tente novamente.');
    }
  });
  