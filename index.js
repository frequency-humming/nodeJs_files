const express = require('express');
const cors = require('cors');
var fs = require('fs');
const fileUpload = require('express-fileupload');
const port = 3000;

const app = express();
app.use(express.urlencoded({limit:2000000,extended: false}));
app.use(express.json());
app.use(express.static('documents'));
app.use(cors());
app.use(fileUpload());


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