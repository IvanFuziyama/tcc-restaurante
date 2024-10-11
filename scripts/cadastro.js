    
const firebaseConfig = {
    apiKey: "AIzaSyCbgUdVBog-R0DmIZi0mG51_uuhDfnWj4c",
    authDomain: "yaki-bb90f.firebaseapp.com",
    projectId: "yaki-bb90f",
    storageBucket: "yaki-bb90f.appspot.com",
    messagingSenderId: "1025023938370",
    appId: "1:1025023938370:web:de4f3190bd0d76d36102db",
    measurementId: "G-Y3NNNQ1004"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  function cadastrar(){
    const email = document.querySelector('input#email').value;
    const senha = document.querySelector('input#senha').value;

    const confirmarSenha = document.querySelector('input#confirmar-senha').value;
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
        alert("Seus dados foram cadastrados com sucesso!");
        document.querySelector('input#email').value = '';
        document.querySelector('input#senha').value = '';
        document.querySelector('input#confirmar-senha').value = '';
    })
    .catch((error) => {
        alert("Falha ao cadastrar: " + error.message);
    });
}