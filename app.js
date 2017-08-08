var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const imageToAscii = require("image-to-ascii");
var Convert = require('ansi-to-html');
var convert = new Convert();

var app = express();
var multer = require('multer');
var path = require('path');
//var sharp = require('sharp');
var fs = require('fs');
var storageDisk = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/photos');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname.slice(0, file.originalname.indexOf('.')) + '_' + Date.now() + file.originalname.slice(file.originalname.indexOf('.'), file.originalname.length));
    }
});
var uploadDisk = multer({storage: storageDisk}).single('file');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-log2response')());

app.get('/image', function (req, res) {
    let url = req.query.url;
// The path can be either a local path or an url
    imageToAscii(url , {white_bg: false, colored: true}, (err, converted) => {
        if(converted){
            res.json({data:convert.toHtml(converted), status: true});
        }
        else {
            res.json({status: false});
        }
    });
});

app.post('/post-img', function (req, res) {
    uploadDisk(req, res, function (err) {
        if (err) {
            res.json({code: 0, message: err});
        }
        else {

            if (req.file) {
                let url = './public/photos/' + req.file.filename;
                console.log(url);
                imageToAscii(url , {white_bg: false, colored: true}, (err, converted) => {
                    if(converted){
                        res.json({data:convert.toHtml(converted), status: true});
                    }
                    else {
                        res.json({status: false});
                    }
                });
            }
            else {
                res.json({code: 0, message: 'No file sellected'});
            }
        }
    });
});

app.listen(4567, function () {
    console.log('app start at 4567');
})

module.exports = app;
