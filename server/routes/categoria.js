const express = require('express');

let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

const app = express();
const Categoria = require('../models/categoria');

//=============================
// Mostrar todas las categorias
//=============================

app.get('/categoria', verificaToken, (req, res) => { //OBETNER LAS CATEGORIAS

    Categoria.find({}) //BUSCAMOS TODAS LAS CATEGORIAS DE LA BASE DE DATOS
        .sort('descripcion') //ORDENA LAS CATEGORIAS POR DESCRIPCION DE MAYOR A MENOR/ A - B
        .populate('usuario', 'nombre email') //OBTIENE UN OBJECT ID DEL MODELO Y LE PASAMOS LOS PARAMETROS QUE SE MUESTREN EN LA COSULTA DEL MODELO USUARIO.JS
        .exec((err, categorias) => { //EJECUTAMOS EL FIND Y LE MANDAMOS EL PARAMETRO 'ERR'(POR SI SUCEDE UN ERROR Y 'CATEGORIAS'(POR SI SALE CORRECTA LA CONSULTA))

            if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({//SI LLEGA HASTA ACA OBTENEMOS TODAS LAS CATEGORIAS
                ok: true,
                categorias
            })

        })

});

//=============================
// Mostrar una categoria por ID
//=============================

app.get('/categoria/:id', verificaToken, (req, res) =>{ //OBETENER CATEGORIA POR ID

    let id = req.params.id; //OBETENEMOS EL ID DE LA CATEGORIA

    Categoria.findById(id, (err, categoriaDB) => {//EJECUTAMOS LA CONSULTA BUSCAR POR ID

        if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){ //SINO SE CREA LA CATEGORIA MANDA UN ERROR 400
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({//SI LLEGA HASTA ACA OBETENEMOS LA CATEGORIA POR EL ID
            ok:true,
            categoria: categoriaDB
        })

    });

});

//=============================
// Crear nueva Categoria
//=============================

app.post('/categoria', verificaToken, (req, res) =>{ //Crear Categoria

    let body = req.body; //Obtenemos la descripcion

    let categoria = new Categoria({ //Creamos la categoria
        descripcion : body.descripcion,
        usuario : req.usuario._id,
    });

    categoria.save((err, categoriaDB) => { //Guardamos la categoria

        if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
            return res.status(500).json({
               ok: false,
               err
            });
        }

        if(!categoriaDB){ //SINO SE CREA LA CATEGORIA MANDA UN ERROR 400
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({ //SI LLEGA HASTA ACA CREA LA CATEGORIA
            ok: true,
            categoria: categoriaDB
        })

    });
});

//=============================
// Actualizar Categoria
//=============================

app.put('/categoria/:id', verificaToken, (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
      descripcion: body.descripcion
    };

    //Busca por ID y actualiza los paramentros que le mandemos
    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err,categoriaDB) => {

        if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){ //SINO SE ACTUALIZA LA CATEGORIA MANDA UN ERROR 400
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({ //SI LLEGA HASTA ACA ACTUALIZA LA CATEGORIA
            ok: true,
            categoria: categoriaDB
        })

    });

});

//=============================
// Desactivar Categoria
//=============================

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => { //ELMINAR - SOLO UN ADMINISTRADOR PUEDE BORRAR CATEGORIAS

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if(err){ //POR SI SUCEDE UN ERROR DE BASE DE DATOS SERIO SE MANDA UN ERROR 500
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){ //SINO EXISTE EL ID DE LA CATEGORIA A BOORAR MANDA UN ERROR 400
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'EL ID NO EXISTE'
                }
            });
        }

        res.json({//SI LLEGA HASTA ACA BORRA LA CATEGORIA
            ok: true,
            message: 'Categoria Borrada'
        })

    });

});

module.exports = app;