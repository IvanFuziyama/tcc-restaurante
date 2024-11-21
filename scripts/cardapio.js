// Inicializa o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.appspot.com",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

let carrinho = [];

let categoriasMap = {}; // Defina categoriasMap no escopo global

// Função para carregar categorias do Firestore
async function carregarCategorias() {
    const categoriasRef = collection(db, "categorias");
    const categoriasSelect = document.getElementById("categoria");

    try {
        const categoriaSnapshot = await getDocs(categoriasRef);
        categoriasSelect.innerHTML = ''; // Limpa as opções existentes

        // Adiciona uma opção vazia ao select
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Selecione uma Categoria';
        categoriasSelect.appendChild(optionDefault);

        categoriaSnapshot.forEach(doc => {
            const data = doc.data();
            categoriasMap[data.nome] = doc.id; // Mapeia o nome da categoria para seu ID
            const option = document.createElement('option');
            option.value = doc.id; // Armazena o ID do documento
            option.textContent = data.nome; // Exibe o nome da categoria

            categoriasSelect.appendChild(option);
        });

        console.log("Categorias carregadas:", categoriaSnapshot.docs.map(doc => doc.data()));
    } catch (error) {
        console.error("Erro ao carregar categorias: ", error);
    }
}

// Carregar categorias ao carregar a página
document.addEventListener('DOMContentLoaded', carregarCategorias);

// Adiciona um evento ao select de categoria
document.getElementById("categoria").addEventListener("change", async (event) => {
    const categoriaSelecionada = event.target.options[event.target.selectedIndex].text; // Obtenha o texto da opção selecionada
    const categoriaID = categoriasMap[categoriaSelecionada]; // Obtém o ID da categoria selecionada
    console.log(`Categoria selecionada: ${categoriaSelecionada}, ID: ${categoriaID}`); // Mostra o ID
    await carregarPratos(categoriaID); // Carrega pratos com base no ID da categoria selecionada
});

// Função para carregar pratos do Firestore
async function carregarPratos(categoria = "") {
    const pratosRef = collection(db, "pratos");
    let pratosSnapshot;

    try {
        if (categoria) {
            console.log(`Carregando pratos da categoria: ${categoria}`);
            pratosSnapshot = await getDocs(query(pratosRef, where("categoria", "==", categoria)));
        } else {
            console.log("Carregando todos os pratos");
            pratosSnapshot = await getDocs(pratosRef);
        }

        const pratosList = pratosSnapshot.docs.map(doc => doc.data());
        console.log("Dados dos pratos encontrados:", pratosList);

        // Log para verificar quantos pratos foram encontrados
        console.log(`Pratos encontrados: ${pratosList.length}`);

        // Seleciona o container onde os pratos serão exibidos
        const pratosContainer = document.getElementById("pratos-container");
        pratosContainer.innerHTML = ""; // Limpa o conteúdo atual

        pratosList.forEach(prato => {
            const pratoDiv = document.createElement("div");
            pratoDiv.classList.add("prato");

            // Criação do conteúdo do prato
            pratoDiv.innerHTML = `
                <img src="${prato.imagem}" alt="${prato.nome}" class="prato-imagem">
                <div class="info-cardapio">
                    <h3>${prato.nome}</h3>
                    <p>${prato.descricao}</p>
                    <button class="mais-informacoes" onclick="mostrarModal('${prato.nome}', '${prato.descricao}', ${prato.valor}, '${prato.imagem}')">Mais informações</button>
                    <p><strong>R$ ${prato.valor}</strong></p>
                    <div class="input-container-prato   ">
                        <label for="quantidade-${prato.nome}">Quantidade:</label>
                        <input type="number" value="1" min="1" id="quantidade-${prato.nome}" class="quantidade">
                        <button onclick="adicionarAoCarrinho('${prato.nome}', ${prato.valor}, '${prato.imagem}', document.getElementById('quantidade-${prato .nome}').value)">Adicionar ao Carrinho</button>
                    </div>
                </div>
            `;

            // Ao clicar no prato, mostrar o modal
            pratoDiv.querySelector('button').addEventListener('click', () => {
                mostrarModal(prato.nome, prato.descricao, prato.valor, prato.imagem);
            });

            // Adiciona o prato ao container
            pratosContainer.appendChild(pratoDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar pratos: ", error);
    }
}

// Carregar pratos ao iniciar
carregarPratos();



// Função para adicionar ao carrinho
window.adicionarAoCarrinho = function(nome, preco, imagem, quantidade) {
    quantidade = parseInt(quantidade); // Converte a quantidade para um número inteiro

    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += quantidade; // Adiciona à quantidade existente
    } else {
        carrinho.push({ nome, preco, quantidade, imagem }); // Adiciona novo item ao carrinho
    }

    exibirCarrinho(); // Atualiza a exibição do carrinho
};

// Função para exibir o carrinho
function exibirCarrinho() {
    const carrinhoContainer = document.getElementById("carrinho-itens");
    carrinhoContainer.innerHTML = ""; // Limpa os itens do carrinho antes de exibir

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

// Função para mostrar o modal com detalhes do prato
function mostrarModal(nome, descricao, preco, imagem) {
    const modal = document.getElementById("modal-prato");
    const nomeElement = document.getElementById("modal-nome");
    const descricaoElement = document.getElementById("modal-descricao");
    const precoElement = document.getElementById("modal-preco");
    const imagemElement = document.getElementById("modal-imagem");
    const quantidadeElement = document.getElementById("modal-quantidade"); // Campo de quantidade

    nomeElement.textContent = nome;
    descricaoElement.textContent = descricao;
    precoElement.textContent = `Preço: R$ ${preco}`;
    imagemElement.src = imagem;

    modal.style.display = "flex";

    // Adicionar ao carrinho dentro do modal
    document.getElementById("modal-adicionar").onclick = function() {
        const quantidade = parseInt(quantidadeElement.value); // Captura a quantidade do input
        adicionarAoCarrinho(nome, preco, imagem, quantidade); // Passa a quantidade para a função
        modal.style.display = "none"; // Fechar modal ao adicionar
    };
}

// Fechar o modal
document.getElementById("fechar-modal").addEventListener("click", () => {
    document.getElementById("modal-prato").style.display = "none";
});

// Mostrar/ocultar o carrinho ao clicar no ícone do carrinho
document.getElementById("icone-carrinho").addEventListener("click", () => {
    const modalCarrinho = document.getElementById("modal-carrinho");
    modalCarrinho.style.display = modalCarrinho.style.display === "flex" ? "none" : "flex";
});

// Fechar o modal do carrinho
document.getElementById("fechar-modal-carrinho").addEventListener("click", () => {
    document.getElementById("modal-carrinho").style.display = "none";
});

