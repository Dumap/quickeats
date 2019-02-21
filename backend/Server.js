const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBY89bOyBuSZnSkDdebZwUCFFw3jL2gcEI',  // server key
  rate: {limit: 50},
  Promise: Promise // 'Promise' is the native constructor.
});

const Zomato = require('zomato.js');
const z = new Zomato('4d5b010744c51737ecf7d210fdae90ca');


let express = require("express")
let cors = require("cors")
let bodyParser = require("body-parser")
let app = express()
app.use(cors())
app.use(bodyParser.raw({ type: "*/*" }))

app.post("/nearbygo", function(req, res) {
  console.log("in google nearby")
    let params = JSON.parse(req.body);
    console.log("params", params)
    googleMapsClient.placesNearby(params).asPromise()
    .then((response) => {
      console.log("results", response.json.results)
      let reply = {status: true,
                  restos: response.json.results}
      res.send(JSON.stringify(reply))
    })
    .catch((err) => {
      console.log("err", err)
      res.send(err)
    });
})

app.post("/nearbyzo", function(req, res) {
  console.log("in zomato nearby")
    let params = JSON.parse(req.body);
    console.log("params", params)
    z.search(params)
    .then(function(data) {
      console.log(data);
      let reply = {status: true,
                  restos: data.restaurants}
      res.send(JSON.stringify(reply))
    })
    .catch(function(err) {
      res.send(err)
    });
})

app.post("/detail", function(req, res) {
  console.log("in detail")
    let params = JSON.parse(req.body);
    console.log("Place ID:", params)
    googleMapsClient.place(params).asPromise()
    .then((response) => {
      //res.send(response.json.result)
      console.log("Result:",response.json.result)
      let reply = {status: true,
          reviews: response.json.result.reviews}
      res.send(JSON.stringify(reply))
    })
    .catch((err) => {
      res.send(err)
      console.log(err)
    });
})

app.listen(4000)
