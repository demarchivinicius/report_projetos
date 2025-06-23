import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/r', express.static(path.join(__dirname, 'reports')));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

if (!fs.existsSync('reports')) fs.mkdirSync('reports');

app.post('/generate', (req, res) => {
  const data = req.body;
  const id = uuidv4().split('-')[0];
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const filePath = path.join(__dirname, 'reports', `${id}.html`);
  app.render('report', { data, dataHoje }, (err, html) => {
    if (err) return res.status(500).send('Erro ao gerar relatório.');
    fs.writeFileSync(filePath, html);
    res.json({ url: `/r/${id}.html` });
  });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));