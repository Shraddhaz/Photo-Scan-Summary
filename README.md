# Photo-Scan-Summary

Photo-Scan-Summary extracts the text within an image, and provides its summary in an efficient manner for ease of understanding, that is mainly done by reducing text to its most important sentences. It also supports a broad range of languages, along with language identification.

## Prerequisites

The web application's front-end is HTML/CSS/jQuery while the back-end is Node.js/Express. To use the application on your PC, you can clone this git repository, start the server in index.js file and then give the input from index.html.

## Source Code
You can find the source code at [https://github.com/Shraddhaz/Photo-Scan-Summary](https://github.com/Shraddhaz/Photo-Scan-Summary)

## Installation

Firstly, clone the git repository. 
```
git clone https://github.com/Shraddhaz/Photo-Scan-Summary
```

And then get all the packages required for the application by using the command:

```
npm install
```
The application is built using two APIs: Google's Cloud Vision API and SMMRY API. For this, you need to sign up and get their keys. For guidelines on how to get the key, you can refer to [Get key.json for Google Vision API](https://cloud.google.com/vision/docs/auth) and [Get key for SMMRY](http://smmry.com/api)

Now, save the "key.json" achieved from Vision API in the same folder as index.js and write the SMMRY API's key in index.js file.

## Execution
Start the server using,
```
node index.js
```
Now open the index.html file on your web browser and follow the guidelines given at the bottom of the page to get started with the basic steps being: 
1. Select Image
2. Upload Image
3. Press Submit
4. Get the summary

## Technical Details

* [IntelliJ](https://www.jetbrains.com/idea/) - Platform used
* [Node.js](https://nodejs.org/en/) - Back-End 
* [Express](https://expressjs.com/) - Back-End 
* [HTML/CSS/Bootstrap/JQuery](https://developer.mozilla.org/en-US/docs/Web) - Front-End
* [Google Cloud Vision API](https://cloud.google.com/vision/) - Text Extraction API
* [SMMRY API](http://smmry.com/api) - Summary API

## Future Scope

Deploying this web application on a live system by hosting it on a cloud platform like AWS, Heroku or Google Cloud. This makes the web application more accessible and easy to use.

## Presentation and Demo
For more details you can refer to the powerpoint presentation slides from: https://goo.gl/MZDemx and demo at https://goo.gl/LbXymk

## Authors

* **Shraddha Zingade** - *Photo-Scan-Summary* - https://github.com/Shraddhaz

## Contact and Bug Tracker

If there are any questions regarding the project, you can contact the author at [shraddha@pdx.edu](shraddha@pdx.edu) or post your queries on [https://github.com/Shraddhaz/Photo-Scan-Summary/issues](https://github.com/Shraddhaz/Photo-Scan-Summary/issues)

## Legal

This project is licensed under Copyright ©  MIT License. Go to [LICENSE](https://github.com/Shraddhaz/Photo-Scan-Summary/blob/master/LICENSE) for more details.

Other than that, the front-end has parts of templates from [https://bootstrapmade.com](https://bootstrapmade.com)

## Acknowledgments

**Prof. Simon Niklaus** for helping me with Node and Express.


