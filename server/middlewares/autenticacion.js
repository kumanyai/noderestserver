const jwt = require('jsonwebtoken');

//========================
// VERIFICA TOKEN
//========================

let verificaToken = (req,res,next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Token no Válido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    });
};

//========================
// VERIFICA ADMIN ROLE
//========================

let verificaAdminRole = (req,res,next) => {

    let usuario = req.usuario;
    
    if (usuario.role === "ADMIN_ROLE"){
    next();
    }else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
};

//========================
// VERIFICA TOKEN IMG
//========================

let verificaParaImagen = (req,res,next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Token no Válido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    });

};

module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaParaImagen
};
