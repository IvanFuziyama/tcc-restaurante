const clientId = 'aea9be82-3c38-40ff-8112-c3254f919008'; // Substitua pelo seu Client ID
const clientSecret = 'jph7xcj72lyr735jlz52xqcxzou5zorc066tljcmefvzxzcw1e81zkby2tnetvl4ydx63t3o3d7be72k2u0w2vstr7giby5u0c6'; // Substitua pelo seu Client Secret

async function authenticate() {
    const response = await fetch('https://api.ifood.com.br/v2/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret
        })
    });
    
    if (!response.ok) {
        throw new Error('Falha na autenticação');
    }

    const data = await response.json();
    return data.access_token;
}

async function fetchCatalog(token) {
    const response = await fetch('https://api.ifood.com.br/v2/catalog', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar o catálogo');
    }

    return await response.json();
}

function displayCatalog(products) {
    const itemsContainer = document.querySelector('.itensContainer');
    itemsContainer.innerHTML = ''; // Limpa o conteúdo existente

    products.forEach(product => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'itens';
        itemDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p>${product.description || 'Descrição não disponível.'}</p>
            <p>R$${product.price.toFixed(2)}</p>
            <div>
                <img src="${product.imageUrl || 'placeholder.png'}" alt="${product.name}">
            </div>
        `;
        itemsContainer.appendChild(itemDiv);
    });
}

async function loadCatalog() {
    try {
        const token = await authenticate();
        const catalogData = await fetchCatalog(token);
        displayCatalog(catalogData.products); // Altere conforme a estrutura do seu retorno
    } catch (error) {
        console.error(error);
    }
}

window.onload = loadCatalog;