const fs = require('fs')

const writefile = function (imageData) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(imageData.AudioFilename, imageData.AudioStream, imageData.options, (err) => err === null ? resolve(imageData) : reject(err))
  })
}

exports.writefile = writefile
