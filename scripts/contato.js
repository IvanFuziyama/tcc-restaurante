// Função de envio do formulário
  //const form = document.getElementById('form-contato');
  //form.addEventListener('submit', async (event) => {
  //  event.preventDefault();
    const nodemailer = require('nodemailer')
  //  const nome = document.getElementById('nome').value;
  //  const email = document.getElementById('email').value;
  //  const mensagem = document.getElementById('msg').value;  // Corrigido para 'msg'
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
      to: 'rodastee21@gmail.com',
      subject: 'Sobre o feedback',
      html: '<h1>Olá</h1> <p>Agradeço pelo seu feedback</p>',
      text: `Olá, agradeço pelo seu feedback`,
    })
    .then(() => console.log ("E-mail enviado com sucesso"))
    .catch((error) => console.log(`Erro ao enviar o email`, error))
 // });
  