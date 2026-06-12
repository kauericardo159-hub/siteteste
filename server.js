const express = require('express');
const path = require('path');
const app = express();

// O Render define a variável PORT automaticamente em produção
const PORT = process.env.PORT || 3000;

// Permite que o servidor processe dados enviados em formato JSON
app.use(express.json());

// Serve os arquivos da pasta 'public' (CSS, JS, Imagens) automaticamente
app.use(express.static(path.join(__dirname, 'public')));

// ================= ROTEAMENTO DO PROJECT Z =================

// Página Inicial (Home Feed)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tela de Autenticação (Login / Cadastro por Username)
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// Painel de Monitoramento (Debug do Banco de Dados)
app.get('/console', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'console.html'));
});

// ================= TRATAMENTO DE ERROS =================

// Captura qualquer rota digitada errada e joga erro 404 customizado
app.use((req, res) => {
    res.status(404).send(`
        <div style="font-family: 'Segoe UI', sans-serif; text-align: center; margin-top: 100px; color: #e1e1e6; background-color: #121214; height: 100vh; padding-top: 20px;">
            <h1 style="color: #f75a68; font-size: 40px;">404</h1>
            <h2 style="font-weight: 500;">Página não localizada neste servidor.</h2>
            <p style="color: #8d8d99; margin-top: 15px;">Verifique o endereço digitado ou volte para a <a href="/" style="color: #04d361; text-decoration: none; font-weight: bold;">Página Inicial</a>.</p>
        </div>
    `);
});

// Inicialização oficial do servidor
app.listen(PORT, () => {
    console.log(`[🟢 SERVIDOR] Project Z rodando com sucesso na porta ${PORT}`);
});
