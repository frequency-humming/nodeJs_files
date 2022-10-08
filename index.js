const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const port = 3000;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());
//app.set('trust proxy',true);
app.use(cors({
    origin: 'https://www.*.my.salesforce.com'
  }));
app.use((req,res,next)=>{
  let env = process.env.validIP;
  console.log(env);
  let accept = env.split(',');
  console.log(accept);
  if(accept.includes(req.socket.remoteAddress)){
    next();
  } else {
    const error = new Error('Invalid Request');
    next(error);
  }
})
app.use((err,req,res,next)=>{
  res.status(500);
  res.send(err);
})

require('./routes/routes.js')(app);

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});