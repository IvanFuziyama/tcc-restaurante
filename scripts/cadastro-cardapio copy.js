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
    // alert('Prato cadastrado com sucesso!');
    // alert("ID_prato: "+pratoRef.id);
    return pratoRef.id;
}

async function salvar_questionario(questionario){
    const questionarioRef = db.collection('itens_adicionais').doc(); // Cria um novo documento
    await questionarioRef.set(questionario);
    alert("questionario: "+JSON.stringify(questionario));
    return questionarioRef.id;
}

async function salvar_opcao(opcao) {
    const opcaoRef = db.collection('opcao').doc(); // Cria um novo documento
    await opcaoRef.set(opcao);
}

let list_questionarios = [];
let nomes_campos_questionario = {
    descricao: "questionario-",
    checkbox_incremental: "checkbox_incremental-",
    botao_excluir: "botao_excluir_questionario-",
};
let list_itens = [];
let nomes_campos_opcao = {
    descricao_opcao: "opcao-",
    preco: "opcao_preco-",
    botao_excluir: "botao_exlcuir_opcao-",
};
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

    let id_prato = await salvarPrato(prato);

    list_questionarios.forEach(async function(count_questionario){
        const descricao = document.getElementById(
            nomes_campos_questionario.descricao
            + count_questionario
        ).value;
        const incremental = document.getElementById(
            nomes_campos_questionario.checkbox_incremental
            + count_questionario
        ).checked;

        const questionario = {
            descricao, incremental, id_prato
        };

        let questionario_id = await salvar_questionario(questionario);
        
        alert("questionario_id="+questionario_id);

        list_itens.forEach(async function(opcao_vals){
            const count_opcao = opcao_vals[0];
            const count_seu_questionario = opcao_vals[1];
            if(count_questionario === count_seu_questionario){
                
                const descricao_opcao = document.getElementById(
                    `${nomes_campos_opcao.descricao_opcao}${count_opcao}`
                ).value;
                const preco = document.getElementById(
                    `${nomes_campos_opcao.preco}${count_opcao}`
                ).value;
                
                const opcao = {
                    descricao_opcao, preco, questionario_id
                };

                alert("opcao: "+JSON.stringify(opcao));

                await salvar_opcao(opcao);

            }
        });

    });

    // Limpa o formulário
    //formCardapio.reset();
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

let questionariosCount = 0
let itensCount = 0
const addQuestionarioButton = document.getElementById('add-questionario');

export function addQuestionario() {
    // alert("Ola");
    const questionariosContainer = document.getElementById('questionarios-container');
    questionariosCount++;

    // Cria um div para a nova pergunta
    const questionarioBox = document.createElement('div');
    questionarioBox.className = 'questionario-box';

    // Cria uma div para o questionario
    const label = document.createElement('div');
    label.textContent = `Pergunta ${questionariosCount}:`;
    // label.setAttribute('for', `question-${questionariosCount}`);
    list_questionarios.push(questionariosCount);

    // Cria uma caixa de texto (input) para a pergunta
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `${nomes_campos_questionario.descricao}${questionariosCount}`;
    input.name = `${nomes_campos_questionario.descricao}${questionariosCount}`;
    input.placeholder = `Digite o titulo aqui...`;
    // alert(`${nomes_campos_questionario.descricao}-${questionariosCount}`);

    // Cria o botao de add opcoes
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.id = `botao-${questionariosCount}`;
    botao.name = `botao-${questionariosCount}`;
    botao.textContent = 'Adcione uma opcao';
    botao.onclick = () => add_opcao(questionariosCount);

    // Cria uma checkbox
    const checkbox_incremental = document.createElement('input');
    checkbox_incremental.type = 'checkbox';
    checkbox_incremental.id = `${nomes_campos_questionario.checkbox_incremental}${questionariosCount}`;
    checkbox_incremental.name = `${nomes_campos_questionario.checkbox_incremental}${questionariosCount}`;

    // Cria um rótulo para a checkbox
    const checkboxLabel_incremental = document.createElement('label');
    checkboxLabel_incremental.textContent = ' É do tipo incremental? Sim';
    checkboxLabel_incremental.setAttribute('for', `checkbox_incremental-${questionariosCount}`);

    const botao_excluir = document.createElement('button');
    botao_excluir.type = 'button';
    botao_excluir.id = `${nomes_campos_questionario.botao_excluir}${questionariosCount}`;
    botao_excluir.name = `botao-${questionariosCount}`;
    botao_excluir.textContent = 'Excluir questionario';
    botao.onclick = () => excluir_opcao(questionariosCount);

    // Cria uma div para os itens
    const itens_div = document.createElement('div');
    itens_div.id = `opcoes-${questionariosCount}`;

    // Adiciona o label e o input ao contêiner da pergunta
    questionarioBox.appendChild(label);
    // questionarioBox.appendChild(document.createElement('br')); // Quebra de linha
    questionarioBox.appendChild(input);
    questionarioBox.appendChild(checkboxLabel_incremental);
    questionarioBox.appendChild(checkbox_incremental);
    questionarioBox.appendChild(itens_div);
    questionarioBox.appendChild(botao);
    questionarioBox.appendChild(botao_excluir);

    // Adiciona o contêiner da pergunta ao contêiner principal
    questionariosContainer.appendChild(questionarioBox);
}

function mostrar_questionario(){
    
}

export function add_opcao(questionario_count) {
    // alert(`Ação para a Pergunta ${questionarioId}!`);
    itensCount++;

    const itens_div = document.getElementById(
        `opcoes-${questionario_count}`
    );

    list_itens.push([itensCount, questionario_count]);
    // alert(JSON.stringify(list_itens));

    // Cria um div para a nova item
    const itens_box = document.createElement('div');
    itens_box.className = 'questionario-box';
    
    const label = document.createElement('div');
    label.textContent = `Opcao:`;

    const descricao = document.createElement('input');
    descricao.type = 'text';
    descricao.id = `${nomes_campos_opcao.descricao_opcao}${itensCount}`;
    descricao.name = `${nomes_campos_opcao.descricao_opcao}${itensCount}`;
    descricao.placeholder = `Digite a descricao do item...`;

    const preco = document.createElement('input');
    preco.type = 'text';
    preco.name = `${nomes_campos_opcao.preco}${itensCount}`
    preco.id = `${nomes_campos_opcao.preco}${itensCount}`;
    preco.placeholder = `Digite o preço do item...`;

    itens_box.appendChild(label);
    itens_box.appendChild(descricao);
    itens_box.appendChild(preco);

    itens_div.appendChild(itens_box);

}

export function excluir_questionario(questionario_count){



}

// Adiciona um ouvinte de clique ao botão
addQuestionarioButton.addEventListener('click', addQuestionario);

