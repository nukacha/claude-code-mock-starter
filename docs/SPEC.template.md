# Spec / 仕様書

> `/spec` コマンドが `docs/REQUIREMENTS.md` から自動生成します。
> 非エンジニアの方が読んでレビューできるよう、**画面ごとに「何が見えるか」を平易な日本語で書きます**。
> 技術的な詳細（コンポーネント名・API・ファイル構成など）は `<details>` で折りたたんであります。

---

## 1. 全体の構成
**画面の数**: ◯個
**画面の名前と役割**:
- トップ画面: …
- 詳細画面: …

**画面遷移**: トップ → 詳細 → …

<details>
<summary>🔧 技術的な詳細（AI用）</summary>

- Routing map: `/` → `HomePage`, `/items/:id` → `ItemDetailPage`
- State management: local component state only
- Mock API base: `/api/...` via MSW
</details>

---

## 2. 画面ごとの仕様

### 画面1: <画面の名前>
**この画面でできること / What the user can do here**
- 例: 商品一覧を見られる
- 例: 「詳細を見る」ボタンを押すと詳細画面に行ける

**画面に表示されるもの / What appears on screen**
- ヘッダー: ロゴ、ユーザー名
- メイン: 商品カードが3件
- フッター: なし

**ダミーデータ / Sample data the page shows**
- 商品名・価格・画像（実際のサーバーには繋がず、固定のダミーを表示します）

**完成チェック項目 / Visual acceptance checklist**
> AIがブラウザのスクリーンショットで自動チェックする項目です。
- [ ] 商品カードが3枚表示されている
- [ ] 各カードに商品名と価格が表示されている
- [ ] 「詳細を見る」ボタンが各カードに付いている

<details>
<summary>🔧 技術的な詳細（AI用）</summary>

- Route: `/`
- Page component: `src/pages/HomePage.tsx`
- Components used: `Card` (`src/components/ui/card.tsx`), `Button` (`src/components/ui/button.tsx`)
- Data dependencies: `GET /api/products` → MSW handler in `src/mocks/handlers.ts`
- Props/types: `type Product = { id: string; name: string; price: number }`
- Interactions: Click "詳細を見る" → `navigate('/items/' + id)`
</details>

---

## 3. 共通して使うパーツ
（2画面以上で使うものだけ列挙）
- ヘッダー: ロゴとユーザー名を表示
- ボタン: 既存の `Button` コンポーネントを再利用

---

## 4. デザインの方針
- トーン: シンプル / カジュアル / ビジネス etc.
- 主な色: 例 ブルー系
- フォント: システムデフォルト

---

## 5. 確認できなかったこと / Open questions
要件から決めきれなかった点があればここに書きます。人間の判断が必要です。
-
