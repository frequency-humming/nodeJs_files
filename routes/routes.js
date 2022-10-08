const fs = require('fs');

module.exports = function(app){

    app.post('/testing', (req,res) => {
        let token = req.get('x-api-key');
        let file = req.body.name;
        if(fs.existsSync(`${__dirname}/documents/${file}`) && token){
            const stream = fs.createReadStream(`${__dirname}/documents/${file}`);
            stream.pipe(res);
            stream.on('error',(err) => res.send('Invalid Request'));
        }else{
            res.status(400);
            return res.send('Invalid Request');
        }
    });  
    app.post('/test', async (req, res) => {
        
        let token = req.get('x-api-key');
        let size = req.get('Content-Length');
        if(!token || size > 2000000){
            res.status(400);
            return res.send('Invalid Request');
        }
        try {
    
            let file = req.files.upload;
            uploadPath = __dirname + '/documents/' + file.name;
            let request = await file.mv(uploadPath);
            return res.json({'Response':'File Uploaded'});
    
        } catch (err){
            res.status(400);
            return res.send('Invalid Request');
        }  
    });
    //significantly slower than the stream path -> adding an average of 1 second to 1 an a half seconds delay in response
    //no errors with 200 to 300 parallel users during 2 seconds
    app.post('/testtest', (req,res) => {
        let token = req.get('x-api-key');
        let file = req.body.name;
        if(fs.existsSync(`${__dirname}/documents/${file}`) && token){
            fs.readFile(`${__dirname}/documents/${file}`, (err,data) => {
                return res.send(Buffer.from(data).toString('base64'));
            });
        }else{
            res.status(400);
            return res.send('Invalid Request');
        }
    });
}