const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Base de datos conectada 24/7"))
  .catch(err => console.error(err));

// Esquema de Mensajes y Chats
const mensajeSchema = new mongoose.Schema({
    remitente: String,
    destinatario: String,
    texto: String,
    timestamp: { type: Date, default: Date.now }
});
const Mensaje = mongoose.model('Mensaje', mensajeSchema);

// Rutas de la API
app.get('/mensajes', async (req, res) => {
    const mensajes = await Mensaje.find();
    res.json(mensajes);
});

app.post('/mensajes', async (req, res) => {
    const nuevoMensaje = new Mensaje(req.body);
    await nuevoMensaje.save();
    res.status(201).json(nuevoMensaje);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
