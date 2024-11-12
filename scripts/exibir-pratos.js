const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Função para carregar as categorias e mapeá-las pelo ID
async function obterCategorias() {
    const categoriasRef = db.collection('categorias');
    const snapshot = await categoriasRef.get();
    const categoriasMap = {};

    snapshot.forEach(doc => {
        const data = doc.data();
        categoriasMap[doc.id] = data.nome; // Armazena o nome da categoria com o ID como chave
    });

    return categoriasMap;
}

// Função para carregar e exibir os pratos
async function carregarPratos() {
    const listaPratos = document.getElementById('lista-pratos');
    listaPratos.innerHTML = ''; // Limpa o conteúdo atual

    // Obtém as categorias com seus nomes
    const categoriasMap = await obterCategorias();

    const snapshot = await db.collection('pratos').get();
    snapshot.forEach(doc => {
        const prato = doc.data();
        const pratoElement = document.createElement('div');
        pratoElement.classList.add('prato');

        // Formata os dados do prato
        pratoElement.innerHTML = `
            <h2>${prato.nome}</h2>
            <p><strong>Descrição:</strong> ${prato.descricao}</p>
            <p><strong>Valor:</strong> R$ ${prato.valor.toFixed(2)}</p>
            <p><strong>Disponibilidade:</strong> ${prato.disponibilidade}</p>
            <p><strong>Categoria:</strong> ${categoriasMap[prato.categoria] || 'Categoria não encontrada'}</p>
            ${prato.imagem ? `<img src="${prato.imagem}" alt="${prato.nome}" style="width: 200px; height: auto;">` : ''}
        `;

        listaPratos.appendChild(pratoElement);
    });
}

// Carrega os pratos ao carregar a página
document.addEventListener('DOMContentLoaded', carregarPratos);