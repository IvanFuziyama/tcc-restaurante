function clickMenu(){
    let itens = document.querySelector('nav#itens-nav')
    if(itens.style.display == 'block'){
        itens.style.display = 'none'
    }else{
        itens.style.display = 'block'
    }
}