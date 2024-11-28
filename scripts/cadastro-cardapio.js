

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
    return pratoRef.id;
}

async function salvar_questionario(questionario){
    const questionarioRef = db.collection('itens_adicionais').doc(); // Cria um novo documento
    await questionarioRef.set(questionario);
    return questionarioRef.id;
}

async function salvar_opcao(opcao) {
    const opcaoRef = db.collection('opcao').doc(); // Cria um novo documento
    await opcaoRef.set(opcao);
}

let list_questionarios = [];
let nomes_campos_questionario = {
    questionario: "questionario-",
    descricao: "questionario_descricao-",
    checkbox_incremental: "checkbox_incremental-",
    botao_excluir: "botao_excluir_questionario-",
};
let list_itens = [];
let nomes_campos_opcao = {
    opcao: "opcao-",
    descricao_opcao: "opcao_descricao-",
    preco: "opcao_preco-",
    botao_excluir: "botao_excluir_opcao-",
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

    alert("Prato salvo com sucesso!");

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
        

        list_itens.forEach(async function(opcao_vals) {
            const count_opcao = opcao_vals[0];
            const count_seu_questionario = opcao_vals[1];
            if (count_questionario === count_seu_questionario) {
                const descricao_opcao = document.getElementById(
                    `${nomes_campos_opcao.descricao_opcao}${count_opcao}`
                ).value;
                const preco = parseFloat(document.getElementById(
                    `${nomes_campos_opcao.preco}${count_opcao}`
                ).value); // Converte para número
        
                const opcao = {
                    descricao_opcao,
                    preco, // Agora é garantido ser um número
                    questionario_id
                };

        
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
    const questionariosContainer = document.getElementById('questionarios-container');
    questionariosCount++;
    
    const questionariosId_html = questionariosCount;

    // Cria um div para o questionário
    const questionarioBox = document.createElement('div');
    questionarioBox.className = 'questionario-box';

    // Adiciona a pergunta ao contador de questionários
    list_questionarios.push(questionariosId_html);

    // Define o conteúdo HTML do questionário
    questionarioBox.innerHTML = `
        <div id="${nomes_campos_questionario.questionario}${questionariosId_html}">
            <div>
                <label for="descricao">Descrição:</label>
                <input type="text" name="descricao" id="${nomes_campos_questionario.descricao}${questionariosId_html}" required>
            </div>
            <br>

            <div style="display: flex; align-items: center; gap: 1px;">
                <label style="margin: 0;">
                    É do tipo incremental?
                </label>
                <input type="checkbox" name="" id="${nomes_campos_questionario.checkbox_incremental}${questionariosId_html}" style="margin: 0;">
            </div>
            <br>

            <div id="opcoes-${questionariosId_html}">
            </div>

            <button 
                id="botao-${questionariosId_html}" 
                type="button"
            >
                Adicione uma opção
            </button>
            <br>

            <button 
                id="${nomes_campos_questionario.botao_excluir}${questionariosId_html}"
                type="button" 
            >
                Excluir questionário
            </button>
        </div>
    `;

    // Adiciona os event listeners diretamente aos botões criados
    const botaoAddOpcao = questionarioBox.querySelector(`#botao-${questionariosId_html}`);
    botaoAddOpcao.addEventListener('click', () => add_opcao(questionariosId_html));

    const botaoExcluir = questionarioBox.querySelector(`#${nomes_campos_questionario.botao_excluir}${questionariosId_html}`);
    botaoExcluir.addEventListener('click', () => excluir_questionario(questionariosId_html));

    // Adiciona o contêiner do questionário ao contêiner principal
    questionariosContainer.appendChild(questionarioBox);

}



export function add_opcao(questionario_count) {
    itensCount++;
    const itemId_html = itensCount;

    const itens_container = document.getElementById(
        `opcoes-${questionario_count}`
    );

    list_itens.push([itemId_html, questionario_count]);
    // alert(JSON.stringify(list_itens));

    // Cria um div para a nova item
    const itens_box = document.createElement('div');
    itens_box.className = 'item-box';

    itens_box.innerHTML = `
        <div id="${nomes_campos_opcao.opcao}${itemId_html}">
            <div>Opção</div>

            <label>Digite a descricao do item</label>
            <input id=${nomes_campos_opcao.descricao_opcao}${itemId_html} type="text"></input>

            <label>Digite o preço do item</label>
            <input id=${nomes_campos_opcao.preco}${itemId_html} type="number" step="0.01"></input>

            <button 
                id="${nomes_campos_opcao.botao_excluir}${itemId_html}"
                type="button" 
            >
                Excluir opção
            </button>
        </div>
    `;

    const botaoExcluirOpcao = itens_box.querySelector(`#${nomes_campos_opcao.botao_excluir}${itemId_html}`);
    botaoExcluirOpcao.addEventListener('click', () => excluir_opcao(itemId_html));

    itens_container.appendChild(itens_box);

}

export function excluir_questionario(questionario_count_excluir){
    alert(`Ação de excluir ${questionario_count_excluir}!`);

    const questionario = document.getElementById(
        `${nomes_campos_questionario.questionario}${questionario_count_excluir}`
    );
    if (questionario) {
        // questionario.style.display = 'none'; // Esconde o questionário
        questionario.remove();
        
        let list_questionarios_novo = []
        list_questionarios.forEach(async function(count_questionario){
            if(questionario_count_excluir !== count_questionario){
                list_questionarios_novo.push(count_questionario);    
            }
        });
        
        let list_itens_novo = []
        list_itens.forEach(async function(opcao_vals){
            const count_opcao = opcao_vals[0];
            const count_seu_questionario = opcao_vals[1];
            if(questionario_count_excluir !== count_seu_questionario){
                list_itens_novo.push([count_opcao, count_seu_questionario]);
            }
        });

        list_questionarios = list_questionarios_novo
        list_itens = list_itens_novo

    }

}

export function excluir_opcao(opcao_count_excluir){

    const opcao = document.getElementById(
        `${nomes_campos_opcao.opcao}${opcao_count_excluir}`
    );
    if (opcao) {
        opcao.style.display = 'none'; // Esconde o questionário
        
        let list_itens_novo = []
        list_itens.forEach(async function(opcao_vals){
            const count_opcao = opcao_vals[0];
            const count_seu_questionario = opcao_vals[1];
            if(opcao_count_excluir !== count_opcao){
                list_itens_novo.push([count_opcao, count_seu_questionario]);
            }
        });

        list_itens = list_itens_novo

    }

}

// Adiciona um ouvinte de clique ao botão
addQuestionarioButton.addEventListener('click', addQuestionario);

