let expresion = "0";
const claveSecreta = "7779";

let chats = JSON.parse(localStorage.getItem("wa_chats")) || [
    { nombre: "Soporte Técnico", ultimo: "Bienvenido a la aplicación segura." }
];

let llamadas = JSON.parse(localStorage.getItem("wa_llamadas")) || [
    { nombre: "Soporte Técnico", tipo: "↙ Llamada entrante" }
];

let estados = JSON.parse(localStorage.getItem("wa_estados")) || [];

window.onload = function() {
    renderizarChats();
    renderizarLlamadas();
    renderizarEstados();
    sincronizarDatosUsuario();
};

function sincronizarDatosUsuario() {
    const telGuardado = localStorage.getItem("cuba_phone");
    if(telGuardado) document.getElementById("perfil-tel-txt").innerText = telGuardado;

    const nombreGuardado = localStorage.getItem("wa_nombre") || "Usuario";
    document.getElementById("perfil-nombre-txt").innerText = nombreGuardado;
    document.getElementById("ajustes-nombre-txt").innerText = nombreGuardado;
    document.getElementById("nombre-propio-menu").innerText = nombreGuardado + " (Tú)";

    const infoGuardada = localStorage.getItem("wa_info") || "Disponible";
    document.getElementById("perfil-info-txt").innerText = infoGuardada;
    document.getElementById("ajustes-info-txt").innerText = infoGuardada;

    const fotoGuardada = localStorage.getItem("wa_foto");
    if(fotoGuardada) {
        document.getElementById("perfil-foto-div").innerHTML = `<img src="${fotoGuardada}">`;
        document.getElementById("ajustes-avatar-mini").innerHTML = `<img src="${fotoGuardada}">`;
        document.getElementById("avatar-propio-menu").innerHTML = `<img src="${fotoGuardada}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
        document.getElementById("avatar-propio-menu").innerHTML = "👤";
    }
}

function actualizarPantalla() {
    document.getElementById("calc-screen").innerText = expresion;
}

function agregar(valor) {
    if (expresion === "0") expresion = valor;
    else expresion += valor;
    actualizarPantalla();
}

function limpiar() {
    expresion = "0";
    actualizarPantalla();
}

function evaluarClave() {
    if (expresion.trim() === claveSecreta) {
        const numeroGuardado = localStorage.getItem("cuba_phone");
        document.getElementById("vista-calc").classList.remove("activa");
        if (numeroGuardado) {
            document.getElementById("vista-wa").classList.add("activa");
        } else {
            document.getElementById("vista-reg").classList.add("activa");
        }
    } else {
        try {
            expresion = eval(expresion).toString();
        } catch {
            expresion = "Error";
        }
        actualizarPantalla();
        setTimeout(() => { expresion = "0"; actualizarPantalla(); }, 1200);
    }
}

function guardarRegistro() {
    const num = document.getElementById("input-phone").value.trim();
    if (num.length >= 8) {
        const telCompleto = "+53 " + num;
        localStorage.setItem("cuba_phone", telCompleto);
        sincronizarDatosUsuario();
        document.getElementById("vista-reg").classList.remove("activa");
        document.getElementById("vista-wa").classList.add("activa");
        renderizarChats();
    } else {
        alert("Ingresa un número válido de 8 dígitos para Cuba.");
    }
}

function cambiarTab(index) {
    document.querySelectorAll('.nav-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.wa-content').forEach(c => c.classList.remove('active-content'));
    document.getElementById('tab-' + index).classList.add('active');
    document.getElementById('content-' + index).classList.add('active-content');
}

function toggleMenuTresPuntos() {
    const menu = document.getElementById("menu-desplegable");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleMenuChatTresPuntos() {
    const menu = document.getElementById("menu-chat-desplegable");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function cerrarMenuSiFuera(e) {
    const menu = document.getElementById("menu-desplegable");
    if(menu && menu.style.display === "block") menu.style.display = "none";
}

function cerrarMenuChatSiFuera(e) {
    const menu = document.getElementById("menu-chat-desplegable");
    if(menu && menu.style.display === "block" && !e.target.closest('.chat-actions')) {
        menu.style.display = "none";
    }
}

function accionMenu(opcion) {
    alert("Acción: " + opcion);
    toggleMenuTresPuntos();
}

function accionMenuChat(opcion) {
    alert("Acción en chat: " + opcion);
    toggleMenuChatTresPuntos();
}

function abrirAjustes() {
    toggleMenuTresPuntos();
    document.getElementById("vista-wa").classList.remove("activa");
    document.getElementById("vista-ajustes").classList.add("activa");
}
function cerrarAjustes() {
    document.getElementById("vista-ajustes").classList.remove("activa");
    document.getElementById("vista-wa").classList.add("activa");
}
function abrirPerfil() {
    document.getElementById("vista-ajustes").classList.remove("activa");
    document.getElementById("vista-perfil").classList.add("activa");
}
function cerrarPerfil() {
    document.getElementById("vista-perfil").classList.remove("activa");
    document.getElementById("vista-ajustes").classList.add("activa");
}

function abrirNuevoChat() {
    document.getElementById("vista-wa").classList.remove("activa");
    document.getElementById("vista-nuevo-chat").classList.add("activa");
}
function cerrarNuevoChat() {
    document.getElementById("vista-nuevo-chat").classList.remove("activa");
    document.getElementById("vista-wa").classList.add("activa");
}

function abrirChatPropio() {
    const nombrePropio = (localStorage.getItem("wa_nombre") || "Usuario") + " (Tú)";
    abrirChat(nombrePropio);
}

function editarCampo(campo) {
    if(campo === 'nombre') {
        const nuevoNom = prompt("Introduce tu nuevo nombre:");
        if(nuevoNom) {
            localStorage.setItem("wa_nombre", nuevoNom);
            sincronizarDatosUsuario();
        }
    } else if(campo === 'info') {
        const nuevaInfo = prompt("Introduce tu nueva Info.:");
        if(nuevaInfo) {
            localStorage.setItem("wa_info", nuevaInfo);
            sincronizarDatosUsuario();
        }
    }
}

function cambiarFotoPerfil() { document.getElementById("file-input-perfil").click(); }
function actualizarFotoPerfil(event) {
    const archivo = event.target.files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(e) {
            localStorage.setItem("wa_foto", e.target.result);
            sincronizarDatosUsuario();
        }
        lector.readAsDataURL(archivo);
    }
}

function mostrarModalContacto() { document.getElementById("modal-contacto").style.display = "flex"; }
function cerrarModalContacto() { document.getElementById("modal-contacto").style.display = "none"; }
function guardarContacto() {
    const nombre = document.getElementById("nuevo-nombre").value.trim();
    const tel = document.getElementById("nuevo-telefono").value.trim();
    if(nombre) {
        chats.push({ nombre: nombre, ultimo: tel ? `Tel: ${tel}` : "Nuevo contacto" });
        localStorage.setItem("wa_chats", JSON.stringify(chats));
        renderizarChats();
        cerrarModalContacto();
        document.getElementById("nuevo-nombre").value = "";
        document.getElementById("nuevo-telefono").value = "";
        cerrarNuevoChat();
    } else { alert("Escribe un nombre."); }
}

function renderizarChats() {
    const contenedor = document.getElementById("lista-chats-container");
    contenedor.innerHTML = "";
    chats.forEach(chat => {
        const iniciales = chat.nombre.substring(0,2).toUpperCase();
        contenedor.innerHTML += `
            <div class="wa-item" onclick="abrirChat('${chat.nombre}')">
                <div class="wa-avatar" style="background:#00a884;">${iniciales}</div>
                <div class="wa-info">
                    <div class="wa-name-row">
                        <span class="wa-name">${chat.nombre}</span>
                        <span class="wa-time">12:00 PM</span>
                    </div>
                    <div class="wa-msg">${chat.ultimo}</div>
                </div>
            </div>
        `;
    });
}
function filtrarChats() {}

function dispararSelectorFotoChat() { document.getElementById("file-input-chat").click(); }
function dispararSelectorFotoGeneral() { document.getElementById("file-input-estado").click(); }

function enviarFotoChat(event) {
    const archivo = event.target.files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(e) {
            const area = document.getElementById("msg-area");
            const msg = document.createElement("div");
            msg.className = "msg-bubble msg-out";
            msg.innerHTML = `<img src="${e.target.result}"><div class="msg-time">Ahora</div>`;
            area.appendChild(msg);
            area.scrollTop = area.scrollHeight;
        }
        lector.readAsDataURL(archivo);
    }
}

function subirEstado() { document.getElementById("file-input-estado").click(); }
function publicarFotoEstado(event) {
    const archivo = event.target.files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(e) {
            document.getElementById("mi-estado-texto").innerText = "Estado publicado";
            const nombreUsuario = localStorage.getItem("wa_nombre") || "Mi Estado";
            
            estados.push({
                nombre: nombreUsuario,
                imagen: e.target.result,
                tiempo: "Hace un momento"
            });
            localStorage.setItem("wa_estados", JSON.stringify(estados));
            renderizarEstados();
            alert("¡Estado publicado!");
        }
        lector.readAsDataURL(archivo);
    }
}

function renderizarEstados() {
    const contenedorEstados = document.getElementById("lista-estados-container");
    contenedorEstados.innerHTML = "";
    if (estados.length > 0) {
        document.getElementById("mi-estado-texto").innerText = "Estado publicado";
        estados.forEach((est, index) => {
            contenedorEstados.innerHTML += `
                <div class="wa-item" style="justify-content: space-between;">
                    <div style="display:flex; align-items:center;">
                        <div class="wa-avatar" style="border: 2px solid #00a884; margin-right:15px;"><img src="${est.imagen}" /></div>
                        <div>
                            <div class="wa-name">${est.nombre}</div>
                            <div class="wa-msg">${est.tiempo}</div>
                        </div>
                    </div>
                    <button onclick="descargarEstado('${est.imagen}', 'Estado_${index}.jpg')" style="background:#00a884; border:none; color:#111b21; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;">📥 Descargar</button>
                </div>
            `;
        });
    } else {
        document.getElementById("mi-estado-texto").innerText = "Toca para añadir actualización";
    }
}

function descargarEstado(urlImagen, nombreArchivo) {
    const a = document.createElement('a');
    a.href = urlImagen;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert("¡Estado descargado!");
}

function renderizarLlamadas() {
    const contenedor = document.getElementById("lista-llamadas-container");
    contenedor.innerHTML = "";
    llamadas.forEach(llam => {
        contenedor.innerHTML += `
            <div class="wa-item">
                <div class="wa-avatar" style="background:#202c33;">📞</div>
                <div class="wa-info">
                    <div class="wa-name">${llam.nombre}</div>
                    <div class="wa-msg" style="color: #00a884;">${llam.tipo}</div>
                </div>
            </div>
        `;
    });
}
function menuLlamada() { alert("Menú de llamadas"); }

function abrirChat(nombre) {
    document.getElementById("chat-titulo").innerText = nombre;
    document.getElementById("chat-avatar-letra").innerText = nombre.substring(0,2).toUpperCase();
    
    document.getElementById("vista-wa").classList.remove("activa");
    document.getElementById("vista-nuevo-chat").classList.remove("activa");
    document.getElementById("vista-chat-abierto").classList.add("activa");
}
function cerrarChat() {
    document.getElementById("vista-chat-abierto").classList.remove("activa");
    document.getElementById("vista-wa").classList.add("activa");
}
function enviarMensajeTexto() {
    const input = document.getElementById("chat-input");
    const texto = input.value.trim();
    if (texto !== "") {
        const area = document.getElementById("msg-area");
        const msg = document.createElement("div");
        msg.className = "msg-bubble msg-out";
        msg.innerHTML = `${texto}<div class="msg-time">Ahora</div>`;
        area.appendChild(msg);
        input.value = "";
        area.scrollTop = area.scrollHeight;
    }
}

// --- INTEGRACIÓN CON BACKEND Y MONGODB ATLAS ---
const API_URL = "https://yhatsapp-backend.onrender.com"; 

async function enviarMensajeTexto() {
    const input = document.getElementById('chat-input');
    const texto = input.value.trim();
    if (!texto) return;

    const mensajeData = {
        remitente: "Yo",
        destinatario: "Soporte Técnico",
        texto: texto
    };

    try {
        const response = await fetch(`${API_URL}/mensajes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mensajeData)
        });

        if (response.ok) {
            input.value = "";
            cargarMensajes();
        }
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
    }
}

async function cargarMensajes() {
    try {
        const response = await fetch(`${API_URL}/mensajes`);
        const mensajes = await response.json();
        
        const area = document.getElementById('msg-area');
        if (!area) return;
        area.innerHTML = "";

        mensajes.forEach(msg => {
            const div = document.createElement('div');
            div.className = msg.remitente === "Yo" ? "msg-bubble msg-out" : "msg-bubble msg-in";
            div.innerHTML = `
                ${msg.texto}
                <div class="msg-time">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            `;
            area.appendChild(div);
        });

        area.scrollTop = area.scrollHeight;
    } catch (error) {
        console.error("Error al cargar mensajes:", error);
    }
}

// Sincronizar mensajes en tiempo real cada 3 segundos
setInterval(cargarMensajes, 3000);
