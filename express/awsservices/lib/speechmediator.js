const buildmessage = function (imageData) {
  return new Promise(function (resolve, reject) {
    imageData.message = 'Your image contains '
    imageData.Labels.forEach(function (label) {
        imageData.message += label.Name + ', '
    })
    resolve(imageData)
  })
}

const setAudioFilename = function (imageData) {
  return new Promise(function (resolve, reject) {
    imageData.AudioFilename = './audio/download.mp3'
    resolve(imageData)
  })
}

exports.buildmessage = buildmessage
exports.setAudioFilename = setAudioFilename