import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPokemon = () => {
  const { userId, pokemonId } = useParams();
  const [pokemon, setPokemon] = useState({
    name: '',
    ability: '',
    positionX: 0,
    positionY: 0,
    speed: 0,
    direction: '',
  });
  const [abilities, setAbilities] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon-species?limit=1025`)
        .then(response => {
            const names = response.data.results.map(pokemon => pokemon.name);
            setSuggestions(names.sort());
        });
}, []);

  useEffect(() => {
    const fetchPokemon = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
            const user = response.data;
            const pokemon = user.pokemons.find(p => p.id === pokemonId);
            if (pokemon) {
                setPokemon(pokemon);
            } else {
                console.error('Pokemon not found');
            }
        } catch (error) {
            console.error('Error fetching user or pokemon:', error);
        }
    };

    if (userId && pokemonId) {
        fetchPokemon();
    } else {
        console.error('User ID or Pokemon ID is missing');
    }
    }, [userId, pokemonId, navigate]);


  const handlePokemonChange = async (ev) => {
    const name = ev.target.value;
    setPokemon(prevState => ({ ...prevState, name }));

    if (name) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const abilities = response.data.abilities.map(ability => ability.ability.name);
        setAbilities(abilities);
        setPokemon(prevState => ({ ...prevState, ability: '' }));
      } catch (error) {
        setAbilities([]);
        setPokemon(prevState => ({ ...prevState, ability: '' }));
      }
    } else {
      setAbilities([]);
      setPokemon(prevState => ({ ...prevState, ability: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.put(`http://localhost:5000/api/edit-pokemon/${userId}/${pokemonId}`, { updatedPokemon: pokemon });
    navigate('/list-pokemon');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPokemon(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>Edit Pokemon</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pokemon Name:</label>
          <select value={pokemon.name} onChange={handlePokemonChange}>
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
          <select name="ability" value={pokemon.ability} onChange={handleChange}>
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
            name="positionX"
            value={pokemon.positionX}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Position Y:</label>
          <input
            type="number"
            name="positionY"
            value={pokemon.positionY}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Speed:</label>
          <input
            type="number"
            name="speed"
            value={pokemon.speed}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Direction:</label>
          <input
            type="text"
            name="direction"
            value={pokemon.direction}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Pokemon</button>
      </form>
    </div>
  );
};

export default EditPokemon;
