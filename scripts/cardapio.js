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
                    <button class="mais-informacoes">Mais informações</button>
                </div>
            `;

            pratoDiv.querySelector('button').addEventListener('click', () => {
                mostrarModal(prato.nome, prato.descricao, prato.valor, prato.imagem, prato.id);
            });
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



// Função para mostrar o modal com detalhes do prato
// Função para mostrar o modal com detalhes do prato
export async function mostrarModal(nome, descricao, preco, imagem, pratoId) {
    const modal = document.getElementById("modal-prato");
    const nomeElement = document.getElementById("modal-nome");
    const descricaoElement = document.getElementById("modal-descricao");
    const precoElement = document.getElementById("modal-preco");
    const imagemElement = document.getElementById("modal-imagem");
    const itensAdicionaisContainer = document.getElementById("modal-itens-adicionais");

    nomeElement.textContent = nome;
    descricaoElement.textContent = descricao;
    precoElement.textContent = `Preço: R$ ${preco}`;
    imagemElement.src = imagem;

    // Limpa os itens adicionais antes de adicionar novos
    itensAdicionaisContainer.innerHTML = '';

    // Passo 1: Obter os itens adicionais relacionados ao prato
    const itensAdicionaisQuery = query(
        collection(db, "itens_adicionais"),
        where("id_prato", "==", pratoId)
    );
    const itensSnapshot = await getDocs(itensAdicionaisQuery);

    if (!itensSnapshot.empty) {
        itensSnapshot.forEach(async (itemDoc) => {
            const itemData = itemDoc.data();

            const itemContainer = document.createElement("div");
            itemContainer.className = "item-adicional";

            const tituloItem = document.createElement("h4");
            tituloItem.textContent = itemData.descricao;
            itemContainer.appendChild(tituloItem);

            const opcoesQuery = query(
                collection(db, "opcao"),
                where("questionario_id", "==", itemDoc.id)
            );
            
            const opcoesSnapshot = await getDocs(opcoesQuery);
        
            if (!opcoesSnapshot.empty) {
                const opcoesLista = document.createElement("ul"); // Lista para as opções
                let totalSelecionado = 0;  // Contador para o total de itens selecionados
        
                opcoesSnapshot.forEach(opcaoDoc => {
                    const opcaoData = opcaoDoc.data();
                    const opcaoElement = document.createElement("li");

                    // Se for um item incremental, tipo ketchup ou mostarda
                    if (itemData.incremental) {
                        const label = document.createElement("label");
                        label.textContent = `${opcaoData.descricao_opcao} - R$ ${opcaoData.preco}`;
                        
                        const input = document.createElement("input");
                        input.type = "number";
                        input.min = 0;
                        input.max = 2;  // Limite de 2 por tipo de molho
                        input.value = 0; // Valor inicial
                        input.name = `opcao-${itemData.id}`;

                        // Adiciona o evento de controle da quantidade
                        input.addEventListener('input', () => {
                            // Atualiza o total de itens selecionados
                            totalSelecionado = 0;
                            document.querySelectorAll(`input[name="opcao-${itemData.id}"]`).forEach(input => {
                                totalSelecionado += parseInt(input.value) || 0;
                            });

                            // Limita a quantidade total de itens selecionados a 2
                            if (totalSelecionado > 2) {
                                input.value = 0; // Reverte a última seleção
                                alert("Você pode adicionar no máximo 2 itens.");
                            }
                        });

                        label.appendChild(input);
                        opcaoElement.appendChild(label);
                    } else {
                        // Para as opções de checkbox (uma escolha única)
                        const input = document.createElement("input");
                        input.type = "radio";
                        input.name = `opcao-${itemData.id}`;

                        const label = document.createElement("label");
                        label.textContent = `${opcaoData.descricao_opcao} - R$ ${opcaoData.preco}`;

                        opcaoElement.appendChild(input);
                        opcaoElement.appendChild(label);


                    }
        
                    opcoesLista.appendChild(opcaoElement);
                });
                itemContainer.appendChild(opcoesLista); // Adiciona a lista ao contêiner do item
            } else {
                // Caso não haja opções, exibe uma mensagem
                const mensagemSemOpcoes = document.createElement("p");
                mensagemSemOpcoes.textContent = "Nenhuma opção disponível.";
                itemContainer.appendChild(mensagemSemOpcoes);
            }
        
            // Adiciona o contêiner do item adicional ao modal
            itensAdicionaisContainer.appendChild(itemContainer);
        });
    } else {
        // Caso não haja itens adicionais, exibe uma mensagem
        const mensagemSemItens = document.createElement("p");
        mensagemSemItens.textContent = "Nenhum item adicional disponível.";
        itensAdicionaisContainer.appendChild(mensagemSemItens);
    }

    // Exibe o modal
    modal.style.display = "flex";

    // Adicionar ao carrinho dentro do modal
    document.getElementById("modal-adicionar").onclick = function() {
        adicionarAoCarrinho(nome, preco, imagem, 1); // Passa quantidade como 1 por padrão
        modal.style.display = "none"; // Fecha o modal ao adicionar
    };
}

// Fechar o modal
document.getElementById("fechar-modal").addEventListener("click", () => {
    document.getElementById("modal-prato").style.display = "none";
});
