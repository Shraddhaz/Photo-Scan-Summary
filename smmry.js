var req = require('request');
var express = require('express');
var app = express();

var apiKey = encodeURIComponent('193D8DE7A9');
var len = encodeURIComponent(2);
var url = `http://api.smmry.com/&SM_API_KEY=${apiKey}&SM_LENGTH=${len}`;

var text = "Seattle, a city on Puget Sound in the Pacific Northwest, is surrounded by water, mountains and evergreen forests, and contains thousands of acres of parkland. Washington State's largest city, it's home to a large tech industry, with Microsoft and Amazon headquartered in its metropolitan area. The futuristic Space Needle, a 1962 World's Fair legacy, is its most iconic landmark";

var options = {
    url: url,
    method: 'POST',
    form: {'sm_api_input': text}
};

req(options, function (err, res, body) {
    console.log(body);
    if(err) {
        console.log('error:', error);
    } else {
        console.log(JSON.parse(body).sm_api_content);
    }
});