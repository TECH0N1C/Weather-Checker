const express = require("express");
const bodyParser = require("body-parser");
// const axios = require("axios");
const app = express();
const https = require('https');
const port = 5000;
// const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=1ff9f5b40aa0b2aace1409e029b30339&q=Lagos&units=metric";

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){

    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    const apiKey = "1ff9f5b40aa0b2aace1409e029b30339"
    const query = req.body.cityName;
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=" + apiKey + "&q=" + query + "&units=" + unit;

    https.get(url, function(response){

        let data = "";

        response.on("data", function(chunk){

            data += chunk;
        });

        response.on("end", function(){
            const weatherAPIData = JSON.parse(data);
            const temp = weatherAPIData.list[0].main.temp;
            const weatherDate = weatherAPIData.list[0].dt_txt;
            const weatherDescription = weatherAPIData.list[0].weather[0].description;
            const weathericonCode = weatherAPIData.list[0].weather[0].icon
            const weatherIconUrl = "https://openweathermap.org/img/wn/" + weathericonCode + "@2x.png";
            const city = weatherAPIData.city.name

            // console.log(weatherAPIData);
            console.log(temp);
            console.log(weatherDate + ": " + weatherDescription);
            
            res.write("<h1>The temperature in " + city + " is " + temp + " degree Celcius.</h1>");
            res.write("<h3 style= margin-bottom:0>The weather is currently " + weatherDescription + "</h3>");
            res.write("<img src=" + weatherIconUrl + " style= width:400px;height:400px;>");
            res.send();
        });
    })
    console.log("User picked " + query + " as City");
});


// app.get("/", async(req, res)=>{

//     try{
//         const response = await axios.get(apiUrl);
//         console.log("Response body: " + response.data);
//     }
//     catch (error) {
//         console.error('Error fetching data:', error.message);
//     }
//     res.send("Server is up and running");

// });


app.listen(port, function(){
    console.log("The server has started on http://localhost:" + port);
});
