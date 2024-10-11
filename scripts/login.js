//fazer com firebase
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
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  
function verSenha(){
    const senhaTxt = document.querySelector('input#senha')
    const senhaVer = document.querySelector('span#ver-senha')


    if (senhaTxt.type === 'password') {
        senhaTxt.type = 'text';
        senhaVer.textContent = 'visibility'; // olho fechado
    } else {
        senhaTxt.type = 'password';
        senhaVer.textContent = 'visibility_off'; // olho aberto
    }
}
