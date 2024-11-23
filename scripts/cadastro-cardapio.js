// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.firebasestorage.app",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};

const db = firebase.firestore();

// Função para converter a imagem para base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Função para carregar as categorias do Firestore e popular os selects
async function carregarCategorias() {
    const categoriasRef = db.collection('categorias');
    const snapshot = await categoriasRef.get();
    const categoriasSelect = document.getElementById('categoria');
    const removerCategoriaSelect = document.getElementById('remover-categoria');
    
    // Limpa as opções de categoria existentes
    categoriasSelect.innerHTML = '';
    removerCategoriaSelect.innerHTML = '';

    // Adiciona uma opção vazia ao select principal
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Selecione uma Categoria';
    categoriasSelect.appendChild(optionDefault);

    // Adiciona uma opção vazia ao select de remoção
    const optionRemoverDefault = document.createElement('option');
    optionRemoverDefault.value = '';
    optionRemoverDefault.textContent = 'Selecione uma Categoria para Remover';
    removerCategoriaSelect.appendChild(optionRemoverDefault);

    // Adiciona as categorias recuperadas aos selects
    snapshot.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = doc.data().nome;
        
        const optionRemover = option.cloneNode(true); // Clona para reutilizar

        categoriasSelect.appendChild(option);
        removerCategoriaSelect.appendChild(optionRemover);
    });
}

// Função para salvar a nova categoria no Firestore
async function salvarNovaCategoria(novaCategoria) {
    const categoriasRef = db.collection('categorias');
    await categoriasRef.add({
        nome: novaCategoria
    });
    alert('Categoria salva com sucesso!');
    carregarCategorias(); // Atualiza a lista de categorias nos selects
}

// Função para remover uma categoria do Firestore
async function removerCategoria(categoriaId) {
    await db.collection('categorias').doc(categoriaId).delete();
    alert('Categoria removida com sucesso!');
    carregarCategorias(); // Atualiza a lista de categorias nos selects
}

// Função para salvar o prato no Firestore
async function salvarPrato(prato) {
    const pratoRef = db.collection('pratos').doc(); // Cria um novo documento
    await pratoRef.set(prato);
    alert('Prato cadastrado com sucesso!');
}

// Lidar com o envio do formulário de cadastro de prato
const formCardapio = document.getElementById('form-cardapio');
formCardapio.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    // Captura os dados do formulário
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const categoria = document.getElementById('categoria').value;
    const imgInput = document.getElementById('img');
    
    let imagemBase64 = "";

    // Converte a imagem para base64
    if (imgInput.files.length > 0) {
        const file = imgInput.files[0];
        imagemBase64 = await fileToBase64(file); // Converte a imagem para base64
    }

    // Cadastra o prato no Firestore
    const prato = {
        nome,
        descricao,
        valor,
        categoria,
        imagem: imagemBase64, // Armazena a imagem em base64
    };

    await salvarPrato(prato);

    // Limpa o formulário
    formCardapio.reset();
});

// Lidar com o clique do botão "Salvar Categoria" no modal
const salvarCategoriaBtn = document.getElementById('salvar-categoria');
salvarCategoriaBtn.addEventListener('click', () => {
    const novaCategoria = document.getElementById('nova-categoria').value;
    if (novaCategoria) {
        salvarNovaCategoria(novaCategoria);
        document.getElementById('nova-categoria').value = ''; // Limpa o campo
    } else {
        alert('Por favor, digite um nome para a categoria');
    }
});

// Lidar com o clique do botão "Remover Categoria" no modal
const removerCategoriaBtn = document.getElementById('remover-categoria-btn');
removerCategoriaBtn.addEventListener('click', () => {
    const categoriaId = document.getElementById('remover-categoria').value;
    if (categoriaId) {
        removerCategoria(categoriaId);
    } else {
        alert('Por favor, selecione uma categoria para remover');
    }
});

// Carregar categorias ao carregar a página
document.addEventListener('DOMContentLoaded', carregarCategorias);

// Abre o modal para gerenciar categorias
const gerenciarCategoriasBtn = document.getElementById('gerenciar-categorias-btn');
const modalCategorias = document.getElementById('modal-categorias');
const fecharModalBtn = document.getElementById('fechar-modal');

gerenciarCategoriasBtn.addEventListener('click', (event) => {
    event.preventDefault();
    modalCategorias.style.display = 'block';
});

// Fecha o modal de categorias
fecharModalBtn.addEventListener('click', () => {
    modalCategorias.style.display = 'none';
});

// Fechar o modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === modalCategorias) {
        modalCategorias.style.display = 'none';
    }
});

