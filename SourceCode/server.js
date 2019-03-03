var MongoClient = require('mongodb').MongoClient;
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
var request=require("request");

// My mlab url
var url = 'mongodb://pallavi:pallavi123@ds135993.mlab.com:35993/asetrial1';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getData', function (req, res) {
	// Parameters send by Angular 
    var dataparam = req.query.dataParams;
	// Splitting with comma
    var array1 = dataparam.split(",");
    var latitude = array1[0];
    var longitude = array1[1];
	// Connecting to mlab
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (err) throw err;
        var details, details_pos;
		// DB name is asetrial1 and collection name is rx
        var db = client.db("asetrial1");
        db.collection("rx").find().toArray(function(err, result) {
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
				// Calculating minimum
                if((i == 0) || (min > d)) {
                    min = d;
                    console.log("minimun is"+ min);
                    details_pos = i;
                }
            }
			// Converting KMs to Miles
            min = min/1.609;
			// Packet to be sent
            details =  {
                "Name": result[details_pos].name,
                "Address": result[details_pos].address,
                "Distance": min
            };
            client.close();
			// Sending to client
            res.json(details);
        });
    });
});

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

// Our server. Listening to port 5000
var server = app.listen(5000,function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

});


