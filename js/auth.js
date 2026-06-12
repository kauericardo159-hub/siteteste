// Captura dos elementos do HTML
const formLogin = document.getElementById('form-login');
const formCadastro = document.getElementById('form-cadastro');
const subtitulo = document.getElementById('auth-subtitulo');

// Links para alternar entre as telas de Login e Cadastro
document.getElementById('ir-para-cadastro').addEventListener('click', (e) => {
    e.preventDefault();
    formLogin.style.display = 'none';
    formCadastro.style.display = 'flex';
    subtitulo.innerText = 'Crie seu perfil único abaixo';
});

document.getElementById('ir-para-login').addEventListener('click', (e) => {
    e.preventDefault();
    formCadastro.style.display = 'none';
    formLogin.style.display = 'flex';
    subtitulo.innerText = 'Entre na sua conta para conversar';
});

// ================= LÓGICA DE CADASTRO =================
formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('cad-username').value.trim();
    const email = document.getElementById('cad-email').value.trim();
    const senha = document.getElementById('cad-senha').value;

    // REGEX: Aceita apenas letras minúsculas (a-z), números (0-9), hífen (-) e underline (_)
    const regexUsername = /^[a-z0-9_-]+$/;

    // Validação rígida do username no front-end
    if (!regexUsername.test(username)) {
        alert("O @ escolhido é inválido!\nUse apenas letras minúsculas, números, '_' ou '-'. Não use letras maiúsculas, espaços ou fontes modificadas.");
        return;
    }

    // Altera o texto do botão para indicar processamento
    const btnSubmit = formCadastro.querySelector('.btn-auth');
    btnSubmit.innerText = "Criando conta...";
    btnSubmit.disabled = true;

    try {
        // 1. Cria o usuário no sistema de Autenticação do Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: senha
        });

        if (authError) throw authError;

        // Recupera o ID Único gerado pelo Supabase Auth
        const uuidUnico = authData.user.id;

        // 2. Salva o ID único e o username na nossa tabela pública 'perfis'
        const { error: perfilError } = await supabase
            .from('perfis')
            .insert([
                { id: uuidUnico, username: username }
            ]);

        if (perfilError) {
            // Se o username já existir, o Supabase vai rejeitar por causa do 'UNIQUE'
            if (perfilError.code === '23505') {
                throw new Error("Este @ de usuário já está sendo usado por outra pessoa!");
            }
            throw perfilError;
        }

        alert("Conta criada com sucesso! Você será redirecionado para a Home.");
        window.location.href = "/"; // Envia o usuário logado para a Home

    } catch (error) {
        alert("Falha no cadastro: " + error.message);
        btnSubmit.innerText = "Criar minha conta";
        btnSubmit.disabled = false;
    }
});

// ================= LÓGICA DE LOGIN =================
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;

    const btnSubmit = formLogin.querySelector('.btn-auth');
    btnSubmit.innerText = "Entrando...";
    btnSubmit.disabled = true;

    try {
        // Realiza o login no Supabase
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: senha
        });

        if (error) throw error;

        // Se o login der certo, joga para a Home
        window.location.href = "/";

    } catch (error) {
        alert("Erro ao entrar: " + error.message);
        btnSubmit.innerText = "Entrar";
        btnSubmit.disabled = false;
    }
});
