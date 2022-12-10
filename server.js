const express = require("express");
const mongoose = require("mongoose");
const dockerRouter = require("./routes/dockerRoutes")
const composeRouter = require("./routes/composeRoutes")
const microRouter = require("./routes/microRoutes")
const methodOverride = require('method-override')


const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");

const app = express();
app.enable("trust proxy")
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: false}))
app.use(express.static('img'))
app.set('view engine', 'ejs')


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

app.get("/", async (req, res) => {
    res.render('index')
});

app.use("/docker", dockerRouter)
app.use("/compose", composeRouter)
app.use("/micro", microRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
