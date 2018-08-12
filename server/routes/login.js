const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    //Almacenamos lo que envie el usuario desde del body
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        //POR SI MANDA UNA EXCEPCION LA BASE DE DATOS
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        //ERROR SI EL USUARIO ES INCORRECTO
        if(!usuarioDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }
        //ERROR SI LA CONTRASEÑA ES INCORRECTA
        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });
        }

        //GENERAR TOKEN
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        //RESPUESTA SI ES CORRECTO ALL
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    });
});








module.exports = app;