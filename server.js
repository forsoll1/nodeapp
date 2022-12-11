const express = require("express");
const mongoose = require("mongoose");
const dockerRouter = require("./routes/dockerRoutes")
const composeRouter = require("./routes/composeRoutes")
const microRouter = require("./routes/microRoutes")
const methodOverride = require('method-override')

// Haetaan Mongo:n määritykset niitä varten tehdystä tiedostosta
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");


// Express-applikaation määritystä
const app = express();
app.enable("trust proxy")
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: false}))
app.use(express.static('img'))
app.set('view engine', 'ejs')

// Yhdistetään Nodeapp Mongo-tietokantaan. Mukana retry-ominaisuus ongelmien varalta. 
const mongoURL= `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
const connectWithRetry = () => {
    mongoose
    .connect(mongoURL, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(() => console.log("Successfully connected to DB"))
    .catch((e) => {
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    })
}
connectWithRetry();

// Renderöidään aloitussivu views-kansiosta "/" osoitteessa
app.get("/", async (req, res) => {
    res.render('index')
});


// Asetetaan Express routes:t käyttöön eri verkko-osoitteisiin
app.use("/docker", dockerRouter)
app.use("/compose", composeRouter)
app.use("/micro", microRouter)


// Asetetaan applikaatio kuuntelemaan 3000-porttia
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
