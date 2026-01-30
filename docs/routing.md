# ルーティング仕様

## 概要

本アプリケーションは [TanStack Router](https://tanstack.com/router) のファイルベースルーティングを採用しています。

## 自動生成ファイル

| ファイル | 説明 |
|---------|------|
| `src/routeTree.gen.ts` | ルート定義から自動生成されるファイル。開発サーバー起動時に生成・更新される。**手動編集禁止** |

## ルート定義

ルートファイルは `src/routes/` ディレクトリに配置します。

### ファイル命名規則

| パターン | 例 | 生成されるパス |
|---------|-----|---------------|
| `index.tsx` | `routes/index.tsx` | `/` |
| `[name].tsx` | `routes/signin.tsx` | `/signin` |
| `[name].[nested].tsx` | `routes/request.new.tsx` | `/request/new` |
| `[name].$param.tsx` | `routes/photo.$requestId.tsx` | `/photo/:requestId` |
| `__root.tsx` | `routes/__root.tsx` | 全ルートの親レイアウト |

### 現在のルート一覧

| ファイル | パス | 画面 |
|---------|------|------|
| `__root.tsx` | - | ルートレイアウト（Provider、Snackbar） |
| `index.tsx` | `/` | ホーム画面 |
| `signin.tsx` | `/signin` | サインイン画面 |
| `signup.tsx` | `/signup` | サインアップ画面 |
| `account.tsx` | `/account` | アカウント画面 |
| `request.new.tsx` | `/request/new` | リクエスト作成画面 |
| `photo.$requestId.tsx` | `/photo/:requestId` | 写真撮影画面 |
| `verify-email.$token.tsx` | `/verify-email/:token` | メール認証画面 |
| `email-verification-required.tsx` | `/email-verification-required` | メール認証必要画面 |

## ルートファイルの構造

各ルートファイルは `createFileRoute` を使用して定義します。

```tsx
import { createFileRoute } from "@tanstack/react-router";
import MyScreen from "../screens/MyScreen";

export const Route = createFileRoute("/my-path")({
  component: MyScreen,
});
```

### パラメータ付きルート

```tsx
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/photo/$requestId")({
  component: PhotoScreen,
});

// コンポーネント内でパラメータを取得
const { requestId } = useParams({ from: "/photo/$requestId" });
```

## 画面遷移

### useNavigate フック

```tsx
import { useNavigate } from "@tanstack/react-router";

const MyComponent = () => {
  const navigate = useNavigate();

  // 基本的な遷移
  navigate({ to: "/" });

  // パラメータ付き遷移
  navigate({
    to: "/photo/$requestId",
    params: { requestId: "123" },
  });
};
```

## 共有状態

### SnackbarContext

ルート間で共有する通知機能は `SnackbarContext` で管理します。

```tsx
import { useSnackbar } from "../context/SnackbarContext";

const MyComponent = () => {
  const { showSnackbar } = useSnackbar();

  showSnackbar("メッセージ", "success"); // "success" | "error" | "info"
};
```

## ルートレイアウト（__root.tsx）

すべてのルートの親となるレイアウトです。以下を提供します：

- `AuthProvider` - 認証状態
- `LanguageProvider` - 多言語対応
- `SnackbarProvider` - 通知機能
- `Snackbar` コンポーネント

## 新しいルートの追加方法

1. `src/routes/` に新しいファイルを作成
2. `createFileRoute` でルートを定義
3. 開発サーバーを起動（または再起動）して `routeTree.gen.ts` を再生成
4. 必要に応じて画面コンポーネントを `src/screens/` に作成

## 設定ファイル

### vite.config.ts

TanStack Router の Vite プラグインを設定しています。

```ts
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), tailwindcss()],
});
```

### biome.json

自動生成ファイルを lint 対象から除外しています。

```json
{
  "files": {
    "ignore": ["src/routeTree.gen.ts"]
  }
}
```
