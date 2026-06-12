const express = require('express');
const path = require('path');
const app = express();

// O Render define a porta automaticamente através de process.env.PORT
const PORT = process.env.PORT || 3000;

// Permite que o servidor entenda JSON enviado pelo front-end
app.use(express.json());

// Serve os arquivos estáticos (HTML, CSS, JS) que vão ficar na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal: Envia o arquivo home (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a página de Login/Cadastro
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
