//=================
//PUERTO
//=================

process.env.PORT = process.env.PORT || 3000;

//=================
//ENTORNO
//=================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================
//VENCIMIENTO DEL TOKEN
//=================
//60 Segundos
//60 Minutos
//24 Horas
//30 Dias

process.env.CADUCIDAD_TOKEN = '48h';

//=================
//SEED
//=================
process.env.SEED =  process.env.SEED || 'token-desarrollo';


//=================
//BASE DE DATOS
//=================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

process.env.PORT = process.env.PORT || 3000;

//========================
// GOOGLE CLIENT ID
//========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '834599352485-sjnumo33rf5ofs9tlrj941kf4sgkfg37.apps.googleusercontent.com';
