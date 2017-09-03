const AWS = require('aws-sdk')
const rek = new AWS.Rekognition()

class ImageAnalyser {

  static rekogParams(filename) {
    let params = {
      Image: {
        S3Object: {
          Bucket: 'dev-automation',
          Name: `rekognition/${filename}`,
        },
      },
      MaxLabels: 10,
      MinConfidence: 50,
    }
    return params
  }

  static getImageLabels(imageData) {
    let params = ImageAnalyser.rekogParams(imageData.filename)
    console.log(`Analyzing file: https://s3.amazonaws.com/${params.Image.S3Object.Bucket}/${params.Image.S3Object.Name}`)

    return new Promise((resolve, reject) => {
      rek.detectLabels(params, (err, data) => {
        if (err) {
          console.log(`Failed analysing file ${params.Image.S3Object.Bucket}/${params.Image.S3Object.Name}`)
          return reject(new Error(err))
        }
        data.filename = imageData.filename
        console.log('Analysis labels:', data)
        return resolve(data)
      })
    })
  }
}

module.exports = ImageAnalyser
