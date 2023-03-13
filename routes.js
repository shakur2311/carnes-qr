const express = require('express');
const router = express.Router();
const routerAuth = express.Router();
const loginController = require('./controllers/auth/loginController');
const homeController = require('./controllers/admin/homeController');
const verController = require('./controllers/admin/verController');
const multer = require('multer');

//MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/perfil-image')
    },
    filename: function (req, file, cb) {
        req.filename = req.body.nombreInput+' '+req.body.apellidoInput+ '-' + Date.now()+'.png'
        cb(null, req.filename)
    }
});
const multerNewImageProfile = multer({storage})

//login
router.get('/',loginController.index);
router.post('/',loginController.login);


//home

routerAuth.get('/',homeController.index);
routerAuth.post('/',multerNewImageProfile.single("imagenInput"),homeController.crear);
routerAuth.get('/ver',verController.index);

module.exports = {router,routerAuth};