const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const redis = require('redis');
const { buildSchema } = require('graphql');
const expressGraphql = require('express-graphql');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

const url = 'mongodb://localhost:27017/Final-Project';

require('./routes/routes.js')(app);

const connect = async () => {
    try{
        const db = await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
        console.log("Successfully connected to the database.");
    }catch(err){
        console.log('Could not connect to the database. Error: ' + err);
        process.exit();
    }
}

connect();

app.get('/', (req, res) => {
    res.render("index");
});

app.listen(8080, () => {
    console.log("Server Started!");
})