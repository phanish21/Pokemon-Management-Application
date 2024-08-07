import React from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import AddPokemon from "./components/AddPokemon";
import HomePage from "./components/HomePage";
import ListPokemonUser from "./components/ListPokemonUsers";
import EditPokemon from "./components/EditPokemon";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/add-Pokemon' element={<AddPokemon/>} />
        <Route path='/add-Pokemon/:userId' element={<AddPokemon/>} />
        <Route path="/" element={<HomePage/>} />
        <Route path='/list-pokemon' element={<ListPokemonUser />} />
        <Route path='/edit-pokemon/:userId/:pokemonId' element={<EditPokemon />} />
      </Routes>
    </Router>
  )
}

export default App