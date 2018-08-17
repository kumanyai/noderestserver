const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs'); //EXISTE YA POR DEFECTO EN NODE.JS
const path = require('path'); //EXISTE YA POR DEFECTO EN NODE.JS

// default options
app.use(fileUpload()); // Todos los archivos que se carguen caen dentro de req.files -- transforma lo que se está subiendo en un objeto llamado file

app.put('/upload/:tipo/:id', function(req, res) { //Sea lo que subamos al servidor tiene que ser /upload - Es un servicio put porque nos permite cargar las imagens de los productos como los usuarios por ende pedirmos el argumento ":tipo" y tenemos que saber que usuario o que producto actualizar para eso el argumento ":id"

    //Obetenemos el tipo y el id del lado de la peticion request
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files){ //VALIDACION - Sino vienen archivos mandamos el error 400
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Ningun archivo ha sido seleccionado'
            }
        })
    }

    //VALIDAR TIPO
    let tiposValidos = ['productos','usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) { // Barremos el arreglo con indexof tipo y lo verificamos en los tipos validos, si menor a 0 quiere decir que no lo encontro
        console.log(tipo);
        return res.status(400).json({ //Mandamos el error al no haber encontrado la extension
            ok:false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '), //Unimos las extensiones validas con join y las separamos con ,
            }
        })
    }

    // El nombre del input (le puse archivo "archivo" porque hare una peticion con postman) se usa para recuperar el archivo cargado
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.'); //Separamos el nombre de la extension con el "." en un arreglo
    let extension = nombreCortado[nombreCortado.length -1]; //Nos quedamos con el elemento del arreglo en la ultima posicion es decir con la extension del archivo

    //EXTENSIONES PERMITIDAS
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    
    if (extensionesValidas.indexOf(extension) < 0) { //indexOf nos permite buscar en el arreglo en este caso 'extension', si es menor a 0 quiere decir que no lo encontro
        return res.status(400).json({ //Mandamos el error al no haber encontrado la extension
            ok:false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '), //Unimos las extensiones validas con join y las separamos con ,
                ext: extension
            }
        })
    }

    //CAMBIAR NOMBRE AL ARCHIVO - ADJUNTAR ALGO UNICO PARA HACER PREVENIR EL CACHE DEL NAVEGADOR WEB

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //Usamos el metodo mv() para mover el archivo al directorio de nuestro servidor con el nombre que nosotros queremos
    archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err){ //POR SI SUCEDE UN ERROR AL MOMENTO DE SUBIR EL ARCHIVO
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Aqui, imagen cargada
        if (tipo ==='usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo)
        }

    });
});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {

        if(err){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no Existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });

}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB) => {

        if(err){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!productoDB){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no Existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });

    });

}

function borraArchivo(nombreImagen, tipo){

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`); //Contruimos un path en especifico
    if (fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;