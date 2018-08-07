//=================
//PUERTO
//=================
<<<<<<< HEAD
process.env.PORT = process.env.PORT || 3000;

//=================
//ENTORNO
//=================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================
//BASE DE DATOS
//=================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb://cafe-user:cafe-user123@ds113942.mlab.com:13942/cafe'
}

process.env.URLDB = urlDB;
=======
process.env.PORT = process.env.PORT || 3000;
>>>>>>> origin/master
