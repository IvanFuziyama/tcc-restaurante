const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.firebasestorage.app",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};
        
        const db = firebase.firestore();

        // Função para contar os pedidos do dia
        async function contarPedidos() {
            const pedidosRef = db.collection('pedidos');
            const hoje = new Date();
            const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
            const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));

            const snapshot = await pedidosRef.where('data', '>=', inicioDoDia).where('data', '<=', fimDoDia).get();
            document.getElementById('pedidos-count').textContent = snapshot.size + ' pedidos hoje';
        }

        // Função para contar as mensagens de contato
        async function contarContatos() {
            const contatosRef = db.collection('contatos');
            const snapshot = await contatosRef.get();
            document.getElementById('contatos-count').textContent = snapshot.size + ' novas mensagens';
        }

        // Função para contar os pratos
        async function contarPratos() {
            const pratosRef = db.collection('pratos');
            const snapshot = await pratosRef.get();
            document.getElementById('pratos-count').textContent = snapshot.size + ' pratos no cardápio';
        }

        // Chama as funções para atualizar as contagens automaticamente
        document.addEventListener('DOMContentLoaded', () => {
            contarPedidos();
            contarContatos();
            contarPratos();
        });