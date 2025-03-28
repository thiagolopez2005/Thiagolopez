// Variables Globales
let personajesDisponibles = [
    { nombre: 'Tanke', rol: 'Tanke', vida: 200, imagen: './assets/tanke.webp' },
    { nombre: 'Asesino', rol: 'Asesino', vida: 100, imagen: './assets/asesino.webp' },
    { nombre: 'Mago', rol: 'Mago', vida: 90, imagen: './assets/mago2.webp' },
    { nombre: 'Guerrero', rol: 'Guerrero', vida: 120, imagen: './assets/guerrero.webp' }
];

// Asignamos 3 vidas y guardamos el valor máximo de la vida
personajesDisponibles = personajesDisponibles.map(personaje => {
    return { ...personaje, vidas: 3, maxVida: personaje.vida };
});

let personajeJugador = null;
let personajeEnemigo = null;

// Definición de ataques por rol
const ataques = {
    'asesino': { probabilidad: 65, daño: 29, nombre: 'Danza de Hojas' },
    'tanke': { probabilidad: 50, daño: 20, nombre: 'Embestida' },
    'mago': { probabilidad: 70, daño: 30, nombre: 'Bola de Fuego' },
    'guerrero': { probabilidad: 75, daño: 30, nombre: 'Tajo Cortante' }
};

// Función para generar número aleatorio
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Función para mostrar mensaje de turno (se elimina automáticamente después de 1 segundo)
function mostrarMensajeTurno(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.position = 'fixed';
    mensajeDiv.style.top = '20px';
    mensajeDiv.style.left = '50%';
    mensajeDiv.style.transform = 'translateX(-50%)';
    mensajeDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    mensajeDiv.style.color = 'white';
    mensajeDiv.style.padding = '10px 20px';
    mensajeDiv.style.borderRadius = '8px';
    mensajeDiv.style.zIndex = '1000';
    document.body.appendChild(mensajeDiv);
    setTimeout(() => {
        mensajeDiv.remove();
    }, 1000);
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
            // Seleccionar personaje (ya con vidas y maxVida)
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
    personajeEnemigo = JSON.parse(JSON.stringify(enemigos[aleatorio(0, enemigos.length - 1)]));
    personajeEnemigo.vidas = 2;
    personajeEnemigo.maxVida = personajeEnemigo.vida;
    
    // Crear interfaz de batalla: se muestran los datos y ataques de cada personaje, y se añade el botón central "Escapa del Combate"
    const battleModal = document.createElement('div');
    battleModal.id = "battleModal";
    battleModal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div class="bg-gray-900 p-8 rounded-lg shadow-xl max-w-4xl w-full">
                <h2 class="text-3xl font-bold text-center mb-6 text-red-500">Batalla en el Coliseo de los Espíritus</h2>
                
                <div class="flex justify-between items-center mb-6">
                    <!-- Sección del Jugador -->
                    <div class="text-center w-1/3">
                        <img id="imgJugador" src="${personajeJugador.imagen}" alt="${personajeJugador.nombre}" class="mx-auto mb-4 w-48 h-48 object-cover rounded-lg">
                        <h3 class="text-2xl font-semibold">${personajeJugador.nombre}</h3>
                        <p id="vidaJugador" class="text-green-500">Vida: ${personajeJugador.vida} | Vidas: ${personajeJugador.vidas}</p>
                        <!-- Botón de ataque del jugador -->
                        <button id="ataqueJugador" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            ${ataques[personajeJugador.rol.toLowerCase()].nombre}
                        </button>
                    </div>
                    
                    <!-- Botón central para escapar del combate -->
                    <div class="text-center w-1/3">
                        <button id="escapaCombate" class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                            Escapa del Combate
                        </button>
                    </div>
                    
                    <!-- Sección del Enemigo -->
                    <div class="text-center w-1/3">
                        <img id="imgEnemigo" src="${personajeEnemigo.imagen}" alt="${personajeEnemigo.nombre}" class="mx-auto mb-4 w-48 h-48 object-cover rounded-lg">
                        <h3 id="nombreEnemigo" class="text-2xl font-semibold">${personajeEnemigo.nombre}</h3>
                        <p id="vidaEnemigo" class="text-green-500">Vida: ${personajeEnemigo.vida} | Vidas: ${personajeEnemigo.vidas}</p>
                        <!-- Visualización del ataque del enemigo -->
                        <button disabled class="mt-4 bg-red-600 text-white font-bold py-2 px-4 rounded opacity-70 cursor-not-allowed">
                            ${ataques[personajeEnemigo.rol.toLowerCase()].nombre}
                        </button>
                    </div>
                </div>
                
                <div id="registroBatalla" class="mt-6 text-center text-white max-h-40 overflow-y-auto">
                    <!-- Aquí se mostrarán los mensajes de batalla -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(battleModal);
    
    // Configurar botón de ataque del jugador
    document.getElementById('ataqueJugador').addEventListener('click', () => {
        // Deshabilitamos el botón para evitar múltiples clics
        document.getElementById('ataqueJugador').disabled = true;
        turnoJugador();
    });
    
    // Configurar botón para escapar del combate
    document.getElementById('escapaCombate').addEventListener('click', () => {
        // Oculta el modal de batalla y vuelve a la selección de personajes
        document.getElementById('battleModal').remove();
        document.getElementById('characterSelection').classList.remove('hidden');
    });
}

// Actualizar interfaz (vidas)
function actualizarInterfaz() {
    document.getElementById('vidaJugador').textContent = `Vida: ${personajeJugador.vida} | Vidas: ${personajeJugador.vidas}`;
    document.getElementById('vidaEnemigo').textContent = `Vida: ${personajeEnemigo.vida} | Vidas: ${personajeEnemigo.vidas}`;
}

// Función para generar nuevo enemigo
function spawnNuevoEnemigo() {
    const enemigos = personajesDisponibles.filter(p => p !== personajeJugador);
    personajeEnemigo = JSON.parse(JSON.stringify(enemigos[aleatorio(0, enemigos.length - 1)]));
    personajeEnemigo.vidas = 2;
    personajeEnemigo.maxVida = personajeEnemigo.vida;
    
    // Actualizar datos del enemigo en la interfaz
    document.getElementById('imgEnemigo').src = personajeEnemigo.imagen;
    document.getElementById('imgEnemigo').alt = personajeEnemigo.nombre;
    document.getElementById('nombreEnemigo').textContent = personajeEnemigo.nombre;
    
    // Actualizar el botón del enemigo (su ataque)
    const enemyButton = document.querySelector('#battleModal div.flex > div:nth-child(3) button');
    enemyButton.textContent = ataques[personajeEnemigo.rol.toLowerCase()].nombre;
    actualizarInterfaz();
    
    // Registrar mensaje de nuevo enemigo
    const registroBatalla = document.getElementById('registroBatalla');
    const mensajeElemento = document.createElement('p');
    mensajeElemento.textContent = `¡Un nuevo enemigo, ${personajeEnemigo.nombre}, ha aparecido para el combate!`;
    registroBatalla.insertBefore(mensajeElemento, registroBatalla.firstChild);
}

// Función que ejecuta el turno del jugador
function turnoJugador() {
    // Mostrar mensaje emergente sin interrumpir el flujo
    mostrarMensajeTurno("Turno del Jugador");
    const registroBatalla = document.getElementById('registroBatalla');
    let mensajes = [];
    
    // Ataque del jugador
    const ataqueJugador = ataques[personajeJugador.rol.toLowerCase()];
    const aciertaJugador = aleatorio(1, 100) <= ataqueJugador.probabilidad;
    if (aciertaJugador) {
        personajeEnemigo.vida -= ataqueJugador.daño;
        mensajes.push(`¡Tu ${personajeJugador.nombre} ataca con ${ataqueJugador.nombre} y quita ${ataqueJugador.daño} de vida a ${personajeEnemigo.nombre}!`);
    } else {
        mensajes.push(`¡Tu ${personajeJugador.nombre} falló el ataque!`);
    }
    
    // Verificar si el enemigo pierde una "vida"
    if (personajeEnemigo.vida <= 0) {
        personajeEnemigo.vidas--;
        if (personajeEnemigo.vidas > 0) {
            mensajes.push(`¡Le quitaste una vida a ${personajeEnemigo.nombre}! Vidas restantes: ${personajeEnemigo.vidas}`);
            personajeEnemigo.vida = personajeEnemigo.maxVida;
        } else {
            mensajes.push(`¡Has vencido a ${personajeEnemigo.nombre}!`);
            // Recompensa al jugador
            personajeJugador.vidas++;
            personajeJugador.vida = personajeJugador.maxVida;
            actualizarInterfaz();
            spawnNuevoEnemigo();
            mensajes.forEach(mensaje => {
                const mensajeElemento = document.createElement('p');
                mensajeElemento.textContent = mensaje;
                registroBatalla.insertBefore(mensajeElemento, registroBatalla.firstChild);
            });
            // Vuelve a habilitar el botón de ataque y termina turno
            document.getElementById('ataqueJugador').disabled = false;
            return;
        }
    }
    
    actualizarInterfaz();
    
    // Mostrar mensajes en el registro de batalla
    mensajes.forEach(mensaje => {
        const mensajeElemento = document.createElement('p');
        mensajeElemento.textContent = mensaje;
        registroBatalla.insertBefore(mensajeElemento, registroBatalla.firstChild);
    });
    
    // Después de 4 segundos, pasa el turno al enemigo
    setTimeout(turnoEnemigo, 4000);
}

// Función que ejecuta el turno del enemigo
function turnoEnemigo() {
    mostrarMensajeTurno("Turno del Enemigo");
    const registroBatalla = document.getElementById('registroBatalla');
    let mensajes = [];
    
    // Ataque del enemigo
    const ataqueEnemigo = ataques[personajeEnemigo.rol.toLowerCase()];
    const aciertaEnemigo = aleatorio(1, 100) <= ataqueEnemigo.probabilidad;
    if (aciertaEnemigo) {
        personajeJugador.vida -= ataqueEnemigo.daño;
        mensajes.push(`¡El enemigo ${personajeEnemigo.nombre} ataca con ${ataqueEnemigo.nombre} y quita ${ataqueEnemigo.daño} de vida!`);
    } else {
        mensajes.push(`¡El enemigo ${personajeEnemigo.nombre} falló su ataque!`);
    }
    
    // Verificar si el jugador pierde una "vida"
    if (personajeJugador.vida <= 0) {
        personajeJugador.vidas--;
        if (personajeJugador.vidas > 0) {
            mensajes.push(`¡Haz perdido una vida! Vidas restantes: ${personajeJugador.vidas}`);
            personajeJugador.vida = personajeJugador.maxVida;
        } else {
            mensajes.push(`¡Has perdido! Game Over`);
            mostrarMensajeFinal('¡Has perdido! Game Over');
            mensajes.forEach(mensaje => {
                const mensajeElemento = document.createElement('p');
                mensajeElemento.textContent = mensaje;
                registroBatalla.insertBefore(mensajeElemento, registroBatalla.firstChild);
            });
            return;
        }
    }
    
    actualizarInterfaz();
    
    // Mostrar mensajes del turno del enemigo
    mensajes.forEach(mensaje => {
        const mensajeElemento = document.createElement('p');
        mensajeElemento.textContent = mensaje;
        registroBatalla.insertBefore(mensajeElemento, registroBatalla.firstChild);
    });
    
    // Vuelve a habilitar el botón de ataque para el siguiente turno del jugador
    document.getElementById('ataqueJugador').disabled = false;
}

// Función para mostrar el mensaje final (Game Over o victoria)
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
        location.reload();
    });
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', configurarSeleccionPersonajes);
