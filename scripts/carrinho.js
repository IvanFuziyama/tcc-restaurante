export function exibirCarrinho() {
    const carrinhoContainer = document.getElementById("carrinho-itens");
    carrinhoContainer.innerHTML = ""; // Limpa os itens do carrinho antes de exibir
    
    let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        carrinho.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item-carrinho");
            itemDiv.innerHTML = 
                `<p>${item.nome}</p>
                 <p>R$ ${(item.preco || 0).toFixed(2)}</p>`; // Garante que item.preco não seja undefined
            
            let totalItem = item.preco || 0; // Inicia com o valor do prato

            // Mostrar opções adicionais, se existirem
            if (item.opcoes && Object.keys(item.opcoes).length > 0) {
                const opcoesList = document.createElement("ul");
                for (const [nomeOpcao, descricao] of Object.entries(item.opcoes)) {
                    const quantidade = descricao.quantidade || 1; // Quantidade de cada complemento
                    const valorOpcao = descricao.valor || 0; // Valor da opção (por exemplo, R$ 10,00)

                    // Soma o valor total das opções ao total do prato
                    totalItem += valorOpcao * quantidade;

                    const li = document.createElement("li");
                    // Exibe o nome da opção e o valor com a quantidade
                    li.textContent = `${nomeOpcao} - R$ ${(valorOpcao).toFixed(2)}: Quantidade: ${quantidade}`;
                    opcoesList.appendChild(li);
                }
                itemDiv.appendChild(opcoesList);
            }

            // Exibe o total do item no carrinho
            itemDiv.innerHTML += `<p><strong>Total: R$ ${(totalItem).toFixed(2)}</strong></p>`;

            carrinhoContainer.appendChild(itemDiv);
        });
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