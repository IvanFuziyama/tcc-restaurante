const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.appspot.com",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.querySelector('#saida_botao').addEventListener('click', function() {
    const confirmar = confirm("Tem certeza que deseja sair?");
    
    if (confirmar) {
        auth.signOut().then(() => {
            window.location.href = "../paginas-adm/login-adm.html";
        }).catch((error) => {
            console.error("Erro ao fazer logout:", error);
        });
    } else {
        console.log("Logout cancelado");
    }
});

document.querySelector('#side_botao').addEventListener('click', function(){
    document.querySelector('#sidebar').classList.toggle('open_sidebar')
})