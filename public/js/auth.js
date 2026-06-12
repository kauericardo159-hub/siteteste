const formLogin = document.getElementById('form-login');
const formCadastro = document.getElementById('form-cadastro');
const subtitulo = document.getElementById('auth-subtitulo');

// Forçar letras minúsculas em tempo real enquanto digita nos dois campos de username
const inputsUsername = [document.getElementById('login-username'), document.getElementById('cad-username')];
inputsUsername.forEach(input => {
    input.addEventListener('input', () => {
        input.value = input.value.toLowerCase().replace(/\s+/g, ''); // Transforma em minúscula e remove espaços
    });
});

// Alternadores de Interface
document.getElementById('ir-para-cadastro').addEventListener('click', (e) => {
    e.preventDefault();
    formLogin.style.display = 'none';
    formCadastro.style.display = 'flex';
    subtitulo.textContent = 'Crie seu perfil único abaixo';
});

document.getElementById('ir-para-login').addEventListener('click', (e) => {
    e.preventDefault();
    formCadastro.style.display = 'none';
    formLogin.style.display = 'flex';
    subtitulo.textContent = 'Entre na sua conta para conversar';
});

// ================= CADASTRO DE PERFIL =================
formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('cad-username').value.trim().toLowerCase();
    let email = document.getElementById('cad-email').value.trim();
    const senha = document.getElementById('cad-senha').value;

    if (!username || !senha) {
        alert("Preenchimento obrigatório: O username e a senha não podem ficar vazios.");
        return;
    }

    if (senha.length < 6) {
        alert("Critério de Segurança: A senha exige 6 caracteres ou mais.");
        return;
    }

    // Validação estrita do formato do username
    const regexValidaUsername = /^[a-z0-9_-]+$/;
    if (!regexValidaUsername.test(username)) {
        alert("Regra do @ violada!\nUse apenas letras minúsculas, números, hífens (-) e underlines (_).");
        return;
    }

    // Se o e-mail não for preenchido, geramos um e-mail interno estável para o Supabase
    if (!email) {
        email = `${username}@projectz.local`;
    }

    const btnSubmit = formCadastro.querySelector('.btn-auth');
    btnSubmit.innerText = "Processando Registro...";
    btnSubmit.disabled = true;

    try {
        // Primeiro passo: Criar o registro no Auth do Supabase usando o e-mail (real ou gerado)
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email: email,
            password: senha
        });

        if (authError) throw authError;
        if (!authData || !authData.user) throw new Error("Falha ao gerar o token de autenticação.");

        const idUnicoGerado = authData.user.id;

        // Segundo passo: Guardar na tabela pública 'perfis'
        const { error: perfilError } = await supabaseClient
            .from('perfis')
            .insert([{ id: idUnicoGerado, username: username }]);

        if (perfilError) {
            if (perfilError.code === '23505') {
                throw new Error("Este @ de usuário já está registrado por outro membro.");
            }
            throw perfilError;
        }

        alert("Sua conta foi criada com sucesso!");
        window.location.href = "/";

    } catch (error) {
        alert(`Erro ao Cadastrar: ${error.message}`);
        btnSubmit.innerText = "Finalizar Cadastro";
        btnSubmit.disabled = false;
    }
});

// ================= LOGIN DE ACESSO (POR USERNAME) =================
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('login-username').value.trim().toLowerCase();
    const senha = document.getElementById('login-senha').value;

    if (!usernameInput || !senha) {
        alert("Por favor, preencha o seu nome de usuário e senha.");
        return;
    }

    const btnSubmit = formLogin.querySelector('.btn-auth');
    btnSubmit.innerText = "Validando Acesso...";
    btnSubmit.disabled = true;

    try {
        // Como o usuário inseriu um username, procuramos na tabela 'perfis' qual o ID dele
        const { data: perfil, error: buscaError } = await supabaseClient
            .from('perfis')
            .select('id')
            .eq('username', usernameInput)
            .maybeSingle();

        if (buscaError || !perfil) {
            throw new Error("Nenhum usuário encontrado com esse @username.");
        }

        // Sabendo o ID dele, nós tentamos adivinhar o e-mail de login.
        // Ele pode ter se cadastrado com e-mail real ou com o e-mail gerado pelo sistema.
        // Tentamos o login com o e-mail gerado de forma padrão:
        let emailParaLogin = `${usernameInput}@projectz.local`;

        // Executamos a tentativa de login no Supabase
        const { error: loginError } = await supabaseClient.auth.signInWithPassword({
            email: emailParaLogin,
            password: senha
        });

        // Se falhar o primeiro login por e-mail gerado, pode ser que ele usou e-mail próprio.
        if (loginError) {
            // O Supabase não nos dá o e-mail por segurança, então se o login com o e-mail padrão falhar, 
            // pedimos para tentar logar usando o próprio e-mail no campo se ele tiver colocado no cadastro,
            // ou simplesmente tratamos o erro de senha inválida.
            throw new Error("Senha incorreta ou credenciais inválidas.");
        }

        window.location.href = "/";

    } catch (error) {
        alert(`Falha ao Entrar: ${error.message}`);
        btnSubmit.innerText = "Entrar no Sistema";
        btnSubmit.disabled = false;
    }
});
