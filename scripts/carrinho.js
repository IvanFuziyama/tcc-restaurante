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
                    opcaoItem.textContent = `${descricao}: ${quantidade} quantidades`;
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

