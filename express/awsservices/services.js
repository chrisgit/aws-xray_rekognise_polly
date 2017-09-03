#!/usr/bin/env node

const XRay = require('aws-xray-sdk')
const AWS = XRay.captureAWS(require('aws-sdk'))
const http = XRay.captureHTTPs(require('http'))
const express = require('express')
const app = express()
const multer = require('multer')
const multerS3 = require('multer-s3')

const ImageAnalyser = require('./lib/rekognition')
const TextToSpeech = require('./lib/polly')
const pfs = require('./lib/fspromise')
const Mediator = require('./lib/speechmediator')

const awsregion = process.env.AWS_REGION || 'eu-west-1'
const port = process.env.PORT || 4000;
const HOST = '0.0.0.0';

AWS.config.update({region: awsregion})

console.log(AWS.config)

XRay.config([XRay.plugins.EC2Plugin, XRay.plugins.ECSPlugin]);

app.use(express.static('public'))
app.use(XRay.express.openSegment('XrayDemo'));

app.get('/', function (req, res) {
  res.render('index.html')
})

var s3 = new AWS.S3()

var upload2 = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dev-automation',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname})
    },
    key: function (req, file, cb) {
      cb(null, `rekognition/${file.originalname}`)
    }
  })
})

app.post('/upload', upload2.array('image', 1), function(req, res, next) {
  console.log(`Successfully uploaded ${req.files.length} files!`)
  if (req.files.length == 0) {
    res.status(200).send('No files uploaded')
    return
  }

  let imageData = {filename: req.files[0].originalname}
  ImageAnalyser
   .getImageLabels(imageData)
   .then(Mediator.buildmessage)
   .then(TextToSpeech.getSpeech)
   .then(Mediator.setAudioFilename)
   .then(pfs.writefile)
   .then((data) => {
      res.download(data.AudioFilename)
    })  
    .catch((error) => {
      res.status(500).send('Sorry, your request cannot be processed. Please try again later.')
   })
})

app.use(XRay.express.closeSegment())

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!')
})
