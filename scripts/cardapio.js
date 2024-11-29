// Inicializa o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js"; // Importa o módulo de autenticação

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
    let pratosSnapshot;

    if (categoriaId) {
        if (categoriaId !== undefined && categoriaId !== "") {
            pratosSnapshot = await getDocs(query(pratosRef, where("categoria", "==", categoriaId)));
        } else {
            console.error("categoriaId é inválido:", categoriaId);
            pratosSnapshot = await getDocs(pratosRef); // Carrega todos os pratos
        }
    } else {
        pratosSnapshot = await getDocs(pratosRef); // Carrega todos os pratos
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
        });
        categoriaDiv.appendChild(pratosGrid);
        pratosContainer.appendChild(categoriaDiv);
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
window.adicionarAoCarrinho = function(nome, preco) {
    const user = auth.currentUser ; // Obtém o usuário logado

    if (!user) {
        // Se não houver usuário logado, exibe um alerta
        alert("Você precisa estar logado para adicionar itens ao carrinho.");
        return; // Sai da função se não estiver logado
    }
    
    let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];    

    // Coletar opções adicionais selecionadas
    const opcoesSelecionadas = {};
    let totalComplementos = 0; // Variável para somar o total dos complementos
    const inputsAdicionais = document.querySelectorAll('input[name^="opcao-"]');

    inputsAdicionais.forEach(input => {
        const descricaoOpcao = input.parentElement.textContent.trim(); // Pega a descrição da opção
        if (input.type === "radio" && input.checked) {
            // Para opções que são radio buttons (ex: Proteínas)
            opcoesSelecionadas[descricaoOpcao] = (opcoesSelecionadas[descricaoOpcao] || 0) + 1;
            totalComplementos += parseFloat(input.dataset.preco); // Soma o preço da opção
        } else if (input.type === "number" && parseInt(input.value) > 0) {
            // Para opções incrementais (ex: Molhos)
            const precoOpcao = parseFloat(input.dataset.preco); // Preço do item incremental
            const quantidade = parseInt(input.value);
            opcoesSelecionadas[descricaoOpcao] = (opcoesSelecionadas[descricaoOpcao] || 0) + quantidade;;
            totalComplementos += precoOpcao * parseInt(input.value); // Soma o valor total do complemento
        }
    });

    // Calcula o preço total do prato com os complementos
    const totalPreco = parseFloat(preco) + totalComplementos;

    // Adiciona o prato e os complementos selecionados ao carrinho
    carrinho.push({ 
        nome, 
        preco: totalPreco, 
        opcoes: opcoesSelecionadas 
    });

    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    exibirCarrinho(); // Atualiza a exibição do carrinho
};





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

    itensAdicionaisContainer.innerHTML = ''; // Limpa itens adicionais

    try {
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

                function verificarLimiteIncrementos(inputsAdicionais, maxLimite) {
                    let totalSelecionado = 0;
                
                    inputsAdicionais.forEach(input => {
                        if (input.type === "number" && parseInt(input.value) > 0) {
                            totalSelecionado += parseInt(input.value);
                        }
                    });
                
                    return totalSelecionado <= maxLimite;
                }
                

                const opcoesSnapshot = await getDocs(opcoesQuery);

                if (!opcoesSnapshot.empty) {
                    const opcoesLista = document.createElement("ul");

                    opcoesSnapshot.forEach(opcaoDoc => {
                        const opcaoData = opcaoDoc.data();
                    
                        const opcaoElement = document.createElement("li");
                        const descricaoOpcao = opcaoData.descricao_opcao || "Descrição não disponível";
                        const preco = opcaoData.preco || "0.00";
                    
                        const label = document.createElement("label");
                        label.textContent = `${descricaoOpcao} - R$ ${preco}`;
                    
                        const input = document.createElement("input");
                        input.type = itemData.incremental ? "number" : "radio";
                        input.name = `opcao-${itemData.id}`;
                        input.dataset.preco = preco;
                        input.min = 0;
                        input.max = 2; // Limite máximo para cada item
                    
                        if (itemData.incremental) {
                            input.addEventListener("input", () => {
                                const inputsAdicionais = document.querySelectorAll('input[name^="opcao-"][type="number"]');
                                if (!verificarLimiteIncrementos(inputsAdicionais, 2)) {
                                    input.value = 0; // Reseta o valor se ultrapassar o limite
                                    alert("Você pode selecionar no máximo 2 complementos no total.");
                                }
                            });
                        }
                    
                        label.appendChild(input);
                        opcaoElement.appendChild(label);
                        opcoesLista.appendChild(opcaoElement);
                    });
                    
                    itemContainer.appendChild(opcoesLista);
                } else {
                    const mensagemSemOpcoes = document.createElement("p");
                    mensagemSemOpcoes.textContent = "Nenhuma opção disponível.";
                    itemContainer.appendChild(mensagemSemOpcoes);
                }

                itensAdicionaisContainer.appendChild(itemContainer);
            });
        } else {
            const mensagemSemItens = document.createElement("p");
            mensagemSemItens.textContent = "Nenhum item adicional disponível.";
            itensAdicionaisContainer.appendChild(mensagemSemItens);
        }
    } catch (error) {
        console.error("Erro ao carregar itens adicionais:", error);
    }

    modal.style.display = "flex";

    document.getElementById("modal-adicionar").onclick = function() {
        adicionarAoCarrinho(nome, preco);
        modal.style.display = "none";
    };
}


// Fechar o modal
document.getElementById("fechar-modal").addEventListener("click", () => {
    document.getElementById("modal-prato").style.display = "none";
});
