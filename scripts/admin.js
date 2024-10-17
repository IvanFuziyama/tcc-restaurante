const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors'); // Importa o middleware CORS

const app = express();
const port = 3000; // ou outra porta que você desejar

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

// Usa o middleware CORS
app.use(cors()); // Permite que todas as origens acessem seus endpoints

// Endpoint para listar usuários
app.get('/listUsers', async (req, res) => {
    try {
        const userRecords = await admin.auth().listUsers();
        res.json(userRecords.users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
