import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        };
        fetchUsers();
    }, []);

    const handleUserChange = async (event) => {
        const userId = event.target.value;
        try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setSelectedUser(response.data);
        } catch (error) {
        console.error('Error fetching user details:', error);
        }
    };

    const movePokemon = (pokemon) => {
        if (!pokemon.isFrozen) {
        let newPositionX = parseFloat(pokemon.positionX);
        let newPositionY = parseFloat(pokemon.positionY);
        const speed = parseFloat(pokemon.speed);

        switch (pokemon.direction) {
            case 'left':
            newPositionX -= speed;
            break;
            case 'right':
            newPositionX += speed;
            break;
            case 'up':
            newPositionY -= speed;
            break;
            case 'down':
            newPositionY += speed;
            break;
            default:
            break;
        }

        const outOfBounds = newPositionX < 0 || newPositionY < 0 || newPositionX > 500 || newPositionY > 500;
        if (outOfBounds) {
            return { ...pokemon, isVisible: false };
        }

        return { ...pokemon, positionX: newPositionX, positionY: newPositionY, isVisible: true };
        }
        return pokemon;
    };

    const handlePokemonGo = () => {
        const interval = setInterval(() => {
        if (selectedUser) {
            const updatedPokemons = selectedUser.pokemons.map(pokemon => movePokemon(pokemon));
            setSelectedUser({ ...selectedUser, pokemons: updatedPokemons });
        }
        }, 1000);

        setTimeout(() => {
        clearInterval(interval);
        }, 10000);
    };

    const vanishPokemon = (pokemonId) => {
        setSelectedUser(prevState => {
        if (!prevState) return prevState;
        const updatedPokemons = prevState.pokemons.map(pokemon => {
            if (pokemon.id === pokemonId) {
            return { ...pokemon, isVisible: !pokemon.isVisible };
            }
            return pokemon;
        });
        return { ...prevState, pokemons: updatedPokemons };
        });
    };

    const freezePokemon = (pokemonId) => {
        setSelectedUser(prevState => {
        if (!prevState) return prevState;
        const updatedPokemons = prevState.pokemons.map(pokemon => {
            if (pokemon.id === pokemonId) {
            return { ...pokemon, isFrozen: !pokemon.isFrozen };
            }
            return pokemon;
        });
        return { ...prevState, pokemons: updatedPokemons };
        });
    };

    return (
        <div>
        <h2>Home Page</h2>
        <select onChange={handleUserChange}>
            <option value="">Select a User</option>
            {users.map(user => (
            <option key={user.id} value={user.id}>
                {user.name}
            </option>
            ))}
        </select>

        {selectedUser ? (
            <div>
            <h3>{selectedUser.name}'s Pokemon</h3>
            <div className="pokemon-container">
                {selectedUser.pokemons.map(pokemon => (
                <div
                    key={pokemon.id}
                    className={`pokemon ${pokemon.isVisible === false ? 'vanished' : ''} ${pokemon.isFrozen ? 'frozen' : ''} ${pokemon.isActive ? 'active' : ''}`}
                    style={{
                    left: `${pokemon.positionX}px`,
                    top: `${pokemon.positionY}px`,
                    }}
                >
                    {pokemon.name[0]}
                </div>
                ))}
            </div>
            <button onClick={handlePokemonGo}>Move All Pokemon</button>
            <button onClick={() => selectedUser.pokemons.forEach(pokemon => vanishPokemon(pokemon.id))}>
                Make All Pokemon Flee
            </button>
            <button onClick={() => selectedUser.pokemons.forEach(pokemon => freezePokemon(pokemon.id))}>
                Freeze All Pokemon
            </button>
            <h4>Pokemon List</h4>
            <ul>
                {selectedUser.pokemons.map(pokemon => (
                <li key={pokemon.id}>
                    {pokemon.name} - Position: ({pokemon.positionX}, {pokemon.positionY}), Speed: {pokemon.speed}, Direction: {pokemon.direction}, Visibility: {pokemon.isVisible ? 'Visible' : 'Hidden'}, Status: {pokemon.isFrozen ? 'Frozen' : 'Active'}
                    <button onClick={() => setSelectedUser(prevState => ({ ...prevState, pokemons: prevState.pokemons.map(p => p.id === pokemon.id ? movePokemon(p) : p) }))}>Move</button>
                    <button onClick={() => vanishPokemon(pokemon.id)}>Vanish</button>
                    <button onClick={() => freezePokemon(pokemon.id)}>Freeze</button>
                </li>
                ))}
            </ul>
            </div>
        ) : (
            <p>Please select a user to see their Pokemon.</p>
        )}
        </div>
    );
    };

    export default HomePage;
