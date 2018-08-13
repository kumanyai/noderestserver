require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); //MANDAR FUNCIONES Y QUE EL LO ARME POR NOSOTROS
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//HABILITAR LA CARPETA PUBLIC
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuracion Global de RUTAS - Maneja todas las rutas de los documentos
app.use(require('./routes/index'));

//Conexion a la Base de datos. process.env.URLDB es una variable que esta en el carhicov config
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if(err) throw err;
    console.log('Base de datos ONLINE');
});

//Escuchando el puerto que definimos en el archivo configs
app.listen(process.env.PORT, () => {
    console.log('Escuchando Puerto: ',process.env.PORT);
});