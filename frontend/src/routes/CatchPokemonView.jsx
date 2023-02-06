import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { getPokemons, getPokemonData, searchPokemon } from "../api";
import Pagination from "../components/Pagination";
import CardCatch from "../components/CardCatch";

const loggedIn = window.localStorage.getItem("isLoggedIn");

function CatchPokemonView(user) {

  const [notFound, setNotFound] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const lastPage = () => {
    const nextPage = Math.max(page - 1, 0);
    setPage(nextPage);
  };

  const nextPage = () => {
    const nextPage = Math.min(page + 1, total - 1);
    setPage(nextPage);
  };

  window.onload = () => {
    if (loggedIn === false || loggedIn === "false") {
      navigate("/login");
    }
  };

  const fetchPokemons = useCallback(async () => {
    try {
      const data = await getPokemons(15, 15 * page);
      const promises = data.results.map(async (pokemon) => {
        return await getPokemonData(pokemon.url);
      });
      const results = await Promise.all(promises);
      setPokemons(results);
      setTotal(Math.ceil(data.count / 15));
      setNotFound(false);
    } catch (error) {}
  }, [page]);

  const onChange = async (e) => {
    e.preventDefault();
    setSearch(e.target.value.toLowerCase());
  };

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      if (search.length === 0) {
        fetchPokemons();
      } else {
        const pokemonSearch = await searchPokemon(search);
        if (pokemonSearch === undefined) {
          setNotFound(true);
          return;
        } else {
          setPokemons([pokemonSearch]);
          setPage(0);
          setTotal(1);
        }
      }
    },
    [fetchPokemons, search]
  );

  useEffect(() => {
    if (search.length === 0) {
      fetchPokemons();
    }
  }, [fetchPokemons, search]);

  return (
    <>
      <Navigation />
      <main className="container-fluid">
        <h1 className="mb-4 text-center title">
          Catch your favorites Pokemons
        </h1>
        <div className="search-btns d-flex justify-content-evenly align-items-center py-3">
          <div className="searchbar-container d-flex ">
            <div className="searchbar">
              <form className="d-flex">
                <input
                  placeholder="Buscar pokemon..."
                  className=" w-100 form-control"
                  onChange={onChange}
                />
                <button onClick={handleSearch} className="btn btn-danger ms-3">
                  Buscar
                </button>
              </form>
            </div>
          </div>

          <div className="btns-load">
            <Pagination
              page={page + 1}
              totalPages={total}
              onLeftClick={lastPage}
              onRightClick={nextPage}
            />
          </div>
        </div>

        <div className="row">
          {notFound ? (
            <div className="not-found-text">
              No se encontró el Pokemon que buscabas 😭
            </div>
          ) : (
            <div className="cards-container">
              {pokemons.map((pokemon, idx) => {
                return (
                  <CardCatch
                  key={pokemon.name}
                    pokemon={pokemon}
                    user={user}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default CatchPokemonView;
