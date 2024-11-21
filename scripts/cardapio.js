// Inicializa o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

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

let carrinho = []

// Função para carregar categorias do Firestore
async function carregarCategorias() {
    const categoriaRef = collection(db, "categorias");

    try {
        const categoriaSelect = document.getElementById("categoria");
        const opcaoFiltrar = document.createElement("option");
        opcaoFiltrar.value = "";
        opcaoFiltrar.textContent = "Filtrar";
        categoriaSelect.appendChild(opcaoFiltrar); // Adiciona a opção "Filtrar" ao select

        const categoriaSnapshot = await getDocs(categoriaRef);
        const categoriaList = categoriaSnapshot.docs.map(doc => doc.data().nome);

        categoriaList.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria;
            option.textContent = categoria;
            categoriaSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar categorias: ", error);
    }
}

// Carregar categorias assim que o script for executado
carregarCategorias();

// Função para carregar pratos do Firestore
async function carregarPratos() {
    const pratosRef = collection(db, "pratos");

    try {
        const pratosSnapshot = await getDocs(pratosRef);
        const pratosList = pratosSnapshot.docs.map(doc => doc.data());

        // Seleciona o container onde os pratos serão exibidos
        const pratosContainer = document.getElementById("pratos-container");

        pratosList.forEach(prato => {
            const pratoDiv = document.createElement("div");
            pratoDiv.classList.add("prato");

            // Criação do conteúdo do prato
            pratoDiv.innerHTML = `
                <img src="${prato.imagem}" alt="${prato.nome}" class="prato-imagem">
                <div class="info-cardapio">
                    <h3>${prato.nome}</h3>
                    <p>${prato.descricao}</p>
                    <p><strong>R$ ${prato.valor}</strong></p>
                    <button onclick="adicionarAoCarrinho('${prato.nome}', ${prato.valor}, '${prato.imagem}')">Adicionar ao Carrinho</button>
                    <input type="number" value="1" min="1" id="quantidade-${prato.nome}" class="quantidade">
                </div>
            `;

            // Ao clicar no prato, mostrar o modal
            pratoDiv.querySelector('img').addEventListener('click', () => {
                mostrarModal(prato.nome, prato.descricao, prato.valor, prato.imagem);
            });

            // Adiciona o prato ao container
            pratosContainer.appendChild(pratoDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar pratos: ", error);
    }
}


// Carregar os pratos assim que o script for executado
carregarPratos();

// Função para adicionar ao carrinho
// Função para adicionar ao carrinho
function adicionarAoCarrinho(nome, preco, imagem) {
    // Obtemos a quantidade do input
    const quantidade = document.getElementById(`quantidade-${nome}`) ? parseInt(document.getElementById(`quantidade-${nome}`).value) : 1;

    // Verifica se o prato já está no carrinho
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += quantidade; // Se existir, incrementa a quantidade
    } else {
        // Caso contrário, adiciona o novo item ao carrinho
        carrinho.push({ nome, preco, quantidade, imagem });
    }

    // Exibe os itens do carrinho
    exibirCarrinho();
}

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

    nomeElement.textContent = nome;
    descricaoElement.textContent = descricao;
    precoElement.textContent = `Preço: R$ ${preco}`;
    imagemElement.src = imagem;

    modal.style.display = "flex";

    // Adicionar ao carrinho dentro do modal
    document.getElementById("modal-adicionar").onclick = function() {
        adicionarAoCarrinho(nome, preco, imagem);
        modal.style.display = "none"; // Fechar modal ao adicionar
    };
}

    // Adicionar ao carrinho dentro do modal
    document.getElementById("modal-adicionar").onclick = function() {
        adicionarAoCarrinho(nome, preco, imagem);
        modal.style.display = "none"; // Fechar modal ao adicionar
    };


// Fechar o modal
document.getElementById("fechar-modal").addEventListener("click", () => {
    document.getElementById("modal-prato").style.display = "none";
});

// Mostrar/ocultar o carrinho ao clicar no ícone do carrinho
document.getElementById("icone-carrinho").addEventListener("click", () => {
    const modalCarrinho = document.getElementById("modal-carrinho");
    modalCarrinho.style.display = modalCarrinho.style.display === "flex" ? "none" : "flex";
    const userId = 'ID_DO_USUARIO'; // Substitua pelo ID do usuário logado
    exibirCarrinho(userId);  // Chama a função para exibir os itens do carrinho
});

// Fechar o modal do carrinho
document.getElementById("fechar-modal-carrinho").addEventListener("click", () => {
    document.getElementById("modal-carrinho").style.display = "none";
});

