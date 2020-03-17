const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const { buildSchema } = require('graphql');
const expressGraphql = require('express-graphql');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index");
});

app.listen(8080, (req, res) => {
    console.log("Server Started!");
})