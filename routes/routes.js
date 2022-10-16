const fs = require('fs');
const axios = require('axios');
let acctoken = '';
const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN,SF_INSTANCE,CONSUMER_KEY,CONSUMER_SECRET } = process.env;
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
        if(!token){
            res.status(400);
            return res.send('Invalid Request');
        }
        acctoken = await authReq();
        if(acctoken){
            let file = await download(name,url);
            if(file){
                console.log(file);
                res.send(file);
            }
        }
    });
    async function download(name,url) {
        let FileName = name;
        return axios({
            url: SF_INSTANCE+url,
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
            'client_id': CONSUMER_KEY,
            'client_secret': CONSUMER_SECRET,
            'username': SF_USERNAME,
            'password': SF_PASSWORD+SF_TOKEN
          };
          var config = {
            method: 'post',
            url: SF_LOGIN_URL,
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
