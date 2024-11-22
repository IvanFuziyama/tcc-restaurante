
// Função para exibir o carrinho
export function exibirCarrinho() {
    const carrinhoContainer = document.getElementById("carrinho-itens");
    carrinhoContainer.innerHTML = ""; // Limpa os itens do carrinho antes de exibir
    
    let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    // carrinho.forEach(item => {
    //     item.nome = JSON.stringify(item.nome);
    // });

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        carrinho.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item-carrinho");
            itemDiv.innerHTML = `
                <p>${item.nome} - Quantidade: ${item.quantidade}</p>
                <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
            `;
            carrinhoContainer.appendChild(itemDiv);
        });
    }
}