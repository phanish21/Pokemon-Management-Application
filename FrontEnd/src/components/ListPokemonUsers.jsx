import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './ListPokemon.css';

const ListPokemonUser = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
        };
        fetchUsers();
    }, []);

    const handleDelete = async (userId, pokemonId) => {
        await axios.delete(`http://localhost:5000/api/delete-pokemon/${userId}/${pokemonId}`);
        setUsers(users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    pokemons: user.pokemons.filter(pokemon => pokemon.id !== pokemonId)
                };
            }
            return user;
        }));
    };

    const handleEdit = (userId, pokemonId) => {
        navigate(`/edit-pokemon/${userId}/${pokemonId}`);
    };

    const handleAddPokemon = (userId) => {
        navigate(`/add-pokemon/${userId}`);
    };

    const handleDeleteAll = async () => {
        await axios.delete(`http://localhost:5000/api/delete-all`);
        setUsers([]);
    };

    return (
        <div>
            <h2>Pokemon Users</h2>
            <button onClick={handleDeleteAll}>Delete All</button>
            <table>
                <thead>
                    <tr>
                        <th>Owner Name</th>
                        <th>Number of Pokemon</th>
                        <th>Pokemon</th>
                        <th>Abilities</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.pokemons.length}</td>
                            <td>
                                {user.pokemons.map((pokemon) => (
                                    <div key={pokemon.id}>
                                        <span>{pokemon.name}</span>
                                        <button onClick={() => handleEdit(user.id, pokemon.id)}>Edit</button>
                                        <button onClick={() => handleDelete(user.id, pokemon.id)}>Delete</button>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {user.pokemons.map((pokemon) => (
                                    <div key={pokemon.id}>
                                        <span>{pokemon.ability}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                <button onClick={() => handleAddPokemon(user.id)}>Add Pokemon</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListPokemonUser;
