const uuid = require('uuid').v4
const _ = require('lodash')
const { DOMAIN } = require('../config')

class Directive {
  constructor({namespace, name, payload}) {
    this.header = {
      messageId: uuid(),
      namespace: namespace,
      name: name,
    }
    this.payload = payload
  }
}

function audioDirective() {
  episodeId = Math.floor(Math.random() * 1000)
  return new Directive({
    namespace: 'AudioPlayer',
    name: 'Play',
    payload: {
      audioItem: {
        audioItemId: uuid(),
        stream: {
          beginAtInMilliseconds: 0,
          playType: "NONE",
          token: uuid(),
          url: `${DOMAIN}/rainning_sound.mp3`,
          urlPlayable: true
        },
        type: "custom",
      },
      playBehavior: "REPLACE_ALL",
      source: {
        logoUrl: `${DOMAIN}/img_sound_rain_108.png`,
        name: "소리 시리즈"
      }
    }
  })
}

class CEKRequest {
  constructor (httpReq) {
    this.request = httpReq.body.request
    this.context = httpReq.body.context
    this.session = httpReq.body.session

    console.log('CEK Request')
    console.log(`session: ${JSON.stringify(this.session)}`)
    console.log(`context: ${JSON.stringify(this.context)}`)
  }

  do(cekResponse) {
    switch (this.request.type) {
      case "LaunchRequest":
        return this.launchRequest(cekResponse)
      case "IntentRequest":
        return this.intentRequest(cekResponse)
      case "SessionEndedRequest":
        return this.sessionEndedRequest(cekResponse)
    }
  }

  launchRequest(cekResponse) {
    console.log('launchRequest')
    cekResponse.appendSpeechText("빗소리를 재생합니다.")
    cekResponse.addDirective(audioDirective())
  }

  intentRequest(cekResponse) {
    console.log('intentRequest')
    console.log(JSON.stringify(this.request))
    const intent = this.request.intent.name
    const slots = this.request.intent.slots

    switch (intent) {
    case "PlayIntent":
    case "PlayLoopIntent":
      let loopCount
      const loopCountSlot = slots.loopCount
      if (intent == "PlayIntent") {
        loopCount = 1
      } else if (slots.length == 0 || !loopCountSlot) {
        loopCount = 3
      } else {
        loopCount = parseInt(loopCountSlot.value)
      }

      if (loopCount == 1) {
        cekResponse.appendSpeechText("빗소리를 재생합니다.")
      } else {
        cekResponse.appendSpeechText(`빗소리를 ${loopCount}번 재생합니다.`)
      }
      for (let i = 0; i < loopCount; i++) {
        cekResponse.addDirective(audioDirective())
      }
      break
    case "Clova.GuideIntent":
      cekResponse.appendSpeechText("죄송해요. 이해할 수 없습니다.")
      cekResponse.appendSpeechText("빗소리 틀어줘, 라고 시도해보세요.")
      break;
    }
  }

  sessionEndedRequest(cekResponse) {
    console.log('sessionEndedRequest')
    cekResponse.setSimpleSpeechText("빗소리 익스텐션을 종료합니다.")
    cekResponse.clearMultiturn()
  }
}

class CEKResponse {
  constructor () {
    console.log('CEKResponse constructor')
    this.response = {
      directives: [],
      shouldEndSession: true,
      outputSpeech: {},
    }
    this.version = "0.1.0"
    this.sessionAttributes = {}
  }

  setMultiturn(sessionAttributes) {
    this.response.shouldEndSession = false
    this.sessionAttributes = _.assign(this.sessionAttributes, sessionAttributes)
  }

  clearMultiturn() {
    this.response.shouldEndSession = true
    this.sessionAttributes = {}
  }

  addDirective(directive) {
    this.response.directives.push(directive)
  }

  setSimpleSpeechText(outputText) {
    this.response.outputSpeech = {
      type: "SimpleSpeech",
      values: {
          type: "PlainText",
          lang: "ko",
          value: outputText,
      },
    }
  }

  appendSpeechText(outputText) {
    const outputSpeech = this.response.outputSpeech
    if (outputSpeech.type != 'SpeechList') {
      outputSpeech.type = 'SpeechList'
      outputSpeech.values = []
    }
    if (typeof(outputText) == 'string') {
      outputSpeech.values.push({
        type: 'PlainText',
        lang: 'ko',
        value: outputText,
      })
    } else {
      outputSpeech.values.push(outputText)
    }
  }
}

const clovaReq = function (httpReq, httpRes, next) {
  cekResponse = new CEKResponse()
  cekRequest = new CEKRequest(httpReq)
  cekRequest.do(cekResponse)
  console.log('CEK Response')
  console.log(JSON.stringify(cekResponse))
  return httpRes.send(cekResponse)
};

module.exports = clovaReq;
