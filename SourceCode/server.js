var MongoClient = require('mongodb').MongoClient;
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
var request=require("request");

var url = 'mongodb://pallavi:pallavi123@ds135993.mlab.com:35993/asetrial1';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/getData', function (req, res) {
    var dataparam = req.query.dataParams;
    var array1 = dataparam.split(",");
    var latitude = array1[0];
    //console.log("latitude"+latitude);
    var longitude = array1[1];
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (err) throw err;
        var details, details_pos;
        var db = client.db("asetrial1");
        db.collection("rx").find().toArray(function(err, result) {
            //console.log(result)
            if (err) throw err;
            var i= 0, min =0;
            for(i = 0; i < result.length; i++) {
                var R = 6371; // Radius of the earth in km
                var dLat = deg2rad(result[i].latitude-latitude);  // deg2rad below
                var dLon = deg2rad(result[i].longitude-longitude);
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(latitude)) * Math.cos(deg2rad(result[i].latitude)) * Math.sin(dLon/2) * Math.sin(dLon/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c; // Distance in km
                console.log("value of d is" + c +" "+ a );
                if((i == 0) || (min > d)) {
                    min = d;
                    console.log("minimun is"+ min);
                    details_pos = i;
                }
            }
            min = min/1.609;
            details =  {
                "Name": result[details_pos].name,
                "Address": result[details_pos].address,
                "Distance": min
            };
            console.log( details);
            client.close();
            res.json(details);
        });
    });
});

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

var server = app.listen(5000,function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

});


