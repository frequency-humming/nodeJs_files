const fs = require('fs');
const axios = require('axios');
let acctoken = '';

module.exports = function(app) {
    app.post('/testing', (req, res) => {
        let token = req.get('x-api-key');
        let file = req.body.name;
        if (fs.existsSync(`${__dirname}/documents/${file}`) && token) {
            const stream = fs.createReadStream(
                `${__dirname}/documents/${file}`
            );
            stream.pipe(res);
            stream.on('error', err => res.send('Invalid Request'));
        } else {
            res.status(400);
            return res.send('Invalid Request');
        }
    });
    app.post('/test', async (req, res) => {
        let token = req.get('x-api-key');
        let size = req.get('Content-Length');
        if (!token || size > 2000000) {
            res.status(400);
            return res.send('Invalid Request');
        }
        try {
            let file = req.files.upload;
            uploadPath = __dirname + '/documents/' + file.name;
            let request = await file.mv(uploadPath);
            return res.json({ Response: 'File Uploaded' });
        } catch (err) {
            res.status(400);
            return res.send('Invalid Request');
        }
    });
    app.post('/testingpattern',async (req, res) => {
        let name = req.body.filename;
        let url = req.body.url;
        let token = req.get('x-api-key');
        let size = req.get('Content-Length');
        if(!token || size > 1000000){
            res.status(400);
            return res.send('Invalid Request');
        }
        acctoken = await authReq();
        if(acctoken){
            let file = await download(name,url);
            if(file){
                console.log(file);
                res.send(file);
            }else{
                res.status(400);
                return res.send('Invalid Request URL'); 
            }
        }else{
            res.status(400);
            return res.send('Invalid Request Login');
        }
    });
    async function download(name,url) {
        let FileName = name;
        return axios({
            url: process.env.SF_INSTANCE+url,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Authorization': 'Bearer ' + acctoken
            },
            responseType: 'stream'
          })
            .then(function (response) {
              response.data.pipe(fs.createWriteStream(`${__dirname}/documents/${FileName}`));
            }).then(function(){
                return 'Completed';
            })
            .catch(function (error) {
                console.log(error);
                return 'Error';
            });
    }
    
    async function authReq() {
        var data = {
            'grant_type': 'password',
            'client_id': process.env.CONSUMER_KEY,
            'client_secret': process.env.CONSUMER_SECRET,
            'username': process.env.SF_USERNAME,
            'password': process.env.SF_PASSWORD+process.env.SF_TOKEN
          };
          var config = {
            method: 'post',
            url: process.env.SF_LOGIN_URL,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
          
          const callout = await axios(config);
          const calloutRequest = async () => {
            await callout;
          }
          return callout.data.access_token;
    }

    //significantly slower than the stream path -> adding an average of 1 second to 1 an a half seconds delay in response
    //no errors with 200 to 300 parallel users during 2 seconds
    app.post('/testtest', (req, res) => {
        let token = req.get('x-api-key');
        let file = req.body.name;
        if (fs.existsSync(`${__dirname}/documents/${file}`) && token) {
            fs.readFile(`${__dirname}/documents/${file}`, (err, data) => {
                return res.send(Buffer.from(data).toString('base64'));
            });
        } else {
            res.status(400);
            return res.send('Invalid Request');
        }
    });
};
