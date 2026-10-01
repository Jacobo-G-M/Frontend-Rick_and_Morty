const BASE_PATH_API = "https://rickandmortyapi.com/api/character"

async function obtenerPersonajes() {
  const respuesta = await fetch(`${BASE_PATH_API}`);
  const { results } = await respuesta.json()
  return results
}

function filtrarPorEstado(personajes, estado) {
  return personajes.filter(personaje => {
    return !estado ? personajes : personaje.status.toLowerCase() === estado;
  })
}

function filtrarPorEspecie(personajes, especie) {
  return personajes.filter(personaje => {
    return !especie ? personaje : personaje.species === especie;
  });
}

let personajes = [];

function aplicarFiltros() {
  const nombre = document.querySelector("#filtro-nombre").value.trim().toLowerCase();
  const estado = document.querySelector("#filtro-estado").value;
  const especie = document.querySelector("#filtro-especie").value;

  console.log(filtrarPorEstado(personajes, estado));
  

  let filtrados = filtrarPorEstado(personajes, estado);
  filtrados = filtrarPorEspecie(filtrados, especie);
  filtrados = filtrados.filter(function (personaje) {
    return personaje.name.toLowerCase().includes(nombre);
  });
  
  pintarResultados(filtrados);
}

function pintarResultados(lista) {
  const contenedor = document.querySelector("#resultados");
  document.querySelector("#contador").textContent = lista.length + " personajes encontrados";
  

  contenedor.innerHTML = lista
    .map(function (personaje) {
      return (
        '<article class="personaje-card">' +
        '<img src="' + personaje.image + '" alt="' + personaje.name + '" />' +
        "<h3>" + personaje.name + "</h3>" +
        "<p>" + personaje.status + " · " + personaje.species + "</p>" +
        "</article>"
      );
    })
    .join("");
}

document.querySelector("#filtro-nombre").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);
document.querySelector("#filtro-especie").addEventListener("change", aplicarFiltros);

obtenerPersonajes().then(function (datos) {
  personajes = datos;
  aplicarFiltros();
});