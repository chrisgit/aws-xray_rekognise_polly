#!/usr/bin/env node

// Default settings
const awsregion = process.env.AWS_REGION || "eu-west-1";
const s3bucketName = process.env.BUCKET_NAME || "development-bucket";
const port = process.env.PORT || 4000;

// Express X-Ray and AWS SDK
/*
// instrument all AWS SDK clients by wrapping your aws-sdk require statement in a call to AWSXRay.captureAWS
var AWS = AWSXRay.captureAWS(require('aws-sdk'));

// instrument individual clients, wrap your AWS SDK client in a call to AWSXRay.captureAWSClient.
var AWSXRay = require('aws-xray-sdk'); ...
var ddb = AWSXRay.captureAWSClient(new AWS.DynamoDB());

// Note: Do not use both captureAWS and captureAWSClient together. This will lead to duplicate subsegments.
*/
const XRay = require("aws-xray-sdk");
const AWS = XRay.captureAWS(require("aws-sdk"));

const express = require("express");
const app = express();

AWS.config.update({ region: awsregion });

// S3 upload
const multer = require("multer");
const multerS3 = require("multer-s3");

// Lib
const ImageAnalyser = require("./lib/rekognition");
const TextToSpeech = require("./lib/polly");
const pfs = require("./lib/fspromise");
const Mediator = require("./lib/speechmediator");

/*
// When your application makes calls to microservices or public HTTP APIs, you can use the X-Ray SDK for Node.js client to instrument those calls and add the API to the service graph as a downstream service.
// Pass your http or https client to the X-Ray SDK for Node.js captureHTTPs method to trace outgoing calls.
// Note: Calls using third-party HTTP request libraries, such as Axios or Superagent, are supported through the captureHTTPsGlobal() API and will still be traced when they use the native http module.

var AWSXRay = require('aws-xray-sdk');
var http = AWSXRay.captureHTTPs(require('http'));

// To enable tracing on all HTTP clients, call captureHTTPsGlobal before you load http.

var AWSXRay = require('aws-xray-sdk');
AWSXRay.captureHTTPsGlobal(require('http'));
var http = require('http');
*/

console.log(`Region: ${AWS.config.region} Bucket: ${s3bucketName}`);

XRay.config([XRay.plugins.EC2Plugin, XRay.plugins.ECSPlugin]);
/*
// Create your own logger, or instantiate one using a library.
var logger = {
  error: (message, meta) => { // logging code  },
  warn: (message, meta) => { // logging code  },
  info: (message, meta) => { // logging code  },
  debug: (message, meta) => { // logging code  }
};
AWSXRay.setLogger(logger);

// X-Ray daemon address with AWSXRay.setDaemonAddress('host:port'); if not Default. Default is 127.0.0.1:2000
AWSXRay.setDaemonAddress('daemonhost:8082');
// If running daemon on different ports
AWSXRay.setDaemonAddress('tcp:daemonhost:8082 udp:daemonhost:8083');
// Note: this is not a HTTP address, therefore http://xray:2000 is invalid
*/

/*
// The X-Ray SDK expects a segment to be started before any subsegments are created. If there is no segment available, it throws an error.
// When using an express app and defining routes, the SDK will automatically create a segment for you within those defined routes.
// Otherwise, use a custom solution to create a segment: https://github.com/aws/aws-xray-sdk-node/tree/master/packages/core#developing-custom-solutions-using-automatic-mode
// After a segment has begun you can make instrumented AWS SDK requests.
// Single requests with custom capture: https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-subsegments.html
*/

app.use(XRay.express.openSegment("XRayDemo"));
app.use(express.static("public"));

// Default page - index.html
app.get("/", function (req, res) {
  res.render("index.html");
});

// S3 upload settings
var s3 = new AWS.S3();

var upload2 = multer({
  storage: multerS3({
    s3: s3,
    bucket: s3bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `rekognition/${file.originalname}`);
    },
  }),
});

// Upload image, identify with Rekognition, describe with Polly
app.post("/upload", upload2.array("image", 1), function (req, res, next) {
  console.log(`Successfully uploaded ${req.files.length} files!`);
  if (req.files.length == 0) {
    res.status(200).send("No files uploaded");
    return;
  }

  let imageData = { bucket: s3bucketName, imageFilename: req.files[0].originalname };
  ImageAnalyser.getImageLabels(imageData)
    .then(Mediator.buildmessage)
    .then(TextToSpeech.getSpeech)
    .then(Mediator.setAudioFilename)
    .then(pfs.writefile)
    .then((data) => {
      res.download(data.AudioFilename);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .send(
          "Sorry, your request cannot be processed. Please try again later."
        );
    });
});

app.use(XRay.express.closeSegment());

app.listen(port, function () {
  console.log(`Example app listening on port ${port} !`);
});
