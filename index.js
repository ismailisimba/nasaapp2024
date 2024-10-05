const express = require('express');
const path = require('path');
const formidable = require('formidable');


const port = parseInt(process.env.PORT)|| 8080;

const app = express();


const uti = require("./utilities");

const utilities = new uti();


app.use(express.static(path.join(__dirname, 'my-exoplanet-start-chart')));
app.use(express.static(path.join(__dirname, 'utilities/assets')));

app.get("/initialize",(req,res,next)=>{
    const responseData  = {};
    try{
        const x = utilities.fetchAndConvertCSV();
        responseData.x = x;
    }catch(e){
        console.error(e);
        responseData.error = e||e.message;
    }
    res.send(responseData)
})

app.get("/initialize2",(req,res,next)=>{
    const responseData  = {};
    try{
        const x = utilities.fetchAndConvertTSV();
        responseData.x = x;
    }catch(e){
        console.error(e);
        responseData.error = e||e.message;
    }
    res.send(responseData)
})

const server = app.listen(port,() => {
    console.log(`Grantman listening on port ${port}`);
  });