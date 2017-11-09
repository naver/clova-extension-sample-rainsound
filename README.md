### 개요 
'빗 소리'라는 Clova extension의 REST API 서버 소스 코드입니다. '빗 소리' 익스텐션이 어떻게 작동하는지 보시려면, Clova 앱이나 Clova 스피커(WAVE, Friens)에서 '빗 소리 시작해줘'  또는 '빗소리한테 2번 반복해달라고 해줘'라고 해보시길 바랍니다. 해당 익스텐션을 실행하면 빗소리 (ASMR)을 1회 또는 원하는 횟수만큼 반복해서 재생해줍니다. 

### 사용환경
'빗 소리'라는 Clova extension의 REST API 서버는 node.js로 구현되어 있습니다.  Windows, MacOS, Linux 등 node.js 가 구동 가능한 OS면 실행 가능하며, 구체적인 목록들은 여기를 참고하셔서, node.js를 먼저 설치하시길 바랍니다. https://nodejs.org/ko/download/current/

### 설치방법
'빗 소리' REST API 서버 소스 코드 설치는 다음과 같이 해주시길 바랍니다.
1) node.js 설치: https://nodejs.org/ko/download/current/
2) 소스코드 다운로드: git clone  https://github.com/naver/clova-extension-sample-rainsound
3) 의존성 라이브러리 설치: npm install 

### 사용법 
'빗 소리'라는 Clova extension의 REST API 서버는 Clova platform으로부터의 익스텐션 요청에 따라 적절한 응답을 하도록 되어 있습니다. API 서버를 실행을 하더라도, Clova platform이 보내는 것과 동일한 API 요청을 해주셔야 정확하게 작동하는 점 참고 바랍니다. 실제 서비스를 위해서는 https 기반으로 외부에서 접근 가능한 도메인으로 해주셔야 합니다.
- API 서버 실행: node app.js 
- API 서버 테스팅: Postman에서 아래와 같이 json Request를 전송하고 json이 리턴되는지 테스트 해봅니다.
	- URL: http://localhost:3000/clova
	- 요청 방법: POST 
	- Body: raw ( JSON 선택 ) 
- 요청 예시) 
```
{
    "version": "0.1.0",
    "session": {
        "sessionId": "bd2beeb7-8dbc-41bb-8bb0-9f481e634aec",
        "user": {
            "userId": "l6Yp5wEPSHemC543axrSQA",
            "accessToken": "c3ee389c-070a-4c85-9df9-4479de3b3fae"
        },
        "new": true
    },
      "context": {
    "System": {
      "user": {
        "userId": "V0qe",
        "accessToken": "XHapQasdfsdfFsdfasdflQQ7"
      },
      "device": {
        "deviceId": "096e6b27-1717-33e9-b0a7-510a48658a9b",
        "display": {
          "size": "l100",
          "orientation": "landscape",
          "dpi": 96,
          "contentLayer": {
            "width": 640,
            "height": 360
          }
        }
      }
    }
  },
    "request": {
        "type": "IntentRequest",
        "intent": {
            "name": "PlayLoopIntent",
            "slots": {
                "loopCount": {
                    "name": "loopCount",
                    "value": "2"
                }
            }
        }
    }
}
```
![image](http://static.naver.net/clova/service/native_extensions/example/rain.png)

### 라이선스
Naver & Line corp.

[LICENSE](https://github.com/naver/clova-extension-sample-rainsound/blob/github-public/LICENSE)

```
Copyright 2018 NAVER Corp. & LINE Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

