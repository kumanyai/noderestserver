const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();


app.get('/usuario', function (req, res) {
    // res.json('Get Usuario')

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //{estado: true} - FILTRA LOS REGISTROS CON EL ESTADO TRUE
    Usuario.find({estado : true}, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if (err){
                    return res.status(400).json({
                        ok:false,
                        err: err
                    })
                }
                //{estado: true} - CUENTA LOS REGISTROS CON EL ESTADO TRUE
                Usuario.count({estado: true}, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios: usuarios,
                        cuantos: conteo
                    })
                });
            });
});

app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });
        //SAVE ES UN METODO PROPIO DE MOOONGOSE QUE RECIBE EL ERROR Y UN USUARIO DB
        usuario.save((err, usuarioDB) => {
            //SI PASO UN ERROR MANDA EL ERROR EN FORMATO JSON
            if (err){
                return res.status(400).json({
                    ok:false,
                    err: err
                })
            }

            // usuarioDB.password = null;

            //SI ES CORRECTO PASAMOS EL JSON
            res.json({
                ok:true,
                usuario: usuarioDB
            })

        });
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
        })

    });

});

app.delete('/usuario/:id', function (req, res) {
    // res.json('Delete Usuario')
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
            if (err){
                return res.status(400).json({
                    ok:false,
                    err: err
                })
            }

            if(!usuarioBorrado){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                })
            }

            res.json({
                ok: true,
                usuario: usuarioBorrado
            });
        });
});

module.exports = app;