// Configuração Global de Conexão com o Banco de Dados
const SUPABASE_URL = "https://bdidmnhjololaamnxrlc.supabase.co";
const SUPABASE_KEY = "sb_publishable_Qq_4xTnK9jvOqSuvAUi1VQ_XRoyS6Tv";

// Verifica se a biblioteca injetada pela CDN no HTML existe antes de usá-la
if (typeof supabase === 'undefined') {
    console.error("ERRO CRÍTICO: A biblioteca do Supabase não foi carregada pelo HTML antes deste script!");
}

// Inicializa a instância que será herdada por toda a aplicação utilizando a janela global do navegador (window)
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
