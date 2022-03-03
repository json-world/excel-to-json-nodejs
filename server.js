/*
 * @Author: Suraj Roy
 * @Date:   10 July 2016
 * @Source : https://jsonworld.com/
 * @Topic : how to convert excel to json in nodejs...
 */        

let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    crypto = require('crypto'),
    xlsxtojson = require('xlsx-to-json'),
    xlstojson = require("xls-to-json");

let fileExtension = require('file-extension');

    app.use(bodyParser.json());  

    let storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './input/')
        },
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                cb(null, raw.toString('hex') + Date.now() + '.' + fileExtension(file.mimetype));
                });
        }
    });

    let upload = multer({storage: storage}).single('file');

    /** Method to handle the form submit */
    app.post('/sendFile', function(req, res) {
        let excel2json;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:401,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:404,err_desc:"No file passed"});
                return;
            }
            /** SET nodejs package as per the file received...*/
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                excel2json = xlsxtojson;
            } else {
                excel2json = xlstojson;
            }
            excel2json({
                input: req.file.path,  // input xls 
                output: "output/"+Date.now()+".json", // output json 
                lowerCaseHeaders:true
            }, function(err, result) {
                if(err) {
                  res.json(err);
                } else {
                  res.json(result);
                }
            });

        })
       
    });
    
	app.get('/',function(req,res){
		res.sendFile(__dirname + "/index.html");
	});

    app.listen('3000', function(){
        console.log('Server running on port 3000');
    });