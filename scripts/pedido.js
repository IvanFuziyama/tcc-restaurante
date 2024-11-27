// Listener para verificar o estado de autenticação
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Usuário logado:", user.uid);
        carregarPedidos(user); // Passa o objeto completo do usuário para a função
    } else {
        console.log("Nenhum usuário logado.");
        const pedidosContainer = document.getElementById("pedido-lista");
        if (pedidosContainer) {
            pedidosContainer.innerHTML = "<p>Você precisa estar logado para ver seus pedidos.</p>";
        }
    }
});

// Função auxiliar para formatar opções
function formatarOpcoes(opcoes) {
    let opcoesHtml = "<ul>";
    for (const [descricao, quantidade] of Object.entries(opcoes)) {
        opcoesHtml += `<li>${descricao}: ${quantidade}x</li>`;
    }
    opcoesHtml += "</ul>";
    return opcoesHtml;
}

// Função para carregar os pedidos
async function carregarPedidos(user) { // Agora user é um argumento passado para a função
    console.log("Usuario ID:", user.uid);

    const pedidosContainer = document.getElementById("pedido-lista");

    if (!pedidosContainer) {
        console.error("Elemento com ID 'pedido-lista' não encontrado.");
        return;
    }

    pedidosContainer.innerHTML = "";

    // Busca os pedidos do Firestore
    const snapshot = await db.collection('pedidos').where("usuarioId", "==", user.uid).get();
    console.log("Total de pedidos encontrados:", snapshot.size);

    if (snapshot.empty) {
        pedidosContainer.innerHTML = "<p>Nenhum pedido encontrado.</p>";
        return;
    }

    snapshot.forEach(doc => {
        const pedido = doc.data();
        const pedidoCard = document.createElement("div");
        pedidoCard.classList.add("pedido-card");
       
        // Formata a data e hora
        const dataHora = pedido.data.toDate();
        const dataFormatada = dataHora.toLocaleDateString();
        const horaFormatada = dataHora.toLocaleTimeString();
       
        // Verifica se há itens e cria a lista
        let itensHtml = "";
        if (pedido.itens && Array.isArray(pedido.itens)) {
            pedido.itens.forEach(item => {
                console.log("Item:", item); // Verifica os dados do item
        
                // Monta o HTML para cada item
                itensHtml += `<li>
                    ${item.nome || "Sem nome"} - R$ ${item.preco ? item.preco.toFixed(2) : "0.00"}
                    ${item.opcoes ? formatarOpcoes(item.opcoes) : ""}
                <br></li>`;
            });
        } else {
            itensHtml = "<li>Sem itens</li>";
        }
        
        
    
        // Define o nome do usuário
        const nomeUsuario = user.displayName || "usuário"; // Garante que "user" está acessível neste escopo
       
        // Define o conteúdo do cartão
        pedidoCard.innerHTML = `
            <div class = "pedido-modal">
            <h3>Pedido de ${nomeUsuario}</h3>
            <p class="status-pedido">Status: ${pedido.status}</p>
            <p>Data: ${dataFormatada} às ${horaFormatada}</p>
            <p><strong>Itens:</strong></p>
            <ul>${itensHtml}</ul>
            <p>Total: R$ ${pedido.total.toFixed(2)}</p>
            </div>
        `;
        pedidosContainer.appendChild(pedidoCard);
    });
}    