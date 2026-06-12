document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. Checa o estado da sessão local no navegador
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError || !session) {
            console.warn("Nenhuma sessão ativa detectada. Redirecionando para login.");
            window.location.replace("/auth");
            return;
        }

        const usuarioId = session.user.id;

        // 2. Consulta os metadados do perfil na tabela pública
        const { data: perfil, error: perfilError } = await supabaseClient
            .from('perfis')
            .select('username')
            .eq('id', usuarioId)
            .maybeSingle(); // Evita travar se retornar vazio

        if (perfilError || !perfil) {
            throw new Error("Seu registro de @username não foi localizado no banco de dados.");
        }

        // 3. Renderiza os dados limpando ameaças de scripts maliciosos (XSS)
        document.getElementById("user-username").textContent = `@${perfil.username}`;
        document.getElementById("user-id").textContent = `ID: ${usuarioId}`;

        // 4. Alterna visibilidade de telas
        document.getElementById("loading").style.display = "none";
        document.getElementById("main-content").style.display = "flex";

    } catch (err) {
        console.error("Erro na inicialização da Home:", err.message);
        alert(`Erro de Autenticação: ${err.message}`);
        
        // Força limpeza de resíduos de sessão quebrada e ejeta
        await supabaseClient.auth.signOut();
        window.location.replace("/auth");
    }
});

// Deslogar
document.getElementById("btn-sair").addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        alert("Erro técnico ao encerrar sessão: " + error.message);
    }
    window.location.replace("/auth");
});
