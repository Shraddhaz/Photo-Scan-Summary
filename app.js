'use strict';

//Required Modules for the project
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


//Required variables
var app = express();
var apiKey = encodeURIComponent('193D8DE7A9');
var len, url, text, options, summry;


/**
 * Defining the variable to connect to the Google Vision API
 * The projectID is the name of the project given on my Google Platform Console
 * keyFileName is the key.json  generated for my Google Vision API project
 * */
var visionClient = vision({
    projectId: 'swift-adviser-176104',
    keyFilename: 'key.json'
});

//Reference: https://www.npmjs.com/package/consolidate
//Reference: https://stackoverflow.com/questions/16111386
//Setting the string 'views' to go to directory '/views'
app.set('views', __dirname + '/views');


//Registering the '.html' extension with mustache (required while rendering mustache tags in .html)
app.engine('html', engines.mustache);


//Setting the template engine to use for viewing as .html file
app.set('view engine', 'html');


//Creates routes for files in folder 'public' and sends them to browser when required.
app.use(express.static(path.join(__dirname, 'public')));


//Get method for rendering the 'index.html' file with 'summ' being rendered empty
app.get('/', function (req, res) {
    res.render('index', { summ: ''});
});


//Reading the file index.html asynchronously (non-blocking) with added error handling for it
fs.readFile('views/index.html', 'utf-8', function(error, data) {

    if (error) {
        res.end('Error');
        return;
    }

//Allowing req.body to have content from html's form
    app.use(bodyParser.urlencoded({ extended: true }));

//Post method that is called when user submits the image so that further API calls can be made using the submitted data
    app.post('/', upload.single('input_image'), function (req,res,next) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        //The name of image file given as input
        var file_name = req.file.path;

        //The number of lines given as input
        len = encodeURIComponent(req.body.lines);

        //Creating url for SMMRY API with user input and API key
        //"url" variable needs JavaScript Language version as ECMAScript 6.
        url = `http://api.smmry.com/&SM_API_KEY=${apiKey}&SM_LENGTH=${len}`;


        //Reference: https://cloud.google.com/vision/docs/detecting-text#vision-text-detection-nodejs
        //Calling Google Vision API with the given image
        visionClient.textDetection({source: {filename: file_name}})
            .then(function (responses) {
                const detect_data = responses[0].textAnnotations;

                //Acquiring the extracted text from the image
                text = detect_data[0].description;

                //Options to call SMMRY API with the extracted text from the image
                options = {
                    url: url,
                    method: 'POST',
                    form: {'sm_api_input': text}
                };

                //Calling SMMRY API with the extracted data
                request(options, function (err, response, body) {
                    if (err) {
                        res.send(error);
                    }

                    //Returning the extracted text if the lines are too short for summary.
                    else if(JSON.parse(body).sm_api_message === "TEXT IS TOO SHORT"){
                        res.write(mustache.render(data.toString(), {
                            'summ':text
                        }));
                    }

                    //Returning Error message if any SMMRY API error code is returned
                    else if(JSON.parse(body).sm_api_error === "0" || JSON.parse(body).sm_api_error === "1" || JSON.parse(body).sm_api_error === "2" || JSON.parse(body).sm_api_error === "3"){
                        res.write(mustache.render(data.toString(), {
                            summ: 'Error occurred. Please try again.'
                        }));
                    }

                    //Returning the summarized text returned from the SMMRY API
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


//Starting the server at port number 8080
app.listen(8080, function () {
    console.log('Server running at http://127.0.0.1:8080/');
});