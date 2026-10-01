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

function obtenerNombres(personajes) {
  return personajes.map(function (personaje) {
    return personaje.name;
  });
}

function buscarPorNombre(personajes, nombre) {
  return personajes.find(function (personaje) {
    return personaje.name === nombre;
  });
}

function hayPersonajesMuertos(personajes) {
  return personajes.some(function (personaje) {
    return personaje.status === "Dead";
  });
}

function todosVivos(personajes) {
  return personajes.every(function (personaje) {
    return personaje.status === "Alive";
  });
}

function ordenarPorNombre(personajes) {
  return [...personajes].sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function primeros(personajes, cantidad) {
  return personajes.slice(0, cantidad);
}

function posicionDeNombre(nombres, nombre) {
  return nombres.indexOf(nombre);
}

function contarVivos(personajes) {
  return personajes.reduce(function (total, personaje) {
    return personaje.status === "Alive" ? total + 1 : total;
  }, 0);
}

let personajes = [];

function aplicarFiltros() {
  const nombre = document.querySelector("#filtro-nombre").value.trim().toLowerCase();
  const estado = document.querySelector("#filtro-estado").value;
  const especie = document.querySelector("#filtro-especie").value;
  
  let filtrados = filtrarPorEstado(personajes, estado);
  filtrados = filtrarPorEspecie(filtrados, especie);
  filtrados = filtrados.filter(function (personaje) {
    return personaje.name.toLowerCase().includes(nombre);
  });
  
  const soloPrimeros = document.querySelector("#primeros-personajes").checked;
  if (soloPrimeros) {
    filtrados = primeros(filtrados, 10)
  }
  
  pintarResultados(filtrados);
}

function pintarResultados(lista) {
  const contenedor = document.querySelector("#resultados");
  const elementoNota = document.querySelector("#nota-estado");
  document.querySelector("#contador").textContent = lista.length + " personajes encontrados";

  if (lista.length > 0 && todosVivos(lista)) {
    elementoNota.textContent = "Todos los personajes en esta lista están vivos";
    elementoNota.className = "nota nota-vivos";
  } else {
    elementoNota.textContent = "Esta lista incluye personajes muertos o de estado desconocido";
    elementoNota.className = "nota nota-mixta";
  }

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
document.querySelector("#primeros-personajes").addEventListener("change", aplicarFiltros);

document.querySelector("#sort").addEventListener("click", function () {
  personajes = ordenarPorNombre(personajes);

  aplicarFiltros()
});

obtenerPersonajes().then(function (datos) {
  personajes = datos;
  aplicarFiltros();
});