// Variables Globales
let personajesDisponibles = [
    { nombre: 'Tanke', rol: 'Tanke', vida: 200, imagen: './assets/tanke.webp' },
    { nombre: 'Asesino', rol: 'Asesino', vida: 100, imagen: './assets/asesino.webp' },
    { nombre: 'Mago', rol: 'Mago', vida: 90, imagen: './assets/mago2.webp' },
    { nombre: 'Guerrero', rol: 'Guerrero', vida: 120, imagen: './assets/guerrero.webp' }
];

let personajeJugador = null;
let personajeEnemigo = null;

// Función para generar número aleatorio
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Configurar selección de personajes
function configurarSeleccionPersonajes() {
    const characterCards = document.querySelectorAll('.character-card');
    
    characterCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Remover selección previa
            characterCards.forEach(c => c.classList.remove('border-4', 'border-green-500'));
            
            // Marcar selección actual
            card.classList.add('border-4', 'border-green-500');
            
            // Seleccionar personaje
            personajeJugador = personajesDisponibles[index];
            
            // Ocultar modal de personajes y mostrar modal de batalla
            document.getElementById('characterSelection').classList.add('hidden');
            iniciarBatalla();
        });
    });
}

// Iniciar batalla
function iniciarBatalla() {
    // Seleccionar enemigo aleatorio (excluyendo el personaje del jugador)
    const enemigos = personajesDisponibles.filter(p => p !== personajeJugador);
    personajeEnemigo = enemigos[aleatorio(0, enemigos.length - 1)];

    // Crear interfaz de batalla
    const battleModal = document.createElement('div');
    battleModal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div class="bg-gray-900 p-8 rounded-lg shadow-xl max-w-4xl w-full">
                <h2 class="text-3xl font-bold text-center mb-6 text-red-500">Batalla en el Coliseo de los Espíritus</h2>
                
                <div class="flex justify-between items-center mb-6">
                    <div class="text-center w-1/2">
                        <img src="${personajeJugador.imagen}" alt="${personajeJugador.nombre}" class="mx-auto mb-4 w-48 h-48 object-cover rounded-lg">
                        <h3 class="text-2xl font-semibold">${personajeJugador.nombre}</h3>
                        <p id="vidaJugador" class="text-green-500">Vida: ${personajeJugador.vida}</p>
                    </div>
                    
                    <div class="text-center w-1/2">
                        <img src="${personajeEnemigo.imagen}" alt="${personajeEnemigo.nombre}" class="mx-auto mb-4 w-48 h-48 object-cover rounded-lg">
                        <h3 class="text-2xl font-semibold">${personajeEnemigo.nombre}</h3>
                        <p id="vidaEnemigo" class="text-green-500">Vida: ${personajeEnemigo.vida}</p>
                    </div>
                </div>
                
                <div id="botonesAtaque" class="flex justify-center space-x-4">
                    <button id="ataqueAsesino" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Danza de Hojas
                    </button>
                    <button id="ataqueTanke" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Embestida
                    </button>
                    <button id="ataqueMago" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                        Bola de Fuego
                    </button>
                    <button id="ataqueGuerrero" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Tajo Cortante
                    </button>
                </div>
                
                <div id="registroBatalla" class="mt-6 text-center text-white max-h-40 overflow-y-auto">
                    <!-- Aquí se mostrarán los mensajes de batalla -->
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(battleModal);

    // Configurar botones de ataque
    configurarAtaques();
}

function configurarAtaques() {
    const botonesAtaque = document.querySelectorAll('#botonesAtaque button');
    
    botonesAtaque.forEach(boton => {
        boton.addEventListener('click', () => {
            const tipoAtaque = boton.id.replace('ataque', '').toLowerCase();
            realizarAtaque(tipoAtaque);
        });
    });
}

function realizarAtaque(tipoAtaque) {
    const registroBatalla = document.getElementById('registroBatalla');
    const vidaJugadorElement = document.getElementById('vidaJugador');
    const vidaEnemigoElement = document.getElementById('vidaEnemigo');

    // Configurar ataques y probabilidades
    const ataques = {
        'asesino': { probabilidad: 65, daño: 10, nombre: 'Danza de Hojas' },
        'tanke': { probabilidad: 50, daño: 15, nombre: 'Embestida' },
        'mago': { probabilidad: 70, daño: 30, nombre: 'Bola de Fuego' },
        'guerrero': { probabilidad: 75, daño: 25, nombre: 'Tajo Cortante' }
    };

    // Ataque del jugador
    const ataqueJugador = ataques[tipoAtaque];
    const aciertaJugador = aleatorio(1, 100) <= ataqueJugador.probabilidad;

    // Ataque del enemigo aleatorio
    const ataqueEnemigo = ataques[Object.keys(ataques)[aleatorio(0, 3)]];
    const aciertaEnemigo = aleatorio(1, 100) <= ataqueEnemigo.probabilidad;

    // Mensajes de batalla
    const mensajes = [];

    if (aciertaJugador) {
        personajeEnemigo.vida -= ataqueJugador.daño;
        mensajes.push(`¡Tu ${personajeJugador.nombre} ataca con ${ataqueJugador.nombre} y quita ${ataqueJugador.daño} de vida!`);
    } else {
        mensajes.push(`¡Tu ${personajeJugador.nombre} falló el ataque!`);
    }

    if (aciertaEnemigo) {
        personajeJugador.vida -= ataqueEnemigo.daño;
        mensajes.push(`¡El enemigo ${personajeEnemigo.nombre} ataca con ${ataqueEnemigo.nombre} y quita ${ataqueEnemigo.daño} de vida!`);
    } else {
        mensajes.push(`¡El enemigo ${personajeEnemigo.nombre} falló su ataque!`);
    }

    // Actualizar vidas
    vidaJugadorElement.textContent = `Vida: ${Math.max(0, personajeJugador.vida)}`;
    vidaEnemigoElement.textContent = `Vida: ${Math.max(0, personajeEnemigo.vida)}`;

    // Mostrar mensajes
    mensajes.forEach(mensaje => {
        const mensajeElemento = document.createElement('p');
        mensajeElemento.textContent = mensaje;
        registroBatalla.insertBefore(mensajeElemento, registroBatalla.firstChild);
    });

    // Verificar fin de juego
    verificarFinJuego();
}

function verificarFinJuego() {
    if (personajeEnemigo.vida <= 0) {
        mostrarMensajeFinal('¡Has ganado la batalla!');
    } else if (personajeJugador.vida <= 0) {
        mostrarMensajeFinal('¡Has perdido! Game Over');
    }
}

function mostrarMensajeFinal(mensaje) {
    const modalFinal = document.createElement('div');
    modalFinal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div class="bg-gray-900 p-8 rounded-lg shadow-xl text-center">
                <h2 class="text-3xl font-bold mb-6 text-red-500">${mensaje}</h2>
                <button id="reiniciarJuego" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Reiniciar Juego
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modalFinal);

    document.getElementById('reiniciarJuego').addEventListener('click', () => {
        location.reload(); // Reinicia la página
    });
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', configurarSeleccionPersonajes);