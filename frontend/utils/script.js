const dots = document.querySelectorAll('.dot');
const message_loading = document.getElementById('message_loading');

// Animación página de carga

function animacionCarga() {

    let number_dot = -1;
    let number_message = 0;

    const messages_loading = [
        { message: "Cargando usuarios..." },
        { message: "Pintando portadas..." },
        { message: "Buscando películas..." },
        { message: "Escribiendo reseñas..." }
    ];

    const interval_dots = setInterval(() => {
        dots.forEach(dot => {
            dot.style.marginTop = "0px";
        });

        setTimeout(() => {
            dots[number_dot].style.marginTop = "-5px";
        }, 200);
        

        if(number_dot >= 3) {
            number_dot = 0;
        }else {
            number_dot++;
        };

    }, 500);

    const interval_messages = setInterval(() => {
        number_message++;
        message_loading.textContent = messages_loading[number_message].message;

        if(number_message >= 3) {
            clearInterval(interval_messages);
            setTimeout(() => {
                const loading_page = document.getElementById('loading_page');
                const login_page = document.getElementById('login_page');
                loading_page.style.display = "none";
                login_page.style.display = "flex";
                clearInterval(interval_dots);
            }, 2000);
        };
    }, 1000);
};

animacionCarga();

// Formulario Login

const formulario_login = document.getElementById('loginForm');
const API_URL = 'https://localhost:5000/api';

formulario_login.addEventListener("submit", function(event) {

    event.preventDefault(); // Evitamos el envío por defecto del formulario

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error_message');

    console.log({ email, password });

    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.success) {
            localStorage.setItem('usuarioId', data.usuarioId);
            localStorage.setItem('nombreUsuario', data.nombre);
            window.location.href = "html/inicio.html";
        }else {
            errorMessage.textContent = "Correo electrónico o contraseña incorrectos";
        }
    })
    .catch(error => {
        console.error("Error al iniciar sesión:", error);
        errorMessage.textContent = "Hubo un problema con el servidor";
    });
});
