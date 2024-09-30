const { createClient } = supabase; 
const supabaseUrl = 'https://fisykjinnrgtujtbxyvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpc3lramlubnJndHVqdGJ4eXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzQ0NTk0MiwiZXhwIjoyMDQzMDIxOTQyfQ.FVB-VuAtyUgR_HAwT-Y_sqo9PS8FXJmjPYIjo2CCKEw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function Entrar() {
    const email = document.querySelector('input#email').value;
    const senha = document.querySelector('input#senha').value;

    if (email === "" || senha === "") {
        alert('Insira as informações')
        console.log('Nada digitado');
        return;
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email) // Corrija o nome da coluna para 'email'
        .single();

    if (error) {
        console.error('Erro ao buscar usuário:', error);
        alert('Email não encontrado.');
        return;
    }

    // Verifique a senha aqui (lembre-se de usar hashing na produção)
    if (data.password === senha) { // Corrija para 'senha'
        alert('Login bem-sucedido!');
        console.log('Usuário logado:', data);
        window.location.href = "../paginas-adm/adm.html"; // Redireciona após o login
    } else {
        alert('Senha incorreta.');
    }
}
function verSenha(){
    const senhaTxt = document.querySelector('input#senha')
    const senhaVer = document.querySelector('span#ver-senha')

    if (senhaTxt.type === 'password') {
        senhaTxt.type = 'text';
        senhaVer.textContent = 'visibility_off'; // Muda o ícone para "olho fechado"
    } else {
        senhaTxt.type = 'password';
        senhaVer.textContent = 'visibility'; // Muda o ícone para "olho aberto"
    }
}
