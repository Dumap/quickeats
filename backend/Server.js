const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBY89bOyBuSZnSkDdebZwUCFFw3jL2gcEI',  // server key
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
      let reply = {status: true,
                  restos: response.json.results}
      res.send(JSON.stringify(reply))
    })
    .catch((err) => {
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

app.get("/detail", function(req, res) {
  console.log("in detail")
    let placeId = 'ChIJlfjVd0IayUwRi8rjxbMESlI'
    console.log("Place ID:", placeId)
    googleMapsClient.place({placeid: placeId}).asPromise()
    .then((response) => {
      //res.send(response.json.result)
      res.send(JSON.stringify(response))
      console.log("Result:",response.json.result)
    })
    .catch((err) => {
      res.send(err)
      console.log(err)
    });
})

app.listen(4000)
