# 코인 데이트레이딩 추적 시스템 개발 문서

## 📋 프로젝트 개요

실시간 암호화폐 데이트레이딩 추적 및 분석 웹 애플리케이션

### 주요 기능
- **거래 내역 관리**: 입금/출금/잔고 추적
- **실시간 수익률 계산**: 직전 잔금 기준 자동 계산
- **매매일지**: 거래 분석 및 감정 기록
- **전략 관리**: 매매 전략 등록 및 활성화
- **분석 차트**: 일/주/월별 수익률 시각화
- **목표 설정**: 월/주/년 목표 수익률 관리

---

## 🛠 기술 스택

### Frontend
- **React 18.2.0**: UI 라이브러리
- **JavaScript (ES6+)**: 주 개발 언어
- **Tailwind CSS 3.3.2**: 유틸리티 기반 CSS 프레임워크
- **Lucide React**: 아이콘 라이브러리
- **Recharts 2.7.2**: 차트 라이브러리

### Backend & Database
- **Convex**: 실시간 백엔드 서비스
  - 실시간 데이터 동기화
  - TypeScript 기반 스키마
  - 서버리스 함수
  - 자동 스케일링

### Development Tools
- **Create React App**: 프로젝트 초기화
- **ESLint**: 코드 품질 관리
- **npm**: 패키지 매니저

### Deployment
- **로컬 개발**: localhost:3000
- **네트워크 접근**: 192.168.45.239:8080
- **Convex 배포**: anonymous-cc-1 (로컬 개발용)

---

## 🏗 프로젝트 구조

```
coin-trading-tracker/
├── public/
│   └── index.html
├── src/
│   ├── components/           # React 컴포넌트
│   │   ├── AnalyticsChart.js    # 차트 컴포넌트
│   │   ├── AnalyticsTab.js      # 분석 탭
│   │   ├── ConvexStatus.js      # Convex 연결 상태
│   │   ├── TradingTrackerContent.js # 메인 콘텐츠
│   │   └── ...
│   ├── hooks/                # 커스텀 훅
│   │   ├── useConvexData.js     # Convex 데이터 훅
│   │   ├── useTradeCalculations.ts # 거래 계산 로직
│   │   └── ...
│   ├── utils/                # 유틸리티 함수
│   │   ├── chartUtils.js        # 차트 데이터 처리
│   │   └── constants.js         # 상수 정의
│   ├── App.js                # 메인 애플리케이션
│   └── index.js              # 진입점
├── convex/                   # Convex 백엔드
│   ├── schema.ts                # 데이터베이스 스키마
│   ├── trades.ts                # 거래 CRUD 함수
│   ├── journals.ts              # 매매일지 함수
│   ├── strategies.ts            # 전략 관리 함수
│   └── goals.ts                 # 목표 관리 함수
├── package.json              # 의존성 관리
└── tailwind.config.js        # Tailwind 설정
```

---

## 📊 데이터베이스 스키마

### Trades (거래)
```typescript
{
  _id: Id<"trades">,
  date: string,          // 거래 날짜
  entry: number,         // 입금액
  withdrawal: number,    // 출금액
  balance: number,       // 잔고
  profit: number,        // 손익
  profitRate: number,    // 수익률 (%)
  memo?: string,         // 메모
  createdAt: number,     // 생성 시간
  updatedAt: number      // 수정 시간
}
```

### Trading Journals (매매일지)
```typescript
{
  _id: Id<"tradingJournals">,
  date: string,          // 작성 날짜
  title: string,         // 제목
  content: string,       // 내용
  mood: "good" | "bad" | "neutral", // 감정 상태
  tags?: string[],       // 태그
  createdAt: number,
  updatedAt: number
}
```

### Trading Strategies (매매전략)
```typescript
{
  _id: Id<"tradingStrategies">,
  title: string,         // 전략명
  type: "long" | "short" | "scalping" | "swing", // 전략 타입
  conditions: string,    // 진입 조건
  active: boolean,       // 활성 상태
  createdAt: number,
  updatedAt: number
}
```

### Goals (목표)
```typescript
{
  _id: Id<"goals">,
  monthlyTarget: number,   // 월 목표
  weeklyTarget: number,    // 주 목표
  yearlyTarget: number,    // 년 목표
  targetWinRate: number,   // 목표 승률
  updatedAt: number
}
```

---

## 🔧 주요 서비스 & 기능

### 1. 거래 관리 서비스
```javascript
// useConvexData.js
export const useTradesData = () => {
  const trades = useQuery(api.trades?.getAllTrades) || [];
  const addTrade = useMutation(api.trades?.addTrade);
  const updateTrade = useMutation(api.trades?.updateTrade);
  const deleteTrade = useMutation(api.trades?.deleteTrade);
  
  return { trades, addTrade, updateTrade, deleteTrade };
};
```

### 2. 실시간 수익률 계산
```javascript
// 직전 잔금 기준 수익률 계산
const calculateProfitRate = (currentBalance, previousBalance) => {
  if (previousBalance === 0) return 0;
  return ((currentBalance - previousBalance) / previousBalance) * 100;
};
```

### 3. 차트 데이터 처리
```javascript
// chartUtils.js - 일/주/월별 데이터 집계
export const processChartData = (trades, viewMode) => {
  switch (viewMode) {
    case 'daily': return processDailyData(trades);
    case 'weekly': return processWeeklyData(trades);
    case 'monthly': return processMonthlyData(trades);
  }
};
```

### 4. 모바일 최적화
- **반응형 디자인**: Tailwind CSS 브레이크포인트
- **스와이프 제스처**: 탭 전환
- **터치 최적화**: 44px 이상 버튼 크기
- **단일 컬럼 레이아웃**: 모바일 친화적

---

## 🚀 개발 환경 설정

### 1. 프로젝트 클론 및 설치
```bash
cd /Users/gimdaeseong/cc
npm install
```

### 2. Convex 설정
```bash
npx convex dev
```

### 3. 환경 변수 설정
```bash
# .env.local
REACT_APP_CONVEX_URL=http://127.0.0.1:3210
CONVEX_DEPLOYMENT=anonymous:anonymous-cc-1
```

### 4. 개발 서버 실행
```bash
# 로컬 접근
npm start

# 네트워크 접근 (모바일)
HOST=0.0.0.0 PORT=8080 npm start
```

---

## 📱 모바일 접근

### 네트워크 설정
- **로컬**: http://localhost:3000
- **네트워크**: http://192.168.45.239:8080
- **요구사항**: 같은 WiFi 네트워크

### 모바일 최적화 기능
- 스와이프 제스처로 탭 전환
- 터치 친화적 UI
- 반응형 차트
- 가상 키보드 대응

---

## 🔍 데이터 확인 방법

### 1. 웹 대시보드
```bash
npx convex dashboard
# http://127.0.0.1:6790/?d=anonymous-cc-1
```

### 2. 터미널 명령어
```bash
# 모든 테이블 확인
npx convex data

# 특정 테이블 데이터 확인
npx convex data trades
npx convex data tradingJournals
npx convex data tradingStrategies
npx convex data goals
```

### 3. 직접 데이터 추가
```bash
npx convex run trades:addTrade '{"date": "2025-07-23", "entry": 100000, "withdrawal": 0, "balance": 110000, "profit": 10000, "profitRate": 10, "memo": "테스트"}'
```

---

## 🐛 트러블슈팅

### 일반적인 문제

1. **Convex 연결 실패**
   - `npx convex dev` 재실행
   - 환경 변수 확인

2. **모바일 접근 불가**
   - 같은 WiFi 네트워크 확인
   - 방화벽 설정 점검
   - PORT=8080 사용

3. **컴파일 에러**
   - React Hook 규칙 준수
   - import 경로 확인

### 성능 최적화

1. **React 최적화**
   - useMemo, useCallback 활용
   - 불필요한 리렌더링 방지

2. **차트 최적화**
   - 데이터 가상화
   - 지연 로딩

---

## 📈 향후 개발 계획

### 단기 목표
- [ ] Convex 클라우드 배포 완료
- [ ] PWA 지원 추가
- [ ] 오프라인 모드 구현

### 중기 목표
- [ ] 다중 사용자 지원
- [ ] 실시간 알림 시스템
- [ ] 고급 분석 기능

### 장기 목표
- [ ] 모바일 앱 개발
- [ ] API 연동 (거래소)
- [ ] AI 기반 추천 시스템

---

## 👥 기여 가이드

### 코드 스타일
- ESLint 규칙 준수
- Tailwind CSS 사용
- 컴포넌트 단위 개발

### 커밋 메시지
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 리팩토링
test: 테스트 추가
```

---

## 📞 연락처

- **개발자**: Claude Code Assistant
- **프로젝트**: Crypto Day Trading Tracker
- **생성일**: 2025-07-24
- **버전**: 1.0.0