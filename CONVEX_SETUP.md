# Convex MCP 설정 가이드

## 🚀 Convex 설치 완료

Convex MCP가 성공적으로 설치되었습니다! 다음 단계를 따라 설정을 완료하세요.

## 📋 설치된 파일들

### Convex 설정 파일
- `convex.json` - Convex 프로젝트 설정
- `convex/schema.ts` - 데이터베이스 스키마 정의
- `convex/tsconfig.json` - TypeScript 설정

### Convex 함수들
- `convex/trades.ts` - 거래 데이터 CRUD 함수
- `convex/journals.ts` - 매매일지 CRUD 함수  
- `convex/strategies.ts` - 매매전략 CRUD 함수
- `convex/goals.ts` - 목표 설정 함수

### React 통합
- `src/index.js` - ConvexProvider 추가
- `src/hooks/useConvexData.js` - Convex 데이터 훅
- `.env.local` - 환경 변수 설정

## ⚙️ 설정 단계

### 1. Convex 계정 생성 및 로그인
```bash
npx convex login
```
브라우저가 열리면 GitHub 계정으로 로그인하세요.

### 2. 프로젝트 초기화 및 배포
```bash
npx convex dev
```
이 명령은:
- 새 Convex 프로젝트를 생성합니다
- 스키마와 함수들을 자동 배포합니다
- `.env.local`에 URL을 자동 추가합니다
- `convex/_generated/api.js` 파일을 생성합니다

### 3. 환경 변수 확인
배포 후 `.env.local` 파일이 자동으로 업데이트됩니다:
```
REACT_APP_CONVEX_URL=https://your-project-name.convex.cloud
```

### 4. 연결 상태 확인
앱 헤더에서 "Convex 연결됨" 상태를 확인하세요.

## 🎯 주요 기능

### 실시간 데이터 동기화
- 모든 거래 데이터가 실시간으로 동기화됩니다
- 여러 디바이스에서 동시 접근 가능

### 타입 안전성
- TypeScript로 작성된 스키마
- 자동 타입 생성 및 검증

### 확장성
- 서버리스 아키텍처
- 자동 스케일링

## 📊 데이터 모델

### Trades (거래)
- date, entry, withdrawal, balance
- profit, profitRate, memo
- 날짜별 인덱스

### Trading Journals (매매일지)
- date, title, content, mood
- tags, 날짜별 인덱스

### Trading Strategies (매매전략)
- title, type, conditions
- active status 인덱스

### Goals (목표)
- monthly, weekly, yearly targets
- target win rate

## 🔧 사용 방법

### React 컴포넌트에서 사용
```javascript
import { useTradesData } from './hooks/useConvexData';

function MyComponent() {
  const { trades, addTrade, updateTrade, deleteTrade } = useTradesData();
  
  // 거래 추가
  const handleAddTrade = () => {
    addTrade({
      date: '2024-01-01',
      entry: 100000,
      withdrawal: 0,
      balance: 1100000,
      profit: 100000,
      profitRate: 10,
      memo: '좋은 거래'
    });
  };
  
  return (
    <div>
      {trades.map(trade => (
        <div key={trade._id}>{trade.memo}</div>
      ))}
    </div>
  );
}
```

## 🚦 다음 단계

1. Convex 계정 생성 및 프로젝트 배포
2. 환경 변수 설정
3. 기존 로컬 데이터를 Convex로 마이그레이션
4. 실시간 동기화 테스트

이제 클라우드 기반의 실시간 거래 추적 시스템을 사용할 수 있습니다! 🎉