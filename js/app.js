//Variables

const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargarEventListener();
function cargarEventListener() {
  //Agregar un curso al carrito presionando 'Agregar al carrito'
  listaCursos.addEventListener("click", agregarCursos);

  //Eliminar cursos del carrito de comprar
  carrito.addEventListener("click", eliminarCurso);

  //Sincroniza los cursos del local storage con articulos carrito
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
  })

  //Vaciar completamente el carrito de compras
  vaciarCarrito.addEventListener("click", () => {
      articulosCarrito = []; //Reseteamos el arreglo 
      generarCarritoHTML(); //Limpiamos el HTML ya que no hay nada que generar, queda vacío 
  })
}

// ! Funciones

// ~ Agregamos cursos al carrito
function agregarCursos(e) {
  e.preventDefault(); //Prevenimos que la página se desplace hacia arriba

  //Verificamos si #lista-cursos contiene la clase .agregar-carrito
  //para saber si el usuario dio clic en el boton de agregar carrito
  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSelected = e.target.parentElement.parentElement; //Hacemos un traversing desde el boton al contenedor .card
    leerDatosCurso(cursoSelected);
  }
}

// ~ Eliminamos cursos del carrito
function eliminarCurso(e) {
  console.log(e.target);
  if (e.target.classList.contains("borrar-curso")) {
    const cursoID = e.target.getAttribute("data-id"); //Extraemos el atributo data-id para identifcar el curso
    
    // Actualizamos el arreglo con filter para sacar los cursos que se eliminan
    articulosCarrito = articulosCarrito.filter(curso => {
        if (curso.id === cursoID) {
            if (curso.cantidad > 1) { // Si la cantidad es mayor a uno, disminuimos en uno la cantidad
                curso.cantidad--;
                return curso;
            }
            else { //Si solo hay un elemento, eliminamos el curso del carrito
                delete curso;
            }
        } else {
            return curso;
        }
    })
    generarCarritoHTML();
}
}
// ~ Lee el contenido del HTML al que le dimo clic y extrae la información del curso
function leerDatosCurso(curso) {
  // Crear un objeto que contiene la información del curso
  const infoCurso = {
    image: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector("span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  //Comprobamos si un elemento ya existe en el arreglo
  const courseExist = articulosCarrito.some(
    (curso) => curso.id === infoCurso.id
  );
  // Si el curso ya est´´a previamente en el arreglo se entra en el if y se aumenta la cantidad
  if (courseExist) {
    //Actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; //Retornamos los cursos duplicados con aumento en la cantidad
      } else {
        return curso; //Retorna los cursos que no están duplicados
      }
    });
    articulosCarrito = [...cursos];
  } else {
    //Agregamos el curso al carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  generarCarritoHTML();
  //   console.log(articulosCarrito);
}

// ~ Generar el HTML de carrito de comprar en la página
function generarCarritoHTML() {
  //Limpiamos el HTML del tbody para evitar las duplicaciones al agregar nuevos cursos
  clearPrevHTML();
  //Insertamos el HTML con la info de los cursos en el carrito de comprar
  articulosCarrito.forEach((curso) => {
    const row = document.createElement("tr");
    const { image, titulo, precio, cantidad, id } = curso;
    row.innerHTML = `
            <td>
                <img src="${image}" width="100">
            </td>
            <td>
                ${titulo}
            </td>
            <td>
                ${precio}
            </td>
            <td>
                ${cantidad}
            </td>
            <td>
                <a href="#" class="borrar-curso" data-id=${id}> X </a>
            </td>

        `;
    contenedorCarrito.appendChild(row);
  });

  // Agregamos función para almacenar los cursos agregados al carrito al local storage
  sincronizarStorage();
}

// ~ Eliminar los cursos previos del tbody
function clearPrevHTML() {
  //Forma lenta
  contenedorCarrito.innerHTML = "";

  //Mejor forma para limpiar los hijos de un tag HTML
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito))
}