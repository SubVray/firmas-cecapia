import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import { MyPokemons } from "../components/MyPokemons";
import PokeballLoading from "../components/Pokeball";

function DashboardView(user) {
  const navigate = useNavigate();
  const [myPokemons, setMyPokemons] = useState([]);
  const userLogin = user.user;
  const [isLoading, setIsLoading] = useState(true);


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
    getUserPokemons(userLogin.uid);
  }, [getUserPokemons, userLogin.uid]);

  setTimeout(() => {
    setIsLoading(false);
  }, 500);
  return (
    <>
      <Navigation />
      <main className="container-fluid  ">
        <h1 className="mb-5 text-center title">My Pokemons</h1>
        <div className=" container-fluid  d-flex m-auto w-100 justify-content-center">
          {isLoading ? (
            <PokeballLoading />
          ) : myPokemons <= 0 ? (
            <Link
              className="links text-center  text-decoration-none btn btn-primary catch"
              to={"/catch-pokemon"}>
              Catch pokemons
            </Link>
          ) : (
            <div className="cards-container text-center">
              {myPokemons.map(function (poke) {
                return <MyPokemons pokemon={poke} key={poke._id} />;
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default DashboardView;
