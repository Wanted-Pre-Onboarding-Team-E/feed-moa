
# 👋 팀원 소개
|강희수|박동훈|신은수|이드보라|이승원|
|:--:|:--:|:--:|:--:|:--:|
|<img src="https://hackmd.io/_uploads/H1Honf0fp.jpg" width="100"/>|<img src="https://hackmd.io/_uploads/B12ir7pGp.png" width="100"/>|<img src="https://hackmd.io/_uploads/HyZ86pjzp.png" width="100"/>|<img src="https://hackmd.io/_uploads/ByC5xOhz6.jpg" width="100"/>|<img src="https://hackmd.io/_uploads/B19HTJ6zp.jpg" width="100"/>|!
|[@kangssu](https://github.com/kangssu)|[@laetipark](https://github.com/laetipark)|[@dawwson](https://github.com/dawwson)|[@sayapin1](https://github.com/sayapin1)|[@tomeee11](https://github.com/tomeee11)|

</br>

## 역할
- **강희수**
    - **스켈레톤 프로젝트 생성**
        - 프로젝트 구조 생성 및 프레임워크&라이브러리 설치
    - **게시글 상세 조회**
        - 하나의 게시글에 대한 상세 정보 및 관련 해시태그 조회
    - **게시글 공유하기**
        - NestJS에서 제공하는 HttpModule, ConfigModule, CustomPipe 사용
          - HttpModule로 외부 호출 사용
          - CustomPipe로 Enum Type의 특정 값에 대한 유효성 검증
          - 로컬에서는 외부 호출을 통과시키기 위해 ConfigModule로 로컬/데브 환경변수 구분
- **박동훈**
    - **사용자 회원가입 API 개발**
        - 사용자 정보(아이디, 이메일, 비밀번호)에 대한 유효성 검사
        - 가입 승인 절차를 위한 인증 코드 발급

- **신은수**
    - **가입 승인 API 개발**
        - `DB`에 저장된 인증 코드 검사
    - **사용자 로그인 API 개발**
        - `Cookie` + `JWT` 기반 사용자 인증

- **이드보라**
    - **통계 API 개발**
        - 해시태그/일자/시간별 게시물 개수, 조회수, `좋아요`수, 공유수 통계 결과 조회
- **이승원**
    - **게시글 목록 조회**
        - 전체 게시글 목록 및 관련 해시태그 조회
    - **게시글 좋아요**
        - NestJS에서 제공하는 HttpModule 사용

<br>

# 🚀 프로젝트 소개
해시태그를 기반으로 인스타그램, 페이스북, 트위터, 스레드 등 복수의 `SNS`에 게시된 게시물을 하나의 서비스에서 확인할 수 있는 통합 `Feed` 서비스의 `RESTful API` 웹 서버 애플리케이션 입니다.


<br>

## 1. 기술 스택
<img src="https://img.shields.io/badge/Node.js-version.18-339933">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-version.10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeScript-version.5-3178C6">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-version.0.3-fcad03">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version.8-00758F">&nbsp;

<br>

## 2. 실행 방법
### 개발 버전 실행
- local 실행
```
npm run start:local
```
- dev 실행
```
npm run start:dev
```
<br>

---

<br>

# 💡 요구 사항 구현 내용
## 1. 사용자 회원가입
- 사용자 정보에 대한 입력값의 유효성을 검사한다.
    - 아이디 중복 여부 확인
    - 이메일
        - 이메일 구조를 가지고 있는지 여부
    - 비밀번호
        - 10자 이상
        - 숫자, 문자, 특수문자 중 두 개 이상 사용
        - 연속된 문자 3번 이상 사용 금지
- 생성된 사용자에 대한 인증 코드를 `DB`에 저장한다.

</br>

## 2. 사용자 가입승인
- 회원 가입 후 발급받은 인증코드로 가입 승인한다.

</br>

## 3. 사용자 로그인
- 가입 승인된 사용자만 로그인 할 수 있다.
- 계정 아이디와 비밀번호로 로그인한다.
- 로그인 후의 모든 요청에 대해 `JWT`의 유효성을 검증한다.

</br>

## 4. 게시글 목록 조회
- 해시태그로 게시글 목록을 조회한다.
- 정렬, 검색, 페이지네이션, `SNS`별 필터링이 적용된다.

</br>

## 5. 게시글 상세 조회
- 특정 게시글에 대한 모든 필드를 조회한다.
- 요청 성공시 횟수 제한 없이 조회수가 `+1` 증가한다.

</br>

## 6. 게시글 좋아요
- 요청 성공시 횟수 제한 없이 `좋아요` 횟수가 `+1` 증가한다.
- 게시글의 SNS 타입에 따라 `좋아요` 기능에 대한 외부 `API`(가상의 `URL`)를 호출한다.

|Type|Method|Endpoint|
|---|---|---|
|facebook|POST|`https://www.facebook.com/likes/<content_id>`|
|twitter|POST|`https://www.twitter.com/likes/<content_id>`|
|instagram|POST|`https://www.instagram.com/likes/<content_id>`|
|threads|POST|`https://www.threads.net/likes/<content_id>`|

</br>

## 7. 게시글 공유하기
- 요청 성공시 횟수 제한 없이 `공유` 횟수가 `+1` 증가한다.
- 게시글의 SNS 타입에 따라 `공유` 기능에 대한 외부 `API`(가상의 `URL`)를 호출한다.

|Type|Method|Endpoint|
|---|---|---|
|POST|facebook|`https://www.facebook.com/share/<content_id>`|
|POST|twitter|`https://www.twitter.com/share/<content_id>`|
|POST|instagram|`https://www.instagram.com/share/<content_id>`|
|POST|threads|`https://www.threads.net/share/<content_id>`|


</br>

## 8. 통계
- 사용자의 아이디 또는 특정 해시태그별, 일자별, 시간별 통계를 조회한다.
- 통계 항목 : 게시물 개수, 조회수, 좋아요수, 공유수


<br>

---

<br>

# 📝 ERD 설계
- 사용자는 게시물을 소유하지 않는다.
- 게시물은 0개 이상의 해시태그를 가진다.
- 인증 코드는 별도의 테이블에 저장한다.

![](https://hackmd.io/_uploads/r1phpypMT.png)

<br>

---

<br>

# 📝 REST API 명세
|Title|Method|Path|Authorization|
|:---:|:---:|---|:---:|
|사용자<br>회원가입|`POST`|`/auth/signup`|X|
|사용자<br>로그인|`POST`|`/auth/login`|X|
|사용자<br>가입승인|`POST`|`/auth/approve`|X|
|게시물<br>목록 조회|`GET`|`/posts`|O|
|게시물<br>상세 조회|`GET`|`/posts/{id}`|O|
|게시물<br>좋아요|`PATCH`|`/posts/{id}/like/{type}`|O|
|게시물<br>공유|`PATCH`|`/posts/{id}/share/{type}`|O|
|통계|`GET`|`/statistics`|O|

<br>

## 1. 사용자 회원가입
- 회원 정보를 저장하고 인증 코드를 발급한다.

### URL
```
POST /auth/signup
Content-Type: application/json
```

### Request Body
|Name|Type|Description|Required|
|---|:---:|---|:---:|
|username|string|사용자 계정 아이디|O|
|email|string|사용자 계정 이메일|O|
|password|string|사용자 계정 비밀번호|O|
|confirmPassword|string|사용자 계정 비밀번호 확인|O|

### Response Body
|Name|Type|Description|Required|
|---|:---:|---|:---:|
|authCode|string|이메일 인증 코드|O|


### Success Response
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "가입요청이 완료되었습니다.",
  "data": {
    "authCode": "123456"
  }
}
```

### Fail Response
- **중복되는 아이디**
```
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "message": "creator10은 이미 존재하는 계정입니다.",
  "error": "Conflict",
  "statusCode": 409
}
```

- **유효하지 않은 이메일 형식**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "message": [
    "email must be an email"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
- **비밀번호 10자 미만**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "message": [
    "password must be longer than or equal to 10 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
- **숫자, 문자, 특수문자 중 2가지 미만 포함**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "message": "비밀번호는 숫자, 문자, 특수문자 중 2가지 이상을 포함해야하 합니다.",
  "error": "Bad Request",
  "statusCode": 400
}
```
- **3회 이상 연속되는 문자를 사용**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "message": "비밀번호는 3회 이상 연속되는 문자 사용은 불가능합니다.",
  "error": "Bad Request",
  "statusCode": 400
}
```

* **비밀번호와 비밀번호 확인이 일치하지 않음**
```
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "message": "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
  "error": "Conflict",
  "statusCode": 409
}
```

<br>

--- 

<br>


## 2. 사용자 가입승인
-  이메일과 인증 코드로 임시 회원가입한 사용자를 승인한다.

### URL
```
POST /auth/approve
Content-Type: application/json
```

### Request Body
|Name|Type|Description|Required|
|---|:---:|---|:---:|
|email|string|사용자 이메일|O|
|authCode|string|이메일 인증코드|O|

### Success Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "가입 승인되었습니다."
}
```

### Fail Response
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "message": "유효하지 않은 인증코드입니다."
}
```

<br>

---

<br>

## 3. 사용자 로그인
* 사용자 아이디와 비밀번호로 로그인 요청 성공시 `Set-Cookie` 헤더를 통해 `JWT` 를 반환한다.

### URL
```
POST /auth/login
Content-Type: application/json
```

### Request Body
|Name|Type|Description|Required|
|---|:---:|---|:---:|
|username|string|사용자 계정 아이디|O|
|password|string|사용자 계정 비밀번호|O|

### Response Body
|Name|Type|Description|Required|
|---|:---:|---|:---:|
|id|string|사용자 계정 아이디|O|
|username|string|사용자 계정 비밀번호|O|
|email|string|사용자 이메일|O|

### Success Response
```
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: accessToken={JWT_TOKEN}

{
  "id": 1
  "username": "team_e",
  "email": "team_e@gmail.com",
}
```

### Fail Response
- **아이디 불일치**
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "message": "존재하지 않는 아이디입니다.",
  "error": "Unauthorized",
  "statusCode": 401
}
```

- **비밀번호 불일치**
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "message": "비밀번호가 일치하지 않습니다.",
  "error": "Unauthorized",
  "statusCode": 401
}
```

<br>

---

<br>

## 4. 게시물 목록 조회
- 게시물 목록을 조회한다.

### URL
```
GET /posts
Cookie: accessToken={JWT_TOKEN}
```

### Query Parameters
|Name|Description|Required|
|---|---|:---:|
|hashtag||X|
|type||X|
|orderBy||X|
|order||X|
|searchBy||X|
|search||X|
|pageCount||X|
|page||X|

### Success Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 2,
  "type": "Facebook",
  "title": "톰이",
  "content": "야옹",
  "viewCount": 0,
  "likeCount": 0,
  "shareCount": 2,
  "createdAt": "2023-10-26T06:38:10.908Z",
  "updatedAt": "2023-10-27T12:13:03.862Z"
}
```

<br>

---

<br>

## 5. 게시글 상세 조회
* 하나의 게시물에 대한 상세 정보를 전부 가져오고 게시물에 연결된 해시태그까지 불러온다.

### URL
```
GET /posts/:id
Cookie: accessToken={JWT_TOKEN}
```

### Success Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": 1,
    "type": "threads",
    "title": "요즘 풋살이 재밌던데",
    "content": "야외 풋살장에서 뛰면 공기도 좋고 운동도 되고 일석이조야",
    "viewCount": 3,
    "likeCount": 0,
    "shareCount": 8,
    "createdAt": "2023-10-29T02:25:07.000Z",
    "updatedAt": "2023-10-29T09:03:56.000Z",
    "hashtags": [
      {
        "id": 4,
        "hashtag": "퇴근후",
        "createdAt": "2023-10-29T02:26:10.000Z"
      },
      {
        "id": 5,
        "hashtag": "풋살",
        "createdAt": "2023-10-29T02:26:13.000Z"
      }
    ]
  }
}
```

### Fail Response
- **해당 `{id}`의 게시물이 존재하지 않음**
```
HTTP/1.1 404 NOT FOUND
Content-Type: application/json

{
    "statusCode": 404,
    "message": "게시글을 찾을 수 없습니다."
}
```

<br>

---

<br>

## 6. 게시물 좋아요
- 외부 SNS 좋아요 API를 호출하고, `좋아요`수를 증가시킨다.

### URL
```
PATCH posts/{id}/like/{type}
Cookie: accessToken={JWT_TOKEN}
```

### Path Variables
|Name|Description|Required|
|---|---|:---:|
|id|게시물 `DB Id`|X|
|type|SNS 종류<br>(`instagram`, `twitter`, `facebook`, `threads`)|X|

### Success Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
 ...
}
```

<br>

---

<br>

## 7. 게시글 공유하기
- 외부 SNS 공유하기 API를 호출하고, 공유수를 증가시킨다.

### URL
```
PATCH posts/{id}/share/{type}
Cookie: accessToken={JWT_TOKEN}
```
### Path Variables
|Name|Description|Required|
|---|---|:---:|
|id|게시물 `DB Id`|X|
|type|SNS 종류<br>(`instagram`, `twitter`, `facebook`, `threads`)|X|

### Success Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true
}
```

### Fail Response
- **Id && Type 조건에 부합하지 않을 경우**
```
HTTP/1.1 404 NOT FOUND
Content-Type: application/json

{
  "statusCode": 404,
  "message": "게시글을 찾을 수 없습니다."
}
```

- **PostType에 존재하지 않는 Type이 넘어올 경우**
```
HTTP/1.1 404 NOT FOUND
Content-Type: application/json

{
  "statusCode": 404,
  "message": "타입을 찾을 수 없습니다."
}
```

<br>

---

<br>

## 8. 통계
* 일자별과 시간별로 특정 해시태그의 게시글 통계를 조회한다.

### URL
```
GET /statistics
Cookie: accessToken={JWT_TOKEN}
```

### Query Parameters
|Name|Description|Required|
|---|---|:---:|
|hashtag|해시태그|X|
|value|통계 항목<br> - `count`  <br>- `view_count` <br> - `like_count` <br> - `share_count` |X|
|type|`date`, `hour`|X|
|start|시작일/시작시간|X|
|end|종료일/종료시간|X|

### Success Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  '2023-09-02': 0,
  '2023-09-03': 0,
  '2023-09-04': 0,
}
```
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  '2023-10-25': {
    '1': 0,
    '2': 0,
    '3': 0,
  }
}
```

### Fail Response
- **조회 가능한 일자 및 시간이 지났을 경우**
```
HTTP/1.1 422 Unprocessable Entity

{
  "message": "최대 조회 가능한 날짜는 30일입니다."/ "최대 조회 가능한 시간은 일주일(168시간)입니다.",
  "error": "Unprocessable Entity",
  "statusCode": 422
}
```
