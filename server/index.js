const express = require('express');
const cors = require('cors');
const treeToJSON = require('./parser');

const PORT = 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/ast', (req, res) => {
    const { code } = req.body;
    const ast = treeToJSON(code);
    res.json(ast);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

