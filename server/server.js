require('./config/config');

const express = require('express');
<<<<<<< HEAD
const mongoose = require('mongoose');

=======
>>>>>>> origin/master
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

<<<<<<< HEAD
app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if(err) throw err;

    console.log('Base de datos ONLINE');
});
//
=======
app.get('/usuario', function (req, res) {
    res.json('Get Usuario')
});

app.post('/usuario', function (req, res) {
    let body = req.body;
    if (body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        });
    }else{
        res.json({
            persona: body
        });
    }
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/usuario', function (req, res) {
    res.json('Delete Usuario')
});



>>>>>>> origin/master
app.listen(process.env.PORT, () => {
    console.log('Escuchando Puerto: ',process.env.PORT);
});