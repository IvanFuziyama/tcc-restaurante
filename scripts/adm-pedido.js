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

function formatarData(data) {
    const dataObj = data.toDate();
    return dataObj.toLocaleString();
  }
  
  // Função para buscar os pedidos no Firestore e renderizar na tela
  async function carregarPedidos() {
    const pedidosContainer = document.getElementById("pedido-lista");
    
    if (!pedidosContainer) {
        console.error("Elemento com ID 'pedido-lista' não encontrado.");
        return;
    }

    pedidosContainer.innerHTML = '';
  
    try {
        const pedidosSnapshot = await db.collection('pedidos').orderBy('data', 'desc').get(); // Use 'data' para a ordenação
  
        console.log(`Total de pedidos encontrados: ${pedidosSnapshot.size}`); // Log para verificar quantos pedidos foram encontrados

        if (pedidosSnapshot.empty) {
            pedidosContainer.innerHTML = "<p>Nenhum pedido encontrado.</p>";
            return;
        }

        pedidosSnapshot.forEach((doc) => {
            const pedidoData = doc.data();
            console.log(`Pedido ID: ${doc.id}`, pedidoData); // Log para verificar os dados do pedido

            const pedidoDiv = document.createElement('div');
            pedidoDiv.classList.add('pedido');

            // Renderiza os detalhes do pedido
            const itensHtml = pedidoData.itens
                .map((item) => {
                    const opcoesHtml = item.opcoes ? Object.entries(item.opcoes).map(([descricao, quantidade]) => `<li>${descricao}: ${quantidade}x</li>`).join('') : '';
                    return `<li>${item.nome} - R$ ${item.preco.toFixed(2)}${opcoesHtml ? `<ul>${opcoesHtml}</ul>` : ''}</li>`;
                })
                .join('');

            pedidoDiv.innerHTML = `
                <p><strong>ID do Pedido:</strong> ${doc.id}</p>
                <p><strong>Usuário:</strong> ${pedidoData.usuarioId || 'Anônimo'}</p>
                <p><strong>Data:</strong> ${formatarData(pedidoData.data)}</p>
                <p><strong>Status:</strong> ${pedidoData.status}</p>
                <p><strong>Itens:</strong></p>
                <ul>${itensHtml}</ul>
                <p><strong>Total:</strong> R$ ${pedidoData.total.toFixed(2)}</p>
                <button onclick="atualizarStatusPedido('${doc.id}', 'Finalizado')">Marcar como Finalizado</button>
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
  
  // Chama a função ao carregar a página
  document.addEventListener('DOMContentLoaded', carregarPedidos);