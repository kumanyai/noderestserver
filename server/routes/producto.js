const express = require('express');

let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

const app = express();
const Producto = require('../models/producto');

//============================
// Obtener todos los productos
//============================

app.get('/producto', verificaToken, (req,res) => {
    //TRAE TODOS LOS PRODUCTOS
    //populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0; //Paginado y sino viene el valor sera 0
    desde = Number(desde); //Convertimos el valor desde a un numero

    Producto.find({disponible: true}) //Cargamos todos los productos pero solo los que estan disponibles
            .skip(desde) //Utilizar y saltar la pagina
            .limit(5) //Mostrar los registros por pagina
            .populate('usuario', 'nombre email') //OBTIENE UN OBJECT ID DEL MODELO Y LE PASAMOS LOS PARAMETROS QUE SE MUESTREN EN LA COSULTA DEL MODELO PRODUCTO.JS
            .populate('categoria', 'descripcion') //OBTIENE UN OBJECT ID DEL MODELO Y LE PASAMOS LOS PARAMETROS QUE SE MUESTREN EN LA COSULTA DEL MODELO PRODUCTO.JS
            .exec((err,productos) => {

                if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                })

            });


});

//============================
// Obtener un producto por ID
//============================

app.get('/producto/:id', (req,res) => {
    //populate: usuario categoria
    //paginado
    let id = req.params.id //Obtenemos el ID

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec( (err, productoDB) => {

            if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(!productoDB){ //POR SI NO EXISTE UN PRODUCTO DB OSEA SI EL ID NO EXISTE
                return res.status(400).json({
                    ok: false,
                    err:{
                        message:'El ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })

    });

});

//============================
// BUSCAR PRODUCTOS
//============================

app.get('/producto/buscar/:termino', verificaToken,(req, res) => { //Ppnemos "Buscar" para no confundirla con la que pide el ID y necesitamos el "Termina" de lo que se desea buscar

    let termino = req.params.termino; //Obtenemos el termino
    let regex = new RegExp(termino, 'i'); //RegExp es una funcion de javacript, creamos una expresion regular a partir del termino y le mandamos una 'i' para que sea sensible a las mayusculas y minusculas

    Producto.find({nombre:regex}) //Mandamos el regex para que sea una busqueda mas accesible
        .populate('categoria', 'nombre')
        .exec((err,producto) => {

            if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
               ok:true,
               producto
            });
        });
});

//============================
// Crear un nuevo producto
//============================

app.post('/producto/', verificaToken, (req,res) => {
    //Grabar el usuario
    //Grabar una categoria del listado de categoria

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });

});

//============================
// Actualizar el producto
//============================

app.put('/producto/:id', verificaToken, (req,res) => {
    //Actualizar productos

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){ //POR SI NO EXISTE UN PRODUCTO DB OSEA SI EL ID NO EXISTE
            return res.status(500).json({
                ok: false,
                err:{
                    message:'El ID no existe'
                }
            });
        }

        //ACTUALIZAMOS LOS DATOS QUE DESEAMOS SI SALE CORRECTO
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => { //GUARDAMOS LOS DATOS ACTUALIZADOS

            if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                producto: productoGuardado
            })
        });
    })
});

//============================
// Borrar un producto
//============================

app.delete('/producto/:id', verificaToken, (req,res) => {
    //Grabar el usuario
    //Grabar una categoria del listado de categoria
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'ID NO EXISTE'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            })
        });
    });
});

module.exports = app;