'use strict';

var express = require('express');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var vision = require('@google-cloud/vision');

var request = require('request');
var apiKey = encodeURIComponent('193D8DE7A9');
var len = encodeURIComponent(2);
var url = `http://api.smmry.com/&SM_API_KEY=${apiKey}&SM_LENGTH=${len}`;
var text;
var options;

var app = express();
var visionClient = vision({
    projectId: 'swift-adviser-176104',
    keyFilename: 'key.json'
});

var str = '<!DOCTYPE html><html><body>' +
    '<p><form method="post" action="/" enctype="multipart/form-data">' +
    '<p><input type = "file" name = "input_image"></input>' +
    '<p><input type = "submit"></input>' +
    '</form></body></html>';

app.get('/', function (req,res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(str);
});

app.post('/', upload.single('input_image'), function (req,res,next) {
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
                } else {
                    var summry = JSON.parse(body).sm_api_content;
                    res.end(summry);
                }
            });
        });
});


app.listen(8080);