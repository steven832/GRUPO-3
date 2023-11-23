const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 27017;

// Middleware para analizar datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la conexión a MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'señal_de_estilo';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Conexión a la base de datos
client.connect(err => {
    if (err) {
        console.error('Error de conexión a la base de datos', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');

    // Definición de la colección (tabla) en la base de datos
    const collection = client.db(dbName).collection('mensajes');

    // Ruta para manejar la solicitud del formulario de "Contáctanos"
    app.post('/enviar-comentario', (req, res) => {
        const { nombre, correo, mensaje } = req.body;

        // Insertar el comentario en la base de datos
        collection.insertOne({ nombre, correo, mensaje }, (err, result) => {
            if (err) {
                console.error('Error al insertar el comentario en la base de datos', err);
                return res.status(500).send('Error interno del servidor');
            }

            console.log('Comentario insertado correctamente en la base de datos');
            res.send('Comentario enviado con éxito');
        });
    });
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
