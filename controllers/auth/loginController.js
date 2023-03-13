const express = require('express');
const path = require('path');
const session = require('express-session');



const index = (req,res)=>{
    res.sendFile(path.join(__dirname , '../../public/views/login/index.html'));
}
const login = (req,res)=>{
    if(req.body.usuarioInput=="admin"){
        if(req.body.passInput=="123"){
            req.session.usuario = "admin";
            res.json({msg:"Credenciales correctas!"});

        }
        else{
            res.json({msg:"Contraseña incorrecta!"});
        }
    }else{
        res.json({msg:"Usuario incorrecto!"});
    }
}
const logout = (req,res)=>{
    req.session.destroy();
    res.redirect('/login');
}
module.exports = {index,login,logout};