const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const pdf = require('html-pdf');
const {google} = require('googleapis');
const qrcode = require('qrcode');
const session = require('express-session');
require('dotenv').config()
//Credenciales de autorización para googledrive api
const KEYFILEPATH = path.join(__dirname,'../../carnes-digitales-683407c701ab.json')
const SCOPES = ['https://www.googleapis.com/auth/drive'];


//Juntando archivos de autorización/credenciales, para crear una variable de autorización a utilizar
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
})




const index = (req,res)=>{
    res.sendFile(path.join(__dirname , '../../public/views/admin/index.html'));
}
const crear = async (req,res)=>{
    try {
        //Creamos variable de la hora actual
        const date = new Date().toLocaleString({ timeZone: "America/Lima" });
        const newDate = date.split(' ');
        const fecha = newDate[0].replaceAll('/','');
        const hora = newDate[1].replaceAll(':','');
        const filenamePDF = req.body.nombreInput+'-'+fecha+'-'+hora+'.pdf';
        const filenamePNG = req.body.nombreInput+'-'+fecha+'-'+hora+'.png';
        //Convertir createPDF de html-pdf a promesa
        const createPDF = (html, options) => new Promise(((resolve, reject) => {
            pdf.create(html, options).toBuffer((err, buffer) => {
                if (err !== null) {reject(err);}
                else {resolve(buffer);}
            });
        }));
        
        //Renderizamos el archivo ejs carneDigitalPDF a html con las variables
        let fileRendered = await ejs.renderFile(path.join(__dirname,'..','..','public/templates/carneDigitalPdf.ejs'),{
            codigoInput : req.body.codigoInput,
            nombreInput : req.body.nombreInput,
            apellidoInput : req.body.apellidoInput,
            correoiInput : req.body.correoiInput,
            oficinaInput: req.body.oficinaInput,
            cargoInput : req.body.cargoInput,
            imagenInput : req.filename,
            port: process.env.port
        })
        //Convertimos a pdf el html
        let pdfCreado = await createPDF(fileRendered,{timeout:'540000'});
        await fs.writeFileSync(`./public/carnes/carnes-digitales/${filenamePDF}`,pdfCreado);

        //Creamos el servicio de google drive y le pasamos el auth
        const driveService = google.drive({version:'v3',auth});
        
        let response = await driveService.files.create({
            resource: {
                'name':filenamePDF,
                'parents':['1cq2EH-utf5g2FTWCc5Q6U8oehRIO12dl']
                
            },
            media:{
                mimeType:'application/pdf',
                body: fs.createReadStream(`./public/carnes/carnes-digitales/${filenamePDF}`)
            }
        })
        //Conseguir el url del archivo y obtengo el qr
        const fileId = response.data.id;
        await driveService.permissions.create({
            fileId: fileId,
            requestBody:{
                role: 'reader',
                type: 'anyone'
        }})

        const result = await driveService.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        })

        const QR = await qrcode.toDataURL(result.data.webViewLink);
        //Renderizamos el ejs de carneQR a html
        let fileRendered2 = await ejs.renderFile(path.join(__dirname,'..','..','public/templates/carneQR.ejs'),{
            nombreInput : req.body.nombreInput,
            apellidoInput : req.body.apellidoInput,
            oficinaInput: req.body.oficinaInput,
            cargoInput : req.body.cargoInput,
            imagenInput : req.filename,
            port: process.env.port,
            imagenQR : QR
        })
        //Convirtiendo el html a pdf y guardandolo en carpeta de servidor
        let pdfCreado2 = await createPDF(fileRendered2,{type:'png',timeout:'540000',innerHeight:"300px",innerWidth:"300px"});
        await fs.writeFileSync(`./public/carnes/carnes-qr/QR-${filenamePNG}`,pdfCreado2);
        

        res.json({msg:"Carne creado!"});
    } catch (error) {
        res.json({msg:error.message});
        console.log(error);
    }
    
    
}
module.exports = {index,crear};