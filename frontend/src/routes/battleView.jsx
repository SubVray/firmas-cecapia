import React, { useEffect, useState, useCallback } from "react";
import Navigation from "../components/Navigation";
import axios from "axios";
import BattleCamp from "../components/BattleCamp";
import { getPokemons, getPokemonData } from "../api";

function BattleView(user) {
  const { uid } = user.user;
  const [myPokemons, setMyPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);

  const fetchPokemons = useCallback(async () => {
    try {
      const data = await getPokemons(Math.random() * 500, 0);
      const promises = data.results.map(async (pokemon) => {
        return await getPokemonData(pokemon.url);
      });
      const results = await Promise.all(promises);
      setAllPokemons(results);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const getUrlUserPokemons = (uid) => {
    return `http://localhost:5000/api/pokemons/user/${uid}`;
  };

  const getUserPokemons = useCallback(async (uid) => {
    await axios
      .get(getUrlUserPokemons(uid))
      .then((res) => setMyPokemons(res.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getUserPokemons(uid);
  }, [getUserPokemons, uid]);

  return (
    <>
      <Navigation />
      <main className="container-fluid">
        <h1 className="mb-4 text-center title">Battle</h1>
        <BattleCamp myPokemons={myPokemons} allPokemons={allPokemons} />
      </main>
    </>
  );
}

export default BattleView;
