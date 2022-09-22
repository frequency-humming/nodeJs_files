const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const port = 3000;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('documents'));
app.use(fileUpload());
app.use(cors({
    origin: 'https://www.*.my.salesforce.com'
  }));

require('./routes/routes.js')(app);

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});