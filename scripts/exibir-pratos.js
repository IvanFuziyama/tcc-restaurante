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

document.addEventListener('DOMContentLoaded', async () => {
    await carregarCategoriasFiltrar();  // Carregar categorias para filtro
    await carregarCategoriasEditar();   // Carregar categorias para edição
    
    // Adicionar listener para o filtro de categoria
    const categoriaFiltrarSelect = document.getElementById("categoria-filtrar");
    if (categoriaFiltrarSelect) {
        categoriaFiltrarSelect.addEventListener("change", async function() {
            const categoriaId = this.value;  // Obtém o ID da categoria selecionada
            await carregarPratos(categoriaId);  // Carregar pratos dessa categoria
        });
    }
    
    // Adicionar listener para a edição de prato
    const categoriaEditarSelect = document.getElementById("categoria-editar");
    if (categoriaEditarSelect) {
        categoriaEditarSelect.addEventListener("change", async function() {
            const categoriaId = this.value;  // Obtém a categoria escolhida para o prato
            // Atualizar a categoria do prato no Firebase (isso vai acontecer quando salvar a edição)
        });
    }
});


// Função para carregar as categorias no filtro
async function carregarCategoriasFiltrar() {
    const categoriasRef = db.collection('categorias');
    const snapshot = await categoriasRef.get();

    const categoriaFiltrarSelect = document.getElementById('categoria-filtrar');
    categoriaFiltrarSelect.innerHTML = '<option value="">Selecione uma Categoria</option>'; // Limpa antes de adicionar novas

    snapshot.forEach(doc => {
        const categoria = doc.data();

        const option = document.createElement('option');
        option.value = doc.id;  // ID da categoria
        option.textContent = categoria.nome;  // Nome da categoria

        categoriaFiltrarSelect.appendChild(option);
    });
}

// Função para carregar as categorias na edição de prato
async function carregarCategoriasEditar() {
    const categoriasRef = db.collection('categorias');
    const snapshot = await categoriasRef.get();

    const categoriaEditarSelect = document.getElementById('categoria-editar');
    categoriaEditarSelect.innerHTML = '<option value="">Selecione uma Categoria</option>'; // Limpa antes de adicionar novas

    snapshot.forEach(doc => {
        const categoria = doc.data();

        const option = document.createElement('option');
        option.value = doc.id;  // ID da categoria
        option.textContent = categoria.nome;  // Nome da categoria

        categoriaEditarSelect.appendChild(option);
    });
}

// Função para carregar os pratos (com filtragem, se necessário)
async function carregarPratos(categoriaId = "") {
    const listaPratos = document.getElementById('lista-pratos');
    listaPratos.innerHTML = ''; // Limpa a lista de pratos

    let pratosSnapshot;

    // Se uma categoria foi selecionada, filtra os pratos por essa categoria
    if (categoriaId) {
        pratosSnapshot = await db.collection('pratos').where("categoria", "==", categoriaId).get();
    } else {
        pratosSnapshot = await db.collection('pratos').get(); // Carrega todos os pratos
    }

    pratosSnapshot.forEach(doc => {
        const prato = doc.data();
        const pratoElement = document.createElement('div');
        pratoElement.classList.add('prato');
        pratoElement.dataset.id = doc.id;

        // Formatação das informações do prato
        const informacoesElement = document.createElement('div');
        informacoesElement.classList.add('informacoes');
        informacoesElement.innerHTML = `
            <h2>${prato.nome}</h2>
            <p><strong>Descrição:</strong> ${prato.descricao}</p>
            <p><strong>Valor:</strong> R$ ${prato.valor.toFixed(2)}</p>
        `;

        // Criação da imagem do prato com tamanho fixo
        const imagemElement = document.createElement('img');
        if (prato.imagem) {
            imagemElement.src = prato.imagem;  // URL da imagem do prato
            imagemElement.alt = prato.nome;
            imagemElement.style.width = "200px";  // Ajusta o tamanho da imagem
            imagemElement.style.height = "auto";  // Mantém a proporção
        } else {
            imagemElement.src = 'caminho/para/imagem/padrao.jpg';  // Caso não tenha imagem
            imagemElement.alt = 'Imagem não disponível';
        }

        // Botões de editar e excluir
        const botaoEditar = document.createElement('button');
        botaoEditar.innerText = "Editar";
        botaoEditar.classList.add('botao-editar');
        botaoEditar.onclick = () => editarPrato(doc.id, prato);

        const botaoExcluir = document.createElement('button');
        botaoExcluir.innerText = "Excluir";
        botaoExcluir.classList.add('botao-excluir');
        botaoExcluir.onclick = () => excluirPrato(doc.id);

        // Adiciona os botões e a imagem
        informacoesElement.appendChild(botaoEditar);
        informacoesElement.appendChild(botaoExcluir);
        pratoElement.appendChild(informacoesElement);
        pratoElement.appendChild(imagemElement);

        listaPratos.appendChild(pratoElement);  // Adiciona o prato à lista
    });
}

// Função para excluir o prato
async function excluirPrato(id) {
    try {
        await db.collection('pratos').doc(id).delete();
        alert("Prato excluído com sucesso!");
        carregarPratos(); // Atualiza a lista de pratos
    } catch (error) {
        console.error("Erro ao excluir prato: ", error);
        alert("Erro ao excluir prato.");
    }
}


// Função para converter imagem para Base64
function converterImagemParaBase64(imagemInput) {
    return new Promise((resolve, reject) => {
        const file = imagemInput.files[0];
        const reader = new FileReader();
        
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        
        if (file) {
            reader.readAsDataURL(file); // Lê a imagem como base64
        } else {
            reject("Nenhuma imagem selecionada");
        }
    });
}

// Função para editar prato e realizar a atualização no Firestore
async function editarPrato(idPrato, prato) {
    // Preencher os campos do formulário com os dados do prato
    document.getElementById("edit-nome").value = prato.nome;
    document.getElementById("edit-descricao").value = prato.descricao;
    document.getElementById("edit-valor").value = prato.valor;

    await carregarCategoriasEditar();
    const categoriaEditarSelect = document.getElementById("categoria-editar");
    categoriaEditarSelect.value = prato.categoria;
    
    document.getElementById("formulario-edicao").style.display = 'block';

    const formEditPrato = document.getElementById('form-edit-prato');
    formEditPrato.onsubmit = async function(event) {
        event.preventDefault();
        
        const nome = document.getElementById('edit-nome').value;
        const descricao = document.getElementById('edit-descricao').value;
        const valor = parseFloat(document.getElementById('edit-valor').value);
        const categoriaId = document.getElementById('categoria-editar').value;
        
        const imagemInput = document.getElementById('edit-imagem');
        let novaImagemBase64 = prato.imagem || null;

        // Se uma nova imagem for escolhida, converta para Base64
        if (imagemInput.files.length > 0) {
            try {
                novaImagemBase64 = await converterImagemParaBase64(imagemInput);
            } catch (error) {
                console.error("Erro ao converter imagem:", error);
                alert("Erro ao converter a imagem. Tente novamente.");
                return;
            }
        }

        if (!nome || !descricao || !valor || !categoriaId) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        try {
            const pratoRef = db.collection('pratos').doc(idPrato);
            await pratoRef.update({
                nome: nome,
                descricao: descricao,
                valor: valor,
                categoria: categoriaId,
                imagem: novaImagemBase64,  // Salva a imagem como Base64
            });
            alert("Prato atualizado com sucesso!");
            fecharFormularioEdicao();
            carregarPratos();  // Recarrega a lista de pratos
        } catch (error) {
            console.error("Erro ao atualizar prato:", error);
            alert("Erro ao atualizar prato. Tente novamente.");
        }
    };
}


// Função para fechar o formulário de edição
function fecharFormularioEdicao() {
    document.getElementById("formulario-edicao").style.display = 'none';
    document.getElementById('form-edit-prato').reset();  // Limpa os campos do formulário
}


// Função para cancelar a edição
function cancelarEdicao() {
    document.getElementById('formulario-edicao').style.display = 'none';
}

// Função para voltar
function voltar() {
    window.location.href = "../paginas-adm/adm-cardapio.html";
}
    