import axios from "axios";

export const getPokemons = async (limit = 25, offset = 0) => {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await axios.get(url);
    const data = response;
    return data.data;
  } catch (error) {}
};

export const searchPokemon = async (pokemon) => {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await axios.get(url);
    const data = response;
    return data.data;
  } catch (error) {}
};

export const getEnemy = async (pokemon) => {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await axios.get(url);
    const data = response;
    return data.data;
  } catch (error) {}
};

export const getPokemonData = async (url) => {
  try {
    const response = await axios(url);
    const data = response;
    return data.data;
  } catch (error) {}
};

export const pokemonsMoves = async (url) => {
  try {
    const response = await axios(url);
    const data = response;
    return data.data;
  } catch (error) {}
};
  