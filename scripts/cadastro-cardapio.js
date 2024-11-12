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

// Função para carregar as categorias do Firestore e popular o select
async function carregarCategorias() {
    const categoriasRef = db.collection('categorias');
    const snapshot = await categoriasRef.get();
    const categoriasSelect = document.getElementById('categoria');
    
    // Limpa as opções de categoria existentes
    categoriasSelect.innerHTML = '';

    // Adiciona uma opção vazia
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Selecione uma Categoria';
    categoriasSelect.appendChild(optionDefault);

    // Adiciona as categorias recuperadas
    snapshot.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = doc.data().nome;
        categoriasSelect.appendChild(option);
    });
}

// Função para salvar a nova categoria no Firestore
async function salvarNovaCategoria(novaCategoria) {
    const categoriasRef = db.collection('categorias');
    await categoriasRef.add({
        nome: novaCategoria
    });
    alert('Categoria salva com sucesso!');
    carregarCategorias(); // Atualiza a lista de categorias

    document.getElementById('nova-categoria').value = '';
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
    const disponibilidade = document.getElementById('disponibilidade').value;
    const categoria = document.getElementById('categoria').value;
    const novaCategoria = document.getElementById('nova-categoria').value;
    const imgInput = document.getElementById('img');
    
    let imagemBase64 = "";

    // Converte a imagem para base64
    if (imgInput.files.length > 0) {
        const file = imgInput.files[0];
        imagemBase64 = await fileToBase64(file); // Converte a imagem para base64
    }

    // Se houver uma nova categoria, adiciona ao Firestore
    if (novaCategoria) {
        await salvarNovaCategoria(novaCategoria);
    }

    // Cadastra o prato no Firestore
    const prato = {
        nome,
        descricao,
        valor,
        disponibilidade,
        categoria: novaCategoria || categoria,
        imagem: imagemBase64, // Armazena a imagem em base64
    };

    await salvarPrato(prato);

    // Limpa o formulário
    formCardapio.reset();
});

// Lidar com o clique do botão "Salvar Categoria"
const salvarCategoriaBtn = document.getElementById('salvar-categoria');
salvarCategoriaBtn.addEventListener('click', () => {
    const novaCategoria = document.getElementById('nova-categoria').value;
    if (novaCategoria) {
        salvarNovaCategoria(novaCategoria);
    } else {
        alert('Por favor, digite um nome para a categoria');
    }
});

// Carregar categorias ao carregar a página
document.addEventListener('DOMContentLoaded', carregarCategorias);
