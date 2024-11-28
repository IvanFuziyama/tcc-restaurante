
  
  // Função de envio do formulário
  auth.onAuthStateChanged((user) => {
    if (user) {
      const nomeInput = document.getElementById('nome-contato');
        const emailInput = document.getElementById('email-contato');

        nomeInput.value = user.displayName || ''; // Nome do usuário
        emailInput.value = user.email || ''; // E-mail do usuário

        // Desabilita os campos
        nomeInput.disabled = true;
        emailInput.disabled = true;
        nomeInput.style.backgroundColor = "#e2e2e2";
        emailInput.style.backgroundColor = "#e2e2e2"

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
  }else{
    const form = document.getElementById('form-contato');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const nome = document.getElementById('nome-contato').value;
    const email = document.getElementById('email-contato').value;
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
  }
});