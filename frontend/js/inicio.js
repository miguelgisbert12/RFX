
// Menú inferior

const iconos_menu_inferior = document.querySelectorAll('.menu_inferior');
const iconos_txt = document.querySelectorAll('.icon_txt');
const barra = document.getElementById('moving_bar');
const contenido_inicio = document.getElementById('content_main');
const contenido_add = document.getElementById('content_add');
const contenido_coleccion = document.getElementById('content_collection');

iconos_menu_inferior.forEach(icon => {
    icon.addEventListener("click", () => {
        if(icon.id != "icono_cerrar_sesion") {
            iconos_txt.forEach(txt => {
                txt.classList.add('off');
            });
    
            const textoIcono = icon.querySelector('.icon_txt');
            if(textoIcono) {
                textoIcono.classList.remove('off');
            };

            if(icon.id === "icono_inicio") {
                barra.style.marginLeft = "4%";
                contenido_add.style.display = "none";
                contenido_coleccion.style.display = "none";
                contenido_inicio.style.display = "block";
                cargarUltimasPeliculas();

            } else if(icon.id === "icono_add") {
                barra.style.marginLeft = "30%";
                contenido_inicio.style.display = "none";
                contenido_coleccion.style.display = "none";
                contenido_add.style.display = "block";

            } else if(icon.id === "icono_coleccion") {
                barra.style.marginLeft = "55%";
                contenido_inicio.style.display = "none";
                contenido_add.style.display = "none";
                contenido_coleccion.style.display = "block";
                cargarPeliculas();
            };

        }else {
            cerrarSesion();
        };
    });
});

// Cerrar sesión (aviso)

function cerrarSesion() {
    const confirmacion_cierre = document.getElementById('confirmacion_cierre');
    const btn_volver = document.getElementById('btn_volver');
    const btn_cerrar_sesion = document.getElementById('btn_cerrar_sesion');

    confirmacion_cierre.style.display = "flex";

    btn_volver.addEventListener("click", () => {
        confirmacion_cierre.style.display = "none";
    });

    btn_cerrar_sesion.addEventListener("click", () => {
        window.location.href = "../index.html";
        barra.style.marginLeft = "20px";
    })

};

// Colección de películas

// -- Actualizar número de películas guardadas

function actualizarContadorPeliculas() {
    const txt_contador = document.getElementById('num_peliculas');
    const peliculas_guardadas = document.querySelectorAll('.pelicula_guardada');
    let contador = 0;

    for (let i = 0; i < peliculas_guardadas.length; i++) {
        contador++;
    };

    if(contador > 1) {
        txt_contador.textContent = `${contador} películas`;
    }else if(contador === 1) {
        txt_contador.textContent = `${contador} película`;
    }else {
        txt_contador.textContent = `${contador} películas`;
    };
    
};

// Cargar películas

function cargarPeliculas() {

    const usuarioId = localStorage.getItem('usuarioId');

    fetch(`http://localhost:5000/api/peliculas/${usuarioId}`)
       .then(response => response.json())
       .then(peliculas => {
            const listaPeliculas = document.getElementById('mi_coleccion');
            const txt_magnifica = document.getElementById('txt_magnifica');
            const avisos_coleccion = document.getElementById('aviso_coleccion_vacia');
            const blank_space_coleccion = document.getElementById('blank_space_coleccion');
            const btn_redirect_coleccion = document.getElementById('btn_vamos_coleccion');
            const saludo_usuario = document.getElementById('saludo_inicio');
            const nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";

            listaPeliculas.innerHTML = '';


            saludo_usuario.textContent = `Hola de nuevo, ${nombreUsuario}`;

            if(peliculas.length === 0) {
                console.log("No tienes películas en tu colección");
                avisos_coleccion.style.display = "flex";
                txt_magnifica.textContent = "Aquí aparecerán las películas que vayas guardando y valorando";
                blank_space_coleccion.style.display = "none";
                btn_redirect_coleccion.addEventListener("click", () => {
                    barra.style.marginLeft = "30%";
                    contenido_inicio.style.display = "none";
                    contenido_add.style.display = "block";
                });
                return;
            }else {
                txt_magnifica.textContent = "Una colección magnífica, ¡sigue así!";
                avisos_coleccion.style.display = "none";
                blank_space_coleccion.style.display = "block";
            };

            peliculas.forEach(pelicula => {
                const li = document.createElement('li');
                li.classList.add('pelicula_guardada');
                li.setAttribute('data-id', pelicula._id);

                li.innerHTML = `
                
                    <img id="portada" src="http://localhost:5000/uploads/${pelicula.imagen}" alt="portada">
                    <section class="info_pelicula_guardada">
                        <div class="flex_box">
                            <p class="titulo_pelicula_guardada">${pelicula.nombre} (${pelicula.year})</p>
                            <div class="box_nota">
                                <h2 class="red">${pelicula.valoracion}</h2>
                            </div>
                        </div>
                        <hr class="separador_info">
                        <p class="year_pelicula_guardada white thin"><span class="red">Año de lanzamiento: </span>${pelicula.year}</p>
                        <p class="genero_pelicula_guardada white thin"><span class="red">Género: </span>${pelicula.genero}</p>
                        <p class="pais_pelicula_guardada white thin"><span class="red">País: </span>${pelicula.nacionalidad}</p>
                        <p class="direccion_pelicula_guardada white thin"><span class="red">Dirección: </span>${pelicula.direccion}</p>
                        <img src="../media/triangle.png" alt="Eliminar" class="delete_btn" data-id="${pelicula._id}"></img>
                    </section>
                `;

                li.addEventListener('click', () => {
                    editarPelicula(pelicula._id);
                });

                li.querySelector('.delete_btn').addEventListener("click", (event) => {
                    event.stopPropagation();
                    const id = event.target.getAttribute("data-id");

                    if(confirm(`¿Deseas eliminar la película "${pelicula.nombre}" de tu colección?`)) {
                        eliminarPelicula(id);
                    }
                });

                listaPeliculas.appendChild(li);
            });

            actualizarContadorPeliculas();
       })
       
       .catch(error => console.error('Error al obtener las películas:', error));
};

cargarPeliculas();

// Cargar últimas 6 películas añadidas por el usuario

function cargarUltimasPeliculas() {

    const usuarioId = localStorage.getItem("usuarioId");

    if(usuarioId) {
        
        fetch(`http://localhost:5000/api/peliculas/recientes/${usuarioId}`)
        .then(response => response.json())
        .then(peliculas => {
            const listaUltimas = document.getElementById('ultimas_valoraciones');
            const textoUltimas = document.getElementById('txt_ultimas');
            const avisos_coleccion = document.getElementById('aviso_lista_vacia');
            const blank_space_inicio = document.getElementById('blank_space_inicio');
            const btn_redirect_add = document.getElementById('btn_vamos');

            listaUltimas.innerHTML = '';

            if(peliculas.length === 0) {
                textoUltimas.textContent = "No se han encontrado películas";
                avisos_coleccion.style.display = "flex";
                blank_space_inicio.style.display = "none";
                btn_redirect_add.addEventListener("click", () => {
                    barra.style.marginLeft = "30%";
                    contenido_inicio.style.display = "none";
                    contenido_add.style.display = "block";
                });
                return;
            }else {
                textoUltimas.textContent = "Tus últimas valoraciones";
                avisos_coleccion.style.display = "none";
                blank_space_inicio.style.display = "block";
            };

            peliculas.forEach(pelicula => {
                const li = document.createElement('li');
                li.classList.add('pelicula');

                li.innerHTML = `
                    <div class ="film_img" style="background-image: url('http://localhost:5000/uploads/${pelicula.imagen}')">
                        <img src="../media/logo_rfx_empty.png" alt="logo_empty">
                        <h2 class="red">${pelicula.valoracion}</h2>
                    </div>
                    <p class="film_title">${pelicula.nombre} (${pelicula.year})</p>
                `;

                listaUltimas.appendChild(li);
            });
        })

        .catch(error => console.error('Error al obtener las últimas películas', error));

    }else {
        console.error("Error: No hay usuarioId en LocalStorage. Es necesario iniciar sesión");
    };
    
    
};

cargarUltimasPeliculas();

// Añadir película

document.getElementById('formulario_pelicula').addEventListener('submit', (event) => {
    event.preventDefault();

    const id = document.getElementById('peliculaId').value;
    const usuarioId = localStorage.getItem('usuarioId');
    console.log("Usuario guardado:", usuarioId);

    const formData = new FormData();

    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('year', document.getElementById('year').value);
    formData.append('genero', document.getElementById('genero').value);
    formData.append('nacionalidad', document.getElementById('nacionalidad').value);
    formData.append('direccion', document.getElementById('direccion').value);
    formData.append('valoracion', document.getElementById('valoracion').value);
    formData.append('usuario', usuarioId);

    const imagen = document.getElementById('imagen').files[0];
    if(imagen) {
        formData.append('imagen', imagen);
    }

    const url = id ? `http://localhost:5000/api/peliculas/${id}` : 'http://localhost:5000/api/peliculas';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        body: formData
    })

    .then(response => response.json())
    .then(() => {
        contenido_coleccion.style.display = "block";
        barra.style.marginLeft = "55%";
        iconos_txt.forEach(txt => {
            txt.classList.add('off');
        });
        const txt_coleccion = document.getElementById('txt_coleccion');
        txt_coleccion.classList.remove('off');
        cargarPeliculas();
        document.getElementById('formulario_pelicula').reset();
        document.getElementById('imagenActual').src = '';
        document.getElementById('peliculaId').value = '';
        document.getElementById('imagenActualTexto').style.display = "none";
        document.getElementById('btn_guardar').textContent = "GUARDAR";
        document.getElementById('content_add').style.display = "none";
    })
    
    .catch(error => console.error('Error:', error));
});

// Editar películas

function editarPelicula(id) {

    const usuarioId = localStorage.getItem('usuarioId');

    fetch(`http://localhost:5000/api/peliculas/${usuarioId}/${id}`)
        .then(response => response.json())
        .then(pelicula => {

            document.getElementById('peliculaId').value = pelicula._id;
            document.getElementById('nombre').value = pelicula.nombre;
            document.getElementById('year').value = pelicula.year;
            document.getElementById('genero').value = pelicula.genero;
            document.getElementById('nacionalidad').value = pelicula.nacionalidad;
            document.getElementById('direccion').value = pelicula.direccion;
            document.getElementById('valoracion').value = pelicula.valoracion;

            const imagenTexto = document.getElementById('imagenActualTexto');
            const imagenActual = document.getElementById('imagenActual');
            const inputImagen = document.getElementById('imagen');

            imagenTexto.style.display = "block";
            imagenTexto.textContent = `Imagen actual: ${pelicula.imagen}`;
            imagenActual.src = `http://localhost:5000/uploads/${pelicula.imagen}`;
            imagenActual.style.display = "block";

            inputImagen.removeAttribute('required');

            inputImagen.addEventListener('change', function() {
                if(this.files.length > 0) {
                    imagenTexto.style.display = "none";
                    imagenActual.style.display = "none";
                }
            });

            document.getElementById('btn_guardar').textContent = "ACTUALIZAR";

            document.getElementById('content_collection').style.display = "none";
            document.getElementById('content_add').style.display = "block";
        })

        .catch(error => console.error('Error al obtener los datos:', error));
};

// Eliminar películas

function eliminarPelicula(id) {
    fetch(`http://localhost:5000/api/peliculas/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if(!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || "Error desconocido al eliminar la película");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data.mensaje);
        location.reload();
    })
    .catch(error => {
        console.error('Error al eliminar la película:', error.message);
    });
};
