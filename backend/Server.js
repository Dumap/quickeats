const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBY89bOyBuSZnSkDdebZwUCFFw3jL2gcEI',  // server key
  Promise: Promise // 'Promise' is the native constructor.
});

let express = require("express")
let cors = require("cors")
let bodyParser = require("body-parser")
let app = express()
app.use(cors())
app.use(bodyParser.raw({ type: "*/*" }))

app.get("/nearby", function(req, res) {
  console.log("in nearby")
    let location = {lat: '45.5017156', lng: '-73.5728669'}
    let radius = 5000
    console.log("location", location)
    googleMapsClient.placesNearby({location: location, radius: radius, type: 'restaurant'}).asPromise()
    .then((response) => {
      let reply = {status: true,
                  restos: response.json.results}
      //res.send(response.json.results)
      //res.send(reply)
      res.send(JSON.stringify(reply))
    })
    .catch((err) => {
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

app.get("/photo", function(req, res) {
  console.log("in photo")
    let photoId = 'CmRaAAAAHdWhFGH3GSm8QtEcj6BiSYcgXxR8AdK5gcgyp6y-HgQu4A4tLPF2XZoD-Ht_qJU8Q820tN2xssxlwAcmmi4tdHOzisU_S8DTA5S8a_BHxQsCCe_jsumHU0T4UmweTtmBEhB82BoKfCMWjV39dvi8Ll9iGhT1I3A2fkUi3YNukAkWyb8L6k3pEg'
    googleMapsClient.placesPhoto({photoreference: photoId, maxwidth: 400}).asPromise()
    .then((response) => {
      res.send(response)
      console.log("Result:",response.toString())
    })
    .catch((err) => {
      //res.send(err)
      console.log("Error", err)
    });
})

app.listen(4000)
