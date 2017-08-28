'use strict';

var express = require('express');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var vision = require('@google-cloud/vision');
var request = require('request');
var bodyParser = require('body-parser');
var mustache = require('mustache');
var path    = require('path');
var engines = require('consolidate');


var app = express();
var apiKey = encodeURIComponent('193D8DE7A9');
var len, url, text, options, summry;


var visionClient = vision({
    projectId: 'swift-adviser-176104',
    keyFilename: 'key.json'
});


app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
//Reference: https://www.npmjs.com/package/consolidate
//Reference: https://stackoverflow.com/questions/16111386


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    res.render('index', { summ: ''});
});


fs.readFile('views/index.html', 'utf-8', function(error, data) {

    if (error) {
        res.end('Error');
        return;
    }

    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/', upload.single('input_image'), function (req,res,next) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });


        var file_name = req.file.path;
        len = encodeURIComponent(req.body.lines);
        url = `http://api.smmry.com/&SM_API_KEY=${apiKey}&SM_LENGTH=${len}`;


        //Reference: https://cloud.google.com/vision/docs/detecting-text#vision-text-detection-nodejs
        visionClient.textDetection({source: {filename: file_name}})
            .then(function (responses) {
                const detect_data = responses[0].textAnnotations;
                text = detect_data[0].description;
                options = {
                    url: url,
                    method: 'POST',
                    form: {'sm_api_input': text}
                };

                request(options, function (err, response, body) {
                    if (err) {
                        res.send(error);
                    }
                    else if(JSON.parse(body).sm_api_message === "TEXT IS TOO SHORT"){
                        res.write(mustache.render(data.toString(), {
                            'summ':text
                        }));
                    }
                    else if(JSON.parse(body).sm_api_error === "0" || JSON.parse(body).sm_api_error === "1" || JSON.parse(body).sm_api_error === "2" || JSON.parse(body).sm_api_error === "3"){
                        res.write(mustache.render(data.toString(), {
                            summ: 'Error occurred. Please try again.'
                        }));
                    }
                    else {
                        summry = JSON.parse(body).sm_api_content;
                        res.write(mustache.render(data.toString(), {
                            summ: summry
                        }));
                    }
                });
            });
    });
});


app.listen(8080, function () {
    console.log('Server running at http://127.0.0.1:8080/');
});