const mongoose = require('mongoose'); //IMPORTAMOS el paquete de Mongoosse
const uniqueValidator = require('mongoose-unique-validator'); //IMPORTAMOS el paquete de uniqueValidator

//DEFINIMOS LOS ROLES VALIDOS PARA EL CAMPO 'ROLE'
let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} NO ES UN ROL VALIDO'
};

let Schema = mongoose.Schema; // IMPORTAMOS LA CLASE ESQUEMA A UNA VARIABLE

let usuarioSchema = new Schema({ //HACEMOS UNA INSTANACIA DE SCHEMA PARA DECLARAR NUESTROS ESQUEMAS EN USUARIOSCHEMA
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

//AGREGAMOS LAS RESTRICCIONES UNICAS A NUESTRO ESQUEMA PARA NO PERMITIR ITEM'S DUPLICADOS
usuarioSchema.plugin(uniqueValidator,{
    message:'{PATH} debe ser unico'
});

//EXPORTAMOS EL NUESTRO ESQUEMA
module.exports = mongoose.model('Usuario',usuarioSchema);