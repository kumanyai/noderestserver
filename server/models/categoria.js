const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator'); //IMPORTAMOS el paquete de uniqueValidator

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

//AGREGAMOS LAS RESTRICCIONES UNICAS A NUESTRO ESQUEMA PARA NO PERMITIR ITEM'S DUPLICADOS
categoriaSchema.plugin(uniqueValidator,{
    message:'{PATH} debe ser unico'
});

module.exports = mongoose.model('Categoria', categoriaSchema);