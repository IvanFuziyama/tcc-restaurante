export function exibirCarrinho() {
    const carrinhoContainer = document.getElementById("carrinho-itens");
    carrinhoContainer.innerHTML = ""; // Limpa os itens do carrinho antes de exibir

    let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
        // Limpa o valor total
        document.getElementById("carrinho-total").textContent = "Total: R$ 0.00";
    } else {
        let valorTotal = 0; // Inicializa o valor total

        carrinho.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item-carrinho");
            const precoFormatado = item.preco.toFixed(2); // Formata o preço com 2 casas decimais

            // Adiciona o preço do item ao valor total
            valorTotal += item.preco;

            // Cria o HTML básico do item
            itemDiv.innerHTML = `
                <p><strong>${item.nome}</strong></p>
                <p>R$ ${precoFormatado}</p>
            `;

            // Verifica e adiciona as opções adicionais, se existirem
            if (item.opcoes && Object.keys(item.opcoes).length > 0) {
                const opcoesList = document.createElement("ul");
                opcoesList.classList.add("opcoes-adicionais");

                for (const [descricao, quantidade] of Object.entries(item.opcoes)) {
                    const opcaoItem = document.createElement("li");

                    // Mostra a descrição e a quantidade com o texto "quantidades"
                    opcaoItem.textContent = `${descricao}: ${quantidade}x`;
                    opcoesList.appendChild(opcaoItem);
                }

                itemDiv.appendChild(opcoesList);
            }

            carrinhoContainer.appendChild(itemDiv);
        });

        // Atualiza o valor total no modal
        document.getElementById("carrinho-total").textContent = `Total: R$ ${valorTotal.toFixed(2)}`;
    }
}


// Mostrar/ocultar o carrinho ao clicar no ícone do carrinho
document.getElementById("carrinho").addEventListener("click", () => {
    const modalCarrinho = document.getElementById("modal-carrinho");
    modalCarrinho.style.display = modalCarrinho.style.display === "flex" ? "none" : "flex";
});

// Fechar o modal do carrinho
document.getElementById("fechar-modal-carrinho").addEventListener("click", () => {
    document.getElementById("modal-carrinho").style.display = "none";
});

// Manipula a exibição do modal de confirmação
document.getElementById("finalizar-compra").addEventListener("click", () => {
    const modalConfirmacao = document.getElementById("modal-confirmacao");
    const carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    const resumoPedido = document.getElementById("resumo-pedido");

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Gera o resumo do pedido
    let resumo = "<strong>Resumo do Pedido:</strong><ul>";
    carrinho.forEach(item => {
        resumo += `<li>${item.nome} - R$ ${item.preco.toFixed(2)}`;
        if (item.opcoes) {
            resumo += `<ul>`;
            for (const [descricao, quantidade] of Object.entries(item.opcoes)) {
                resumo += `<li>${descricao}: ${quantidade}x</li>`;
            }
            resumo += `</ul>`;
        }
        resumo += `</li>`;
    });
    resumo += `</ul>`;
    resumo += `<p><strong>Total:</strong> R$ ${calcularTotalCarrinho().toFixed(2)}</p>`;

    resumoPedido.innerHTML = resumo;

    modalConfirmacao.style.display = "flex"; // Mostra o modal de confirmação
});

// Fecha o modal de confirmação
document.getElementById("fechar-modal-confirmacao").addEventListener("click", () => {
    document.getElementById("modal-confirmacao").style.display = "none";
});

// Cancela o pedido
document.getElementById("cancelar-pedido").addEventListener("click", () => {
    document.getElementById("modal-confirmacao").style.display = "none";
});

// Confirma o pedido e envia pelo WhatsApp
document.getElementById("confirmar-pedido").addEventListener("click", () => {
    const carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    const total = calcularTotalCarrinho();

    let mensagem = "Olá, gostaria de fazer o seguinte pedido:%0A";
    carrinho.forEach(item => {
        mensagem += `- ${item.nome}: R$ ${item.preco.toFixed(2)}%0A`;
        if (item.opcoes) {
            for (const [descricao, quantidade] of Object.entries(item.opcoes)) {
                mensagem += `  ${descricao}: ${quantidade}x%0A`;
            }
        }
    });
    mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

    // Substitua pelo número de WhatsApp do restaurante
    const numeroWhatsapp = "5511985527064";
    const url = `https://wa.me/${numeroWhatsapp}?text=${mensagem}`;

    window.open(url, "_blank"); // Abre o WhatsApp em uma nova aba

    // Limpa o carrinho após o envio
    sessionStorage.removeItem("carrinho");
    document.getElementById("modal-confirmacao").style.display = "none";
    exibirCarrinho(); // Atualiza o carrinho
});

// Calcula o total do carrinho
function calcularTotalCarrinho() {
    const carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    return carrinho.reduce((total, item) => total + item.preco, 0);
}

