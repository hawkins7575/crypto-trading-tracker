# 온라인 배포 가이드

## 🌟 추천: Vercel + Convex 배포

### 준비 사항
- GitHub 계정
- Vercel 계정 (GitHub 연동)
- Convex 계정

---

## 🔄 배포 과정

### 1단계: GitHub 저장소 생성

```bash
# Git 초기화 (아직 안했다면)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Crypto trading tracker

🎯 Features:
- Real-time trading data tracking
- Profit/loss calculations
- Trading journal and strategies
- Analytics charts (daily/weekly/monthly)
- Mobile optimized UI
- Convex real-time database

🛠 Tech Stack:
- React 18 + Tailwind CSS
- Convex backend
- Recharts for analytics
- Mobile responsive design

🚀 Generated with Claude Code"

# GitHub 저장소 연결 (GitHub에서 새 repo 생성 후)
git remote add origin https://github.com/YOUR_USERNAME/crypto-trading-tracker.git
git branch -M main
git push -u origin main
```

### 2단계: Convex 클라우드 배포

```bash
# Convex 로그인
npx convex login

# 프로덕션 배포
npx convex deploy

# 배포 후 .env.local 확인
cat .env.local
```

### 3단계: Vercel 배포

#### 방법 A: 웹 대시보드 (추천)
1. [vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. GitHub 저장소 선택
5. 환경 변수 설정:
   - `REACT_APP_CONVEX_URL`: Convex URL
6. "Deploy" 클릭

#### 방법 B: CLI
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 환경 변수 설정
vercel env add REACT_APP_CONVEX_URL
# Convex URL 입력

# 프로덕션 배포
vercel --prod
```

---

## 🔧 배포 설정 파일들

### package.json 스크립트 추가
```json
{
  "scripts": {
    "build": "react-scripts build",
    "deploy": "npm run build && vercel --prod",
    "deploy:convex": "npx convex deploy"
  }
}
```

### .gitignore 확인
```
# dependencies
/node_modules

# production
/build

# environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Convex
.convex
```

### vercel.json (선택사항)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app"
}
```

---

## 🌐 다른 배포 옵션

### Netlify 배포
```bash
# Netlify CLI
npm install -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy --prod --dir=build
```

### Railway 배포
```bash
# Railway CLI
npm install -g @railway/cli

# 로그인
railway login

# 배포
railway deploy
```

---

## 📱 모바일 배포 고려사항

### PWA 설정 (Progressive Web App)
```javascript
// public/manifest.json
{
  "name": "Crypto Trading Tracker",
  "short_name": "CryptoTracker",
  "description": "Real-time crypto day trading tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🔒 보안 설정

### 환경 변수 관리
```bash
# 프로덕션 환경 변수
REACT_APP_CONVEX_URL=https://your-project.convex.cloud
NODE_ENV=production
```

### CORS 설정
Convex가 자동으로 처리하므로 별도 설정 불필요

---

## 📊 성능 최적화

### 빌드 최적화
```bash
# 빌드 분석
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

### 이미지 최적화
- WebP 형식 사용
- 이미지 압축
- Lazy loading 구현

---

## 🧪 배포 전 체크리스트

- [ ] `npm run build` 성공
- [ ] Convex 연결 테스트
- [ ] 모바일 반응형 확인
- [ ] 환경 변수 설정
- [ ] HTTPS 확인
- [ ] 성능 테스트

---

## 🚨 트러블슈팅

### 일반적인 문제들

1. **빌드 실패**
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

2. **Convex 연결 실패**
```bash
# 환경 변수 확인
echo $REACT_APP_CONVEX_URL

# Convex 재배포
npx convex deploy
```

3. **모바일 접근 불가**
- HTTPS 확인
- Service Worker 설정

---

## 📈 배포 후 모니터링

### 분석 도구
- **Vercel Analytics**: 트래픽 분석
- **Convex Dashboard**: 데이터베이스 모니터링
- **Google Analytics**: 사용자 행동 분석

### 성능 모니터링
```javascript
// src/utils/analytics.js
export const trackEvent = (action, category = 'user') => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: window.location.pathname
    });
  }
};
```

---

## 🔄 CI/CD 설정

### GitHub Actions (자동 배포)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎯 배포 완료 후

1. **도메인 설정**: 커스텀 도메인 연결
2. **SSL 인증서**: 자동 생성 확인
3. **성능 테스트**: Lighthouse 점수 확인
4. **모바일 테스트**: 실제 기기에서 테스트
5. **사용자 피드백**: 베타 테스터 모집

배포 URL: `https://your-project.vercel.app`

---

## 💰 비용 정보

### 무료 플랜 제한
- **Vercel**: 월 100GB 대역폭
- **Convex**: 1GB 저장소, 1M 함수 호출
- **충분한 개인/소규모 프로젝트용**

### 유료 업그레이드 시점
- 월 사용자 10,000명 이상
- 데이터 저장량 1GB 초과
- 고급 분석 기능 필요시