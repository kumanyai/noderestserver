const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} NO ES UN ROL VALIDO'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
       type: String,
       required: [true, 'El nombre es obligatorio']
   },
    email:{
        type:String,
        unique: true,
        required:[true, 'El correo es necesario']
    },
    password:{
        type:String,
        required:[true, 'la contraseña es obligatoria']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default:false
    }
});
//EXCLUIR LA CONTRASEÑA DEL JSON(NO SE MOSTRARA PERO SE GUARDARA EN LA BD)
usuarioSchema.methods.toJSON = function() {
  let user = this;
  userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

usuarioSchema.plugin(uniqueValidator,{
    message:'{PATH} debe ser unico'
});

module.exports = mongoose.model('Usuario',usuarioSchema);