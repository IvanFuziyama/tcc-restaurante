const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.firebasestorage.app",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};

firebase.initializeApp(firebaseConfig);
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

// Função para carregar as categorias e mapeá-las pelo ID
async function obterCategorias() {
    const categoriasRef = db.collection('categorias');
    const snapshot = await categoriasRef.get();
    const categoriasMap = {};

    // Limpa as opções de categorias
    const categoriaSelect = document.getElementById('edit-categoria');
    categoriaSelect.innerHTML = ''; // Limpa as opções existentes

    // Adiciona a opção padrão
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Selecione uma Categoria';
    categoriaSelect.appendChild(optionDefault);

    snapshot.forEach(doc => {
        const data = doc.data();
        categoriasMap[doc.id] = data.nome;

        // Cria uma opção para cada categoria
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = data.nome;
        categoriaSelect.appendChild(option);
    });

    return categoriasMap;
}

// Função para carregar e exibir os pratos
async function carregarPratos(categoriaId = "") {
    const listaPratos = document.getElementById('lista-pratos');
    listaPratos.innerHTML = ''; // Limpa o conteúdo atual

    let pratosSnapshot;

    // Filtra os pratos se uma categoria for selecionada
    if (categoriaId) {
        pratosSnapshot = await db.collection('pratos').where("categoria", "==", categoriaId).get();
    } else {
        pratosSnapshot = await db.collection('pratos').get(); // Carrega todos os pratos
    }

    pratosSnapshot.forEach(doc => {
        const prato = doc.data();
        const pratoElement = document.createElement('div');
        pratoElement.classList.add('prato');
        pratoElement.dataset.id = doc.id; // Armazena o ID do prato para referência futura

        // Criação da div para as informações do prato
        const informacoesElement = document.createElement('div');
        informacoesElement.classList.add('informacoes');

        // Formata os dados do prato dentro da div de informações
        informacoesElement.innerHTML = `
            <h2>${prato.nome}</h2>
            <p><strong>Descrição:</strong> ${prato.descricao}</p>
            <p><strong>Valor:</strong> R$ ${prato.valor.toFixed(2)}</p>
        `;

        // Criação da imagem do prato
        const imagemElement = document.createElement('img');
        if (prato.imagem) {
            imagemElement.src = prato.imagem; // Certifique-se de que a imagem está sendo definida corretamente
            imagemElement.alt = prato.nome;
            imagemElement.style.width = "200px"; // Ajuste o tamanho da imagem se necessário
            imagemElement.style.height = "auto";
        } else {
            imagemElement.src = 'caminho/para/imagem/padrao.jpg'; // Coloque uma imagem padrão caso não exista
            imagemElement.alt = 'Imagem não disponível';
        }

        // Criação dos botões de editar e excluir
        const botaoEditar = document.createElement('button');
        botaoEditar.innerText = "Editar";
        botaoEditar.classList.add('botao-editar');
        botaoEditar.onclick = () => editarPrato(doc.id, prato);

        const botaoExcluir = document.createElement('button');
        botaoExcluir.innerText = "Excluir";
        botaoExcluir.classList.add('botao-excluir');
        botaoExcluir.onclick = () => excluirPrato(doc.id);

        // Adiciona os botões de editar e excluir à div de informações
        informacoesElement.appendChild(botaoEditar);
        informacoesElement.appendChild(botaoExcluir);

        // Adiciona as informações e a imagem ao prato
        pratoElement.appendChild(informacoesElement);
        pratoElement.appendChild(imagemElement);

        // Adiciona o prato ao lista de pratos
        listaPratos.appendChild(pratoElement);
    });
}

// Função para excluir o prato
async function excluirPrato(id) {
    try {
        // Excluir itens adicionais associados ao prato
        const itensAdicionaisSnapshot = await db.collection('itens_adicionais').where('id_prato', '==', id).get();

        // Criar um array para armazenar as promessas de exclusão de itens adicionais
        const itensAdicionaisPromises = itensAdicionaisSnapshot.docs.map(async (doc) => {
            const itemId = doc.id; // ID do item adicional

            // Excluir as opções associadas a esse item adicional
            const opcoesSnapshot = await db.collection('opcao').where('questionario_id', '==', itemId).get();
            const opcoesPromises = opcoesSnapshot.docs.map(opcaoDoc => {
                console.log('Excluindo opção:', opcaoDoc.id); // Exibe o ID da opção sendo excluída
                return db.collection('opcao').doc(opcaoDoc.id).delete(); // Exclui o documento da coleção 'opcao'
            });

            // Excluir o item adicional
            await Promise.all(opcoesPromises); // Aguarda a exclusão das opções
            return db.collection('itens_adicionais').doc(itemId).delete(); // Exclui o item adicional
        });

        // Aguarda a exclusão de todos os itens adicionais
        await Promise.all(itensAdicionaisPromises);

        // Excluir o prato
        await db.collection('pratos').doc(id).delete();

        alert("Prato excluído com sucesso!");
        carregarPratos(); // Atualiza a lista de pratos
    } catch (error) {
        console.error("Erro ao excluir prato: ", error);
        alert("Erro ao excluir prato.");
    }
}

// Função para editar o prato
async function editarPrato(id, prato) {
    // Exibe o formulário de edição
    document.getElementById('formulario-edicao').style.display = 'block';

    // Preenche os campos do formulário com os dados do prato
    document.getElementById('edit-nome').value = prato.nome;
    document.getElementById('edit-descricao').value = prato.descricao;
    document.getElementById('edit-valor').value = prato.valor;
    document.getElementById('edit-categoria').value = prato.categoria;

    // Não exibir a imagem atual, então não adicionamos nada no preview.
    document.getElementById('imagem-preview').style.display = 'none'; // Esconde a imagem de pré-visualização.

    // Ao enviar o formulário, atualiza o prato
    document.getElementById('form-edit-prato').onsubmit = async function(event) {
        event.preventDefault();

        // Obter dados do formulário
        const updatedPrato = {
            nome: document.getElementById('edit-nome').value,
            descricao: document.getElementById('edit-descricao').value,
            valor: parseFloat(document.getElementById('edit-valor').value),
            categoria: document.getElementById('edit-categoria').value,
            imagem: null // Inicialmente sem imagem
        };

        const imagemInput = document.getElementById('edit-imagem');
        const imagemFile = imagemInput.files[0];

        if (imagemFile) {
            // Se houver uma nova imagem selecionada, converte para base64
            updatedPrato.imagem = await fileToBase64(imagemFile);
        } else {
            // Caso não haja nova imagem, manter sem alteração de imagem
            updatedPrato.imagem = prato.imagem; // Não muda a imagem se não for selecionada uma nova
        }

        try {
            await db.collection('pratos').doc(id).update(updatedPrato);
            alert("Prato atualizado com sucesso!");
            carregarPratos(); // Atualiza a lista de pratos
            cancelarEdicao(); // Oculta o formulário de edição
        } catch (error) {
            console.error("Erro ao atualizar prato: ", error);
            alert("Erro ao atualizar prato.");
        }
    };
}



// Função para cancelar a edição
function cancelarEdicao() {
    document.getElementById('formulario-edicao').style.display = 'none';
}

// Carregar categorias ao iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await obterCategorias(); // Carrega as categorias
    await carregarPratos(); // Carrega todos os pratos ao iniciar
});

document.getElementById("edit-categoria").addEventListener("change", async (event) => {
    const categoriaID = event.target.value; // Obtém o ID da categoria selecionada
    await carregarPratos(categoriaID); // Carrega pratos com base no ID da categoria selecionada
});


function voltar(){
    window.location.href = "../paginas-adm/adm-cardapio.html"
}