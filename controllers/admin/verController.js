const express = require('express');
const path = require('path');

const index = (req,res)=>{
    res.sendFile(path.join(__dirname , '../../public/views/admin/ver.html'));
}

module.exports = {index}