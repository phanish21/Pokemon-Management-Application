const express = require('express');
const bodyParse = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pokemonRoutes = require('./routes/pokemonRoutes');

const app = express();

app.use(cors());
app.use(bodyParse.json());

app.use('/api', pokemonRoutes);

app.listen(5000);