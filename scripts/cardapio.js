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

import { exibirCarrinho } from './carrinho.js';

// const ordemCategorias = [
//     "Yakisoba Tradicional", 
//     "Yakisoba Especial", 
//     "Mistura", 
//     "Combo individual (simples)", 
//     "Combo individual ( Completo)", 
//     "Combo para Compartilhar",  
//     "Combo Família", 
//     "Molhos em Sachês", 
//     "Sobremesa", 
//     "Refrigerante", 
//     "Lojinha yaki'n box"
// ];

// let carrinho = [];
let categoriasMap = {}; // Mapeia o nome da categoria ao seu ID

// Função para carregar categorias do Firestore
async function carregarCategorias() {
    const categoriasRef = collection(db, "categorias");
    const snapshot = await getDocs(categoriasRef);
    const categorias = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        categoriasMap[doc.id] = data.nome; // Mapeia o ID da categoria ao seu nome
        categorias.push({ id: doc.id, nome: data.nome });
    });

    // Ordena as categorias com base na ordem desejada
    // categorias.sort((a, b) => {
    //     return ordemCategorias.indexOf(a.nome) - ordemCategorias.indexOf(b.nome);
    // });

    const categoriasSelect = document.getElementById("categoria");
    categoriasSelect.innerHTML = ''; // Limpa as opções existentes

    // Adiciona uma opção vazia ao select
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Selecione uma Categoria';
    categoriasSelect.appendChild(optionDefault);

    // Adiciona as categorias ordenadas ao select
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nome;
        categoriasSelect.appendChild(option);
    });
}

// Função para carregar pratos do Firestore
async function carregarPratos(categoriaId = "") {
    const pratosRef = collection(db, "pratos");
    // const pratosSnapshot = await getDocs(pratosRef);
    let pratosSnapshot;

    if (categoriaId) {
        pratosSnapshot = await getDocs(query(pratosRef, where("categoria", "==", categoriaId)));
    } else {
        pratosSnapshot = await getDocs(pratosRef);
    }

    const pratosList = pratosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Agrupa pratos por categoria
    const pratosPorCategoria = {};

    pratosList.forEach(prato => {
        const categoriaNome = categoriasMap[prato.categoria]; // Usa o mapa para obter o nome da categoria
        if (!pratosPorCategoria[categoriaNome]) {
            pratosPorCategoria[categoriaNome] = [];
        }
        pratosPorCategoria[categoriaNome].push(prato);
    });

    // Seleciona o container onde os pratos serão exibidos
    const pratosContainer = document.getElementById("pratos-container");
    pratosContainer.innerHTML = ""; // Limpa o conteúdo atual

    // Cria um contêiner para cada categoria e lista os pratos
    for (const categoria in pratosPorCategoria) {
        const categoriaDiv = document.createElement("div");
        const categoriaTitulo = document.createElement("h2");
        categoriaTitulo.textContent = categoria; // Nome da categoria
        categoriaDiv.appendChild(categoriaTitulo);

        // Cria um contêiner para os pratos da categoria
        const pratosGrid = document.createElement("div");
        pratosGrid.classList.add("pratos-grid");

        pratosPorCategoria[categoria].forEach(prato => {
            const pratoDiv = document.createElement("div");
            pratoDiv.classList.add("prato");
            pratoDiv.innerHTML = `
                <img src="${prato.imagem}" alt="${prato.nome}" class="prato-imagem">
                <div class="info-cardapio">
                    <h3>${prato.nome}</h3>
                    <p>${prato.descricao}</p>
                    <p><strong>R$ ${prato.valor}</strong></p>
                    <button class="mais-informacoes" onclick="mostrarModal('${prato.nome}', '${prato.descricao}', ${prato.valor}, '${prato.imagem}')">Mais informações</button>
                    <div class="input-container-prato">
                        <label for="quantidade-${prato.nome}">Quantidade:</label>
                        <input type="number" value="1" min="1" id="quantidade-${prato.nome}" class="quantidade">
                        <button onclick="adicionarAoCarrinho('${prato.nome}', ${prato.valor}, '${prato.imagem}', document.getElementById('quantidade-${prato.nome}').value)">Adicionar ao Carrinho</button>
                    </div>
                </div>
            `;
            pratosGrid.appendChild(pratoDiv);
            // Ao clicar no prato, mostrar o modal
            pratoDiv.querySelector('button').addEventListener('click', () => {
                mostrarModal(prato.nome, prato.descricao, prato.valor, prato.imagem);
            });
        });
        categoriaDiv.appendChild(pratosGrid);
        pratosContainer.appendChild(categoriaDiv)
    }
}

// Carregar categorias ao iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await carregarCategorias();
    await carregarPratos(); // Carrega todos os pratos ao iniciar
});

// Adiciona um evento ao select de categoria
document.getElementById("categoria").addEventListener("change", async (event) => {
    const categoriaID = event.target.value; // Obtém o ID da categoria selecionada
    await carregarPratos(categoriaID); // Carrega pratos com base no ID da categoria selecionada
});

// Função para adicionar ao carrinho
window.adicionarAoCarrinho = function(nome, preco, imagem, quantidade) {
    quantidade = parseInt(quantidade); // Converte a quantidade para um número inteiro

    let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    // carrinho.forEach(item => {
    //     item.nome = JSON.stringify(item.nome);
    // });

    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += quantidade; // Adiciona à quantidade existente
    } else {
        carrinho.push({ nome, preco, quantidade, imagem }); // Adiciona novo item ao carrinho
    }

    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));

    exibirCarrinho(); // Atualiza a exibição do carrinho
};

// // Função para exibir o carrinho
// export function exibirCarrinho() {
//     const carrinhoContainer = document.getElementById("carrinho-itens");
//     carrinhoContainer.innerHTML = ""; // Limpa os itens do carrinho antes de exibir
    
//     let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
//     // carrinho.forEach(item => {
//     //     item.nome = JSON.stringify(item.nome);
//     // });

//     if (carrinho.length === 0) {
//         carrinhoContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
//     } else {
//         carrinho.forEach(item => {
//             const itemDiv = document.createElement("div");
//             itemDiv.classList.add("item-carrinho");
//             itemDiv.innerHTML = `
//                 <p>${item.nome} - Quantidade: ${item.quantidade}</p>
//                 <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
//             `;
//             carrinhoContainer.appendChild(itemDiv);
//         });
//     }
// }

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