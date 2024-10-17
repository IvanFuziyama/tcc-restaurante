//nao esta funcionando, é possível acessar sem ter um login
//resolver depois
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
firebase.initializeApp(firebaseConfig);

// Verifica o estado de autenticação
firebase.auth().onAuthStateChanged(user => {
    console.log(user); // Adicione esta linha para verificar o objeto do usuário
    if (!user) {
        // Se não houver usuário logado, redireciona para a página de login
        window.location.href = "../paginas-adm/login-adm.html";
    } else {
        // Se o usuário estiver logado, exibe o email na página
        const userEmail = user.email;
        document.getElementById('email').innerText = userEmail; // Exibe o email na página
    }
});