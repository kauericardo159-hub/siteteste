// Aguarda a página carregar
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Verifica se existe uma sessão ativa (usuário logado) no Supabase Auth
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
        // Se deu erro ou NÃO achou sessão, manda direto para a tela de login
        window.location.href = "/auth";
        return;
    }

    // Se o usuário está logado, pegamos o ID único dele gerado pelo Supabase Auth
    const usuarioId = session.user.id;

    try {
        // 2. Vai na tabela 'perfis' buscar os metadados (o @username único) desse ID
        const { data: perfil, error: perfilError } = await supabase
            .from('perfis')
            .select('username')
            .eq('id', usuarioId)
            .single(); // Traz apenas 1 registro correspondente

        if (perfilError || !perfil) {
            throw new Error("Perfil não encontrado no banco de dados.");
        }

        // 3. Injeta os dados reais na tela HTML
        document.getElementById("user-username").innerText = `@${perfil.username}`;
        document.getElementById("user-id").innerText = `ID: ${usuarioId}`;

        // 4. Esconde o "Carregando" e exibe o conteúdo da Home
        document.getElementById("loading").style.display = "none";
        document.getElementById("main-content").style.display = "flex";

    } catch (err) {
        console.error(err.message);
        alert("Erro ao carregar os dados do seu perfil.");
        // Se houver falha crítica, força o logout por segurança
        await supabase.auth.signOut();
        window.location.href = "/auth";
    }
});

// Lógica do Botão Sair (Deslogar)
document.getElementById("btn-sair").addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert("Erro ao deslogar.");
    } else {
        // Manda de volta pro login após deslogar com sucesso
        window.location.href = "/auth";
    }
});
