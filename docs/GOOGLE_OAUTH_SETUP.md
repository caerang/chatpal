# Google OAuth 설정 가이드

ChatPal에서 Google OAuth 기능을 사용하기 위해 다음 설정이 필요합니다.

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성 또는 선택
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트를 생성하거나 기존 프로젝트를 선택

### 1.2 OAuth 2.0 클라이언트 ID 생성
1. **APIs & Services** > **Credentials** 메뉴로 이동
2. **+ CREATE CREDENTIALS** > **OAuth client ID** 클릭
3. **Application type**: Web application 선택
4. **Name**: ChatPal (또는 원하는 이름)
5. **Authorized JavaScript origins** 추가:
   - `http://localhost:5173` (개발 환경)
   - `https://yourdomain.com` (프로덕션 환경)
6. **Authorized redirect URIs** 추가:
   - `http://localhost:5173` (개발 환경)
   - `https://yourdomain.com` (프로덕션 환경)
7. **CREATE** 클릭

### 1.3 OAuth 동의 화면 설정
1. **APIs & Services** > **OAuth consent screen** 메뉴로 이동
2. **User Type**: External 선택 (개인 개발자인 경우)
3. 필수 정보 입력:
   - **App name**: ChatPal
   - **User support email**: 본인 이메일
   - **Developer contact information**: 본인 이메일
4. **Scopes** 추가:
   - `openid`
   - `email`
   - `profile`
5. **Test users** 추가 (필요한 경우)

## 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음을 추가:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

**중요**: `.env` 파일은 절대로 git에 커밋하지 마세요!

## 3. 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:5173`에서 실행되는지 확인하세요.

## 4. 테스트

1. 애플리케이션에 접속
2. "Sign in with Google" 버튼 클릭
3. Google 계정으로 로그인
4. 권한 승인
5. 성공적으로 로그인되는지 확인

## 5. 문제 해결

### Google Identity Services 로드 실패
- 인터넷 연결 확인
- 브라우저 콘솔에서 오류 메시지 확인
- 클라이언트 ID가 올바른지 확인

### 로그인 실패
- OAuth 동의 화면이 올바르게 설정되었는지 확인
- Authorized origins에 현재 도메인이 추가되었는지 확인
- 브라우저 쿠키/로컬 스토리지 클리어 후 재시도

### 토큰 만료
- 토큰은 자동으로 만료를 체크합니다
- 만료된 경우 자동으로 로그아웃됩니다

## 6. 보안 고려사항

- 클라이언트 ID는 공개되어도 안전합니다
- 하지만 Authorized origins 설정을 통해 접근을 제한합니다
- 프로덕션에서는 HTTPS를 반드시 사용하세요
- 정기적으로 접근 권한을 검토하세요

## 7. 추가 기능

현재 구현된 기능:
- ✅ Google 로그인/로그아웃
- ✅ 사용자 정보 표시
- ✅ 로그인 상태 유지 (localStorage)
- ✅ 토큰 만료 검증
- ✅ One Tap 로그인

향후 추가 가능한 기능:
- [ ] 다중 계정 지원
- [ ] 토큰 자동 갱신
- [ ] Google API 연동 (Drive, Calendar 등)