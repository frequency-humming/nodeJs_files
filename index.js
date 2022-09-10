const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const port = 3000;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('documents'));
app.use(cors());
app.use(fileUpload());

require('./routes/routes.js')(app);

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});