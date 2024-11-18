const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

// Ativando o CORS para permitir todas as origens
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ivanseiji21@gmail.com',
        pass: 'demh nuue clxc zvp'
    }
});

// Endpoint para enviar o e-mail
app.post('/enviar-resposta', (req, res) => {
    const { email, resposta } = req.body;

    const mailOptions = {
        from: 'seu-email@gmail.com',
        to: email,
        subject: 'Resposta do Atendimento',
        text: resposta
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar o e-mail:', error);
            res.status(500).send('Erro ao enviar o e-mail.');
        } else {
            console.log('E-mail enviado:', info.response);
            res.status(200).send('E-mail enviado com sucesso!');
        }
    });
    
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

