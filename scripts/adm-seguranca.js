firebase.auth().onAuthStateChanged(user =>{
    if(!user){
        window.location.href = "../paginas-adm/login-adm.html"
    }
})