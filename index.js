'use strict';

var express = require('express');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var vision = require('@google-cloud/vision');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();


var apiKey = encodeURIComponent('193D8DE7A9');
var len = encodeURIComponent(3);
var url = `http://api.smmry.com/&SM_API_KEY=${apiKey}&SM_LENGTH=${len}`;


var text;
var options;


var visionClient = vision({
    projectId: 'swift-adviser-176104',
    keyFilename: 'key.json'
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/summary', upload.single('input_image'), function (req,res,next) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    var fileName = req.file.path;

    visionClient.textDetection({source: {filename: fileName}})
        .then(function (responses) {
            const detections = responses[0].textAnnotations;
            text = detections[0].description;
            options = {
                url: url,
                method: 'POST',
                form: {'sm_api_input': text}
            };

            request(options, function (err, response, body) {
                if (err) {
                    res.end(error);
                }
                else if(JSON.parse(body).sm_api_message == "TEXT IS TOO SHORT"){
                    res.end(text);
                }
                else if(JSON.parse(body).sm_api_message =="INSUFFICIENT VARIABLES"){
                    res.end('Insufficient data. Please try again');
                }
                else {
                    var summry = JSON.parse(body).sm_api_content;
                    res.end(summry);
                }
            });
        });
});


app.listen(8080, function () {
    console.log('Server running at http://127.0.0.1:8080/');
});