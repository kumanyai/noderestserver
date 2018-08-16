const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

//========================
// CONFIGURACIONES DE GOOGLE
//========================

async function verify(token) { //VERIFICA EL TOKEN
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return{
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;
    //COLOQUE UN TRY PORQUE SE ROMPE AL MANDAR UN TOKEN "VALIDO"
    try {
        googleUser = await verify(token) //  MANDAMOS A LLAMAR LA FUNCION DE GOOGLE DE VERIFY
    } catch(err){
        return res.status(403).json({
            ok:false,
            err
        })
    }

    Usuario.findOne({email:googleUser.email},(err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if(usuarioDB){ //SI EL USUARIO EXISTE EN LA BASE DE DATOS
            if (usuarioDB.google === false) { //NO SE HA AUTENTICADO POR GOOGLE
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            }else { //SI SE HA AUTENTICADO POR GOOGLE ENTONCES SE RENUEVA EL TOKEN PERSONALIZADO MIO
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
                //REGRESA LA INFORMACION CON EL TOKEN
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{ //SI EL USUARIO NO EXISTE EN LA BASE DE DATOS
            let usuario = new Usuario(); //CREAMOS UN OBJETO DEL ESQUEMA 'Usuario'

            //SE ESTABLECEN TODAS LAS PROPIEDADES
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            //SE GRABA EL USUARIO EN LA BASE DE DATOS
            usuario.save((err, usuarioDB) => {
                // SI SUCEDE UN ERROR:
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    });
                }
                //SI ALL ESTA BIEN SE GENERA UN NUEVO TOKEN
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
                //SE MANDA A IMPRIMIR COMO RESPUESTA EN UN JSON
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            })
        }
    });
});

module.exports = app;