import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/AddPokemon.css';

const AddPokemon = () => {
    const { userId } = useParams();
    const [pokemonOwnerName, setPokemonOwnerName] = useState('');
    const [pokemonName, setPokemonName] = useState('');
    const [pokemonAbility, setPokemonAbility] = useState('');
    const [abilities, setAbilities] = useState([]);
    const [positionX, setPositionX] = useState('');
    const [positionY, setPositionY] = useState('');
    const [speed, setSpeed] = useState('');
    const [direction, setDirection] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            const fetchUserName = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
                    setPokemonOwnerName(response.data.name);
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            };
            fetchUserName();
        }

        axios.get('https://pokeapi.co/api/v2/pokemon-species?limit=1025')
            .then(response => {
                const names = response.data.results.map(pokemon => pokemon.name);
                setSuggestions(names.sort());
            });
    }, [userId]);

    const handlePokemonChange = async (event) => {
        const name = event.target.value;
        setPokemonName(name);

        if (name) {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const abilities = response.data.abilities.map(ability => ability.ability.name);
                setAbilities(abilities);
                setPokemonAbility('');
            } catch (error) {
                setAbilities([]);
                setPokemonAbility('');
            }
        } else {
            setAbilities([]);
            setPokemonAbility('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const pokemon = {
            name: pokemonName,
            ability: pokemonAbility,
            positionX,
            positionY,
            speed,
            direction,
        };

        await axios.post('http://localhost:5000/api/add-pokemon', {
            userId: userId || undefined,
            pokemonOwnerName: userId ? undefined : pokemonOwnerName,
            pokemon,
        });

        navigate('/list-pokemon');
    };

    return (
        <div>
            <h2>Add Pokemon for {userId ? pokemonOwnerName : 'New User'}</h2>
            <form onSubmit={handleSubmit}>
                {!userId && (
                    <div>
                        <label>Owner Name:</label>
                        <input
                            type="text"
                            value={pokemonOwnerName}
                            onChange={(e) => setPokemonOwnerName(e.target.value)}
                        />
                    </div>
                )}
                <div>
                    <label>Pokemon Name:</label>
                    <select value={pokemonName} onChange={handlePokemonChange}>
                        <option value="" disabled>Select Pokemon</option>
                        {suggestions.map((suggestion, index) => (
                            <option key={index} value={suggestion}>
                                {suggestion}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Ability:</label>
                    <select value={pokemonAbility} onChange={(ev) => setPokemonAbility(ev.target.value)}>
                        <option value="">Select Ability</option>
                        {abilities.map((ability, index) => (
                            <option key={index} value={ability}>
                                {ability}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Position X:</label>
                    <input
                        type="number"
                        value={positionX}
                        onChange={(ev) => setPositionX(ev.target.value)}
                    />
                </div>
                <div>
                    <label>Position Y:</label>
                    <input
                        type="number"
                        value={positionY}
                        onChange={(ev) => setPositionY(ev.target.value)}
                    />
                </div>
                <div>
                    <label>Speed:</label>
                    <input
                        type="number"
                        value={speed}
                        onChange={(ev) => setSpeed(ev.target.value)}
                    />
                </div>
                <div>
                    <label>Direction:</label>
                    <input
                        type="text"
                        placeholder='choose only left , right , up , down'
                        value={direction}
                        onChange={(ev) => setDirection(ev.target.value)}
                    />
                </div>
                <button type="submit">Add Pokemon</button>
            </form>
        </div>
    );
};

export default AddPokemon;
