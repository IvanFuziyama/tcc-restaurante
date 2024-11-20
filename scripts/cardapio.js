// Adicione 'type="module"' ao seu script no HTML para usar importações ES6
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

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

// Função para carregar categorias do Firestore
async function carregarCategorias() {
    const categoriaRef = collection(db, "categorias");
    
    try {
      // Criação de uma opção inicial "Filtrar"
      const categoriaSelect = document.getElementById("categoria");
      const opcaoFiltrar = document.createElement("option");
      opcaoFiltrar.value = "";
      opcaoFiltrar.textContent = "Filtrar";
      categoriaSelect.appendChild(opcaoFiltrar); // Adiciona a opção "Filtrar" ao select
      
      const categoriaSnapshot = await getDocs(categoriaRef);
      const categoriaList = categoriaSnapshot.docs.map(doc => doc.data().nome); // Supondo que o campo da categoria seja 'nome'
      
      // Preencher o <select> com as categorias
      categoriaList.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        categoriaSelect.appendChild(option);
      });
      
    } catch (error) {
      console.error("Erro ao carregar categorias: ", error);
    }
  }
  

// Carregar as categorias assim que o script for executado
carregarCategorias();