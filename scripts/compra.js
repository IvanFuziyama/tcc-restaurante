const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.appspot.com",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Função que verifica o status de login
function verificarLogin() {
    const user = auth.currentUser;

    // Se o usuário estiver logado, exibe os pedidos
    if (user) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('pedidos-container').style.display = 'block';
        carregarPedidos(user.uid);
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('pedidos-container').style.display = 'none';
    }
}

// Função para carregar os pedidos do usuário logado
function carregarPedidos(userId) {
    // Aqui você pode pegar os pedidos do Firebase Firestore, por exemplo
    // Exemplo simples: uma lista de pedidos fictícios
    const pedidos = [
        { produto: "Yakisoba Vegetariano", quantidade: 1, preco: 45.42 },
        { produto: "Frango Teriyaki", quantidade: 2, preco: 50.90 }
    ];

    let listaPedidosHTML = '';
    pedidos.forEach(pedido => {
        listaPedidosHTML += `
            <div class="pedido">
                <p>${pedido.produto} x${pedido.quantidade} - R$${pedido.preco}</p>
            </div>
        `;
    });

    document.getElementById('pedidos-lista').innerHTML = listaPedidosHTML;
}

// Função que simula o login
function fazerLogin() {
    const email = prompt("Digite seu email:");
    const senha = prompt("Digite sua senha:");

    auth.signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            // Usuário logado com sucesso
            verificarLogin();
        })
        .catch((error) => {
            alert("Erro ao fazer login: " + error.message);
        });
}

// Função que confirma o pedido
function confirmarPedido() {
    alert("Pedido confirmado! Obrigado pela compra.");
}

// Verifica o login ao carregar a página
window.onload = verificarLogin;