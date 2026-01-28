# Colocationパターン移行計画

## 概要

現在のLayer-based構成からColocationパターンへ移行し、変更に強くテストしやすい構造を実現する。

## 目標ディレクトリ構造

```
src/
├── features/                     # 機能別フォルダ
│   ├── home/
│   │   ├── HomeScreen.tsx
│   │   ├── hooks/
│   │   │   ├── useGeolocation.ts
│   │   │   ├── useSortedRequests.ts
│   │   │   └── useSortedRequests.test.ts
│   │   ├── components/
│   │   │   ├── RequestCard.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   └── index.ts
│   │
│   ├── photo-capture/
│   │   ├── PhotoCaptureScreen.tsx
│   │   ├── hooks/
│   │   │   └── useCamera.ts
│   │   └── index.ts
│   │
│   ├── request-creation/
│   │   ├── RequestCreationScreen.tsx
│   │   ├── hooks/
│   │   │   ├── useRequestForm.ts
│   │   │   └── useRequestForm.test.ts
│   │   ├── utils/
│   │   │   ├── geocode.ts
│   │   │   ├── geocode.test.ts
│   │   │   ├── geolocation.ts
│   │   │   └── geolocation.test.ts
│   │   └── index.ts
│   │
│   ├── auth/                     # 認証関連をまとめる
│   │   ├── screens/
│   │   │   ├── SigninScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── EmailVerificationScreen.tsx
│   │   │   └── EmailVerificationRequiredScreen.tsx
│   │   ├── hooks/
│   │   │   └── useAuthRedirect.ts
│   │   ├── api/
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   └── emailVerification.ts
│   │   ├── utils/
│   │   │   ├── signupValidation.ts
│   │   │   └── signupValidation.test.ts
│   │   └── index.ts
│   │
│   └── account/
│       ├── AccountScreen.tsx
│       └── index.ts
│
├── shared/                       # グローバル共有リソース
│   ├── api/
│   │   ├── client.ts            # 旧 utils/api.ts
│   │   ├── client.test.ts
│   │   └── geocoding.ts
│   ├── components/
│   │   └── Snackbar.tsx
│   ├── context/
│   │   ├── LanguageContext.tsx
│   │   ├── LanguageContext.test.ts
│   │   └── SnackbarContext.tsx
│   ├── utils/
│   │   ├── distance.ts
│   │   ├── distance.test.ts
│   │   ├── permissionOnce.ts
│   │   └── permissionOnce.test.ts
│   ├── constants/
│   │   ├── distance.ts
│   │   ├── geocode.ts
│   │   ├── geolocation.ts
│   │   ├── map.ts
│   │   └── storage.ts
│   ├── types/
│   │   ├── api.ts
│   │   └── request.ts
│   ├── locales/
│   │   ├── en.json
│   │   └── ja.json
│   └── data/
│       └── mockRequests.ts
│
├── routes/                       # TanStack Router（変更なし）
│   └── ...
├── main.tsx
└── routeTree.gen.ts
```

---

## 移行ステップ

### Phase 1: shared/ 基盤作成

#### 1-1: shared/ フォルダ構造作成

```bash
mkdir -p src/shared/{api,components,context,utils,constants,types,locales,data}
```

#### 1-2: context/ 移動

**移動:**
- `src/context/*` → `src/shared/context/`

**import更新対象:**
- `src/main.tsx`
- `src/routes/__root.tsx`
- その他contextを使用しているファイル

#### 1-3: types/ 移動

**移動:**
- `src/types/*` → `src/shared/types/`

**import更新対象:**
- types を使用している全ファイル

#### 1-4: constants/ 移動

**移動:**
- `src/constants/*` → `src/shared/constants/`

**import更新対象:**
- constants を使用している全ファイル

#### 1-5: locales/ 移動

**移動:**
- `src/locales/*` → `src/shared/locales/`

**import更新対象:**
- `src/context/LanguageContext.tsx`（移動後は `src/shared/context/LanguageContext.tsx`）

#### 1-6: data/ 移動

**移動:**
- `src/data/*` → `src/shared/data/`

**import更新対象:**
- mockRequests を使用しているファイル

#### 1-7: utils/api.ts 移動

**移動:**
- `src/utils/api.ts` → `src/shared/api/client.ts`
- `src/utils/api.test.ts` → `src/shared/api/client.test.ts`

**import更新対象:**
- api関数を使用している全ファイル

#### 1-8: api/geocoding.ts 移動

**移動:**
- `src/api/geocoding.ts` → `src/shared/api/geocoding.ts`

**import更新対象:**
- geocoding を使用しているファイル

#### 1-9: utils/distance.ts, permissionOnce.ts 移動

**移動:**
- `src/utils/distance.ts` → `src/shared/utils/distance.ts`
- `src/utils/distance.test.ts` → `src/shared/utils/distance.test.ts`
- `src/utils/permissionOnce.ts` → `src/shared/utils/permissionOnce.ts`
- `src/utils/permissionOnce.test.ts` → `src/shared/utils/permissionOnce.test.ts`

**import更新対象:**
- distance, permissionOnce を使用しているファイル

#### 1-10: components/Snackbar.tsx 移動

**移動:**
- `src/components/Snackbar.tsx` → `src/shared/components/Snackbar.tsx`

**import更新対象:**
- Snackbar を使用しているファイル

#### 1-11: ビルド確認

```bash
npm run build
npm run test
```

---

### Phase 2: features/ 作成

#### 2-1: features/auth/ 作成

**フォルダ作成:**

```bash
mkdir -p src/features/auth/{screens,hooks,api,utils}
```

**移動:**
- `src/screens/SigninScreen.tsx` → `src/features/auth/screens/`
- `src/screens/SignupScreen.tsx` → `src/features/auth/screens/`
- `src/screens/EmailVerificationScreen.tsx` → `src/features/auth/screens/`
- `src/screens/EmailVerificationRequiredScreen.tsx` → `src/features/auth/screens/`
- `src/hooks/useAuthRedirect.ts` → `src/features/auth/hooks/`
- `src/api/auth.ts` → `src/features/auth/api/`
- `src/api/users.ts` → `src/features/auth/api/`
- `src/api/emailVerification.ts` → `src/features/auth/api/`
- `src/utils/signupValidation.ts` → `src/features/auth/utils/`
- `src/utils/signupValidation.test.ts` → `src/features/auth/utils/`

**index.ts 作成:**

```typescript
// src/features/auth/index.ts
export { SigninScreen } from "./screens/SigninScreen";
export { SignupScreen } from "./screens/SignupScreen";
export { EmailVerificationScreen } from "./screens/EmailVerificationScreen";
export { EmailVerificationRequiredScreen } from "./screens/EmailVerificationRequiredScreen";
```

#### 2-2: features/account/ 作成

**フォルダ作成:**

```bash
mkdir -p src/features/account
```

**移動:**
- `src/screens/AccountScreen.tsx` → `src/features/account/AccountScreen.tsx`

**index.ts 作成:**

```typescript
// src/features/account/index.ts
export { AccountScreen } from "./AccountScreen";
```

#### 2-3: features/photo-capture/ 作成

**フォルダ作成:**

```bash
mkdir -p src/features/photo-capture/hooks
```

**移動:**
- `src/screens/PhotoCaptureScreen.tsx` → `src/features/photo-capture/PhotoCaptureScreen.tsx`
- `src/hooks/useCamera.ts` → `src/features/photo-capture/hooks/`

**index.ts 作成:**

```typescript
// src/features/photo-capture/index.ts
export { PhotoCaptureScreen } from "./PhotoCaptureScreen";
```

#### 2-4: features/request-creation/ 作成

**フォルダ作成:**

```bash
mkdir -p src/features/request-creation/{hooks,utils}
```

**移動:**
- `src/screens/RequestCreationScreen.tsx` → `src/features/request-creation/RequestCreationScreen.tsx`
- `src/hooks/useRequestForm.ts` → `src/features/request-creation/hooks/`
- `src/hooks/useRequestForm.test.ts` → `src/features/request-creation/hooks/`
- `src/utils/geocode.ts` → `src/features/request-creation/utils/`
- `src/utils/geocode.test.ts` → `src/features/request-creation/utils/`
- `src/utils/geolocation.ts` → `src/features/request-creation/utils/`
- `src/utils/geolocation.test.ts` → `src/features/request-creation/utils/`

**index.ts 作成:**

```typescript
// src/features/request-creation/index.ts
export { RequestCreationScreen } from "./RequestCreationScreen";
```

#### 2-5: features/home/ 作成

**フォルダ作成:**

```bash
mkdir -p src/features/home/{hooks,components}
```

**移動:**
- `src/screens/HomeScreen.tsx` → `src/features/home/HomeScreen.tsx`
- `src/hooks/useGeolocation.ts` → `src/features/home/hooks/`
- `src/hooks/useSortedRequests.ts` → `src/features/home/hooks/`
- `src/hooks/useSortedRequests.test.ts` → `src/features/home/hooks/`
- `src/components/RequestCard.tsx` → `src/features/home/components/`
- `src/components/LanguageSwitcher.tsx` → `src/features/home/components/`

**index.ts 作成:**

```typescript
// src/features/home/index.ts
export { HomeScreen } from "./HomeScreen";
```

#### 2-6: ビルド確認

```bash
npm run build
npm run test
```

---

### Phase 3: routes/ 更新

#### 3-1: 各routeファイルのimport更新

**対象ファイル:**
- `src/routes/index.tsx`
- `src/routes/signin.tsx`
- `src/routes/signup.tsx`
- `src/routes/email-verification.tsx`
- `src/routes/email-verification-required.tsx`
- `src/routes/account.tsx`
- `src/routes/photo-capture.tsx`
- `src/routes/request-creation.tsx`

**例:**

```typescript
// 変更前
import { HomeScreen } from "../screens/HomeScreen";

// 変更後
import { HomeScreen } from "../features/home";
```

#### 3-2: ビルド確認

```bash
npm run build
npm run test
npm run dev  # 動作確認
```

---

### Phase 4: クリーンアップ

#### 4-1: 空フォルダ削除

以下のフォルダが空であれば削除:

```bash
rm -rf src/screens
rm -rf src/hooks
rm -rf src/utils
rm -rf src/components
rm -rf src/api
rm -rf src/context
rm -rf src/constants
rm -rf src/types
rm -rf src/locales
rm -rf src/data
```

#### 4-2: 最終確認

```bash
npm run build
npm run test
npm run dev
```

---

## 検証方法

各Phase完了後に以下を実行:

```bash
npm run build    # TypeScriptコンパイル確認
npm run test     # テスト実行
npm run dev      # 開発サーバー起動・動作確認
```

---

## リスクと対策

| リスク | 対策 |
|--------|------|
| import変更漏れ | 各Phase後にビルド確認 |
| 循環依存 | feature間の直接importを避け、shared経由 |
| テスト失敗 | 相対パスでのimportに更新 |

---

## 進捗チェックリスト

### Phase 1: shared/ 基盤作成
- [x] 1-1: shared/ フォルダ構造作成
- [x] 1-2: context/ 移動
- [x] 1-3: types/ 移動
- [x] 1-4: constants/ 移動
- [x] 1-5: locales/ 移動
- [x] 1-6: data/ 移動
- [x] 1-7: utils/api.ts 移動
- [x] 1-8: api/geocoding.ts 移動
- [x] 1-9: utils/distance.ts, permissionOnce.ts 移動
- [x] 1-10: components/Snackbar.tsx 移動
- [x] 1-11: ビルド確認

### Phase 2: features/ 作成
- [ ] 2-1: features/auth/ 作成
- [ ] 2-2: features/account/ 作成
- [ ] 2-3: features/photo-capture/ 作成
- [ ] 2-4: features/request-creation/ 作成
- [ ] 2-5: features/home/ 作成
- [ ] 2-6: ビルド確認

### Phase 3: routes/ 更新
- [ ] 3-1: 各routeファイルのimport更新
- [ ] 3-2: ビルド確認

### Phase 4: クリーンアップ
- [ ] 4-1: 空フォルダ削除
- [ ] 4-2: 最終確認
