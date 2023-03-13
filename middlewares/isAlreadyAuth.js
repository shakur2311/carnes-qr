const isAlreadyAuth = (req,res,next)=>{
    if(!req.session.usuario){
        next();
    }else{
        res.redirect('/home')
    }
}

module.exports = isAlreadyAuth;