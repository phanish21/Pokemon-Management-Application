const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/data.json');

const readData = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

router.get('/users', (req, res) => {
    const data = readData();
    res.json(data.users);
});

router.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const data = readData();

    const user = data.users.find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.post('/add-pokemon', (req, res) => {
    const { pokemonOwnerName, userId, pokemon } = req.body;
    const data = readData();

    let user;

    if (userId) {
        user = data.users.find(user => user.id === userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    } else {
        const userIndex = data.users.findIndex(user => user.name === pokemonOwnerName);
        if (userIndex !== -1) {
            user = data.users[userIndex];
        } else {
            user = {
                id: uuidv4(),
                name: pokemonOwnerName,
                pokemons: []
            };
            data.users.push(user);
        }
    }

    const newPokemon = {
        id: uuidv4(),
        ...pokemon
    };

    user.pokemons.push(newPokemon);

    writeData(data);
    res.status(201).json({ message: 'Pokemon added successfully' });
});


router.put('/edit-pokemon/:userId/:pokemonId', (req, res) => {
    const { userId, pokemonId } = req.params;
    const { updatedPokemon } = req.body;
    const data = readData();

    const user = data.users.find(user => user.id === userId);
    if (user) {
        const pokemonIndex = user.pokemons.findIndex(pokemon => pokemon.id === pokemonId);
        if (pokemonIndex !== -1) {
            user.pokemons[pokemonIndex] = { ...user.pokemons[pokemonIndex], ...updatedPokemon };
            writeData(data);
            res.json({ message: 'Pokemon updated successfully' });
        } else {
            res.status(404).json({ message: 'Pokemon not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.delete('/delete-pokemon/:userId/:pokemonId', (req, res) => {
    const { userId, pokemonId } = req.params;
    const data = readData();

    const userIndex = data.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        const pokemonIndex = data.users[userIndex].pokemons.findIndex(pokemon => pokemon.id === pokemonId);
        if (pokemonIndex !== -1) {
            data.users[userIndex].pokemons.splice(pokemonIndex, 1);
            writeData(data);
            res.json({ message: 'Pokemon deleted successfully' });
        } else {
            res.status(404).json({ message: 'Pokemon not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.delete('/delete-all' , (req , res) => {
    try {
        const newData = {
            users: []
        }
        writeData(newData);
        res.status(200).send({ message: 'All users and their Pokemon deleted.' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete all users.' });
    }
})

module.exports = router;
