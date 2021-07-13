const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors())
app.use(express.json())


app.use(require('./controllers/auth'));
app.use(require('./controllers/recuriter'))
app.use(require('./controllers/candidate'))
app.use(require('./controllers/search'))

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>console.log(`Server is running at ${PORT}`));