const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const port = 3000;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('documents'));
app.use(cors());
app.use(fileUpload());

app.get('/testing', (req,res) => {
    let token = req.get('x-api-key');
    let file = req.body.name;
    if(fs.existsSync(`${__dirname}/documents/${file}`) && token){
        const stream = fs.createReadStream(`${__dirname}/documents/${file}`);
        stream.pipe(res);
        stream.on('error',(err) => res.send('Invalid Request'));
    }else{
        return res.send('Invalid Request');
    }
});

app.post('/test', async (req, res) => {
    
    let token = req.get('x-api-key');
    let size = req.get('Content-Length');
    if(!token || size > 2000000){
        return res.send('Invalid Request');
    }
    try {

        let file = req.files.upload;
        uploadPath = __dirname + '/documents/' + file.name;
        let request = await file.mv(uploadPath);
        return res.json({'Response':'File Uploaded'});

    } catch (err){
        console.log(err);
        return res.send('Invalid Request');
    }  
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});