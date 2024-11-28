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
const auth = firebase.auth();

function formatarData(data) {
    const dataObj = data.toDate();
    return dataObj.toLocaleString();
}

auth.onAuthStateChanged(user => {
    if (user) {
        // O usuário está logado, agora você pode pegar o nome
        carregarPedidos(user); // Passa o objeto completo do usuário para a função
    } else {
        console.log("Nenhum usuário logado.");
    }
});

// Função para buscar os pedidos no Firestore e renderizar na tela
async function carregarPedidos() {
    const pedidosContainer = document.getElementById("pedido-lista");

    if (!pedidosContainer) {
        console.error("Elemento com ID 'pedido-lista' não encontrado.");
        return;
    }

    pedidosContainer.innerHTML = ''; // Limpa o container de pedidos

    try {
        // Busca os pedidos no Firestore
        const pedidosSnapshot = await db.collection('pedidos').orderBy('data', 'desc').get();
        console.log(`Total de pedidos encontrados: ${pedidosSnapshot.size}`);

        if (pedidosSnapshot.empty) {
            pedidosContainer.innerHTML = "<p>Nenhum pedido encontrado.</p>";
            return;
        }

        // Cria um conjunto com os IDs dos usuários encontrados nos pedidos
        const usuarioIds = new Set();
        pedidosSnapshot.forEach((doc) => {
            const pedidoData = doc.data();
            if (pedidoData.usuarioId) {
                usuarioIds.add(pedidoData.usuarioId);
            }
        });

        // Busca todos os documentos dos usuários cujos IDs estão no conjunto
        const usuariosSnapshot = await db.collection('usuarios').where(
            firebase.firestore.FieldPath.documentId(),
            'in',
            Array.from(usuarioIds)
        ).get();

        // Cria um mapa de ID para nome de usuário
        const usuarioMap = {};
        usuariosSnapshot.forEach((doc) => {
            usuarioMap[doc.id] = doc.data().nome || "Usuário não registrado";
        });

        // Itera pelos pedidos novamente para renderizá-los com o nome do cliente
        pedidosSnapshot.forEach((doc) => {
            const pedidoData = doc.data();
            const nomeUsuario = usuarioMap[pedidoData.usuarioId] || "Usuário desconhecido";

            const pedidoDiv = document.createElement('div');
            pedidoDiv.classList.add('pedido');

            // Renderiza os itens do pedido
            const itensHtml = pedidoData.itens
                .map((item) => {
                    const opcoesHtml = item.opcoes
                        ? Object.entries(item.opcoes)
                              .map(([descricao, quantidade]) => `<li>${descricao}: ${quantidade}x</li>`)
                              .join('')
                        : '';
                    return `<li>${item.nome} - R$ ${item.preco.toFixed(2)}${opcoesHtml ? `<ul>${opcoesHtml}</ul>` : ''}</li>`;
                })
                .join('');

            pedidoDiv.innerHTML = `
                <p><strong>Cliente:</strong> ${nomeUsuario}</p>
                <p>${formatarData(pedidoData.data)}</p>
                <p><strong>Itens:</strong></p>
                <ul>${itensHtml}</ul>
                <p><strong>Status:</strong> ${pedidoData.status}</p>
                <p><strong>Total:</strong> R$ ${pedidoData.total.toFixed(2)}</p>
            `;

            pedidosContainer.appendChild(pedidoDiv);
        });
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
    }
}


// Função para atualizar o status de um pedido
async function atualizarStatusPedido(id, novoStatus) {
    try {
        await db.collection('pedidos').doc(id).update({ status: novoStatus });
        alert('Status do pedido atualizado com sucesso!');
        carregarPedidos(); // Atualiza a lista de pedidos
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        alert('Erro ao atualizar status do pedido.');
    }
}
