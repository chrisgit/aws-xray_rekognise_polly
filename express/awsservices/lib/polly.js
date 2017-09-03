// Class to call the Polly service
const AWS = require('aws-sdk')
const polly = new AWS.Polly()

class TextToSpeech {

  static pollyParams(message) {
    // To enhance the speech add SSML tags, see: http://docs.aws.amazon.com/polly/latest/dg/supported-ssml.html
    // OutputFormat: You can also specify pcm or ogg_vorbis formats.
    // Pick a nice voice :), see: http://docs.aws.amazon.com/polly/latest/dg/voicelist.html
    var params = {
       OutputFormat: 'mp3',
       Text: message,
       VoiceId: 'Amy'
    }
    return params
  }

  static getSpeech(data) {
    let params = TextToSpeech.pollyParams(data.message)
    let filename = data.filename
    console.log(`Resolving text: ${params.Text}`)

    return new Promise((resolve, reject) => {
      polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
          return reject(new Error(err))
        }
        data.filename = filename
        console.log(data)
        return resolve(data)
      })
    })
  }
}

module.exports = TextToSpeech
