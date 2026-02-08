# Seeun Course

여자친구를 위한 이벤트 페이지 & 데이트 코스 저장 프로젝트

## 기술 스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## 프로젝트 구조

```
src/app/
├── event/[slug]/    # 이벤트 페이지
└── date/[slug]/     # 데이트 코스 페이지
```

## 이미지 관리

public 폴더에 라우트 구조와 동일하게 이미지를 배치한다.

```
public/
├── event/
│   ├── will-you-come-to-suwon/
│   │   ├── hero.jpg
│   │   └── ...
│   └── [slug]/
└── date/
    └── [slug]/
```

## 반응형 규칙

- 모바일 우선(Mobile First)으로 작성한다.
- Tailwind 브레이크포인트 순서: 기본(모바일) → `sm:` → `md:` → `lg:`
- 기본 패딩: `px-4` → `sm:px-6`
- 기본 폰트: 작은 사이즈 → `sm:`에서 한 단계 키움
- 간격: `gap-6` → `sm:gap-8`
