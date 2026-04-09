# claude-code-mock-starter

> [Claude Code](https://docs.claude.com/ja/docs/claude-code/overview) で最速にブラウザで動くUIモックを作るためのGitHub Template

**🌐 Language**: [English](README.md) | 日本語

人間は **「こんなものが欲しい」と話すこと** と **最終レビュー** だけ。残り（要件整理・設計・実装・視覚検証・修正）はClaude Codeが自走します。
**プログラミングの知識がなくても大丈夫** — AIが対話で要件をまとめ、コードを書き、ブラウザで自分で確認して直してくれます。

---

## ✨ 特徴

- **対話的な要件定義** — `/discover` コマンドがインタビュー形式であいまいな要望を実装可能な仕様に落とし込みます。
- **Spec-Driven Workflow** — `REQUIREMENTS → SPEC → TASKS → 実装` の各段階で人間がレビュー可能。
- **視覚的な自己改善ループ** — Playwright MCP でスクリーンショットを撮り、AI自身が要件と照合・修正します。
- **強制品質ゲート** — ファイル編集ごとに `tsc` と `eslint` がhookで自動実行され、失敗するとAIが自己修正します。
- **クロスプラットフォーム** — macOS / Linux / Windows (WSL2推奨)。
- **再現性のための固定スタック** — Vite + React + TypeScript + Tailwind + shadcn/ui + MSW + React Router で固定。
- **顧客提案レベルの品質バー** — visual-critic が gap を `[VISUAL] [DATA] [INTERACTION] [STRUCTURAL]` のカテゴリでタグ付けし、構造的な不一致は fixer が部分パッチで誤魔化さず builder に差し戻して再構築させます。

---

## 🚀 クイックスタート

### 0. 事前準備
非エンジニアの方も以下2つを入れれば動かせます。

#### 必須

| 必要なもの | インストール方法 |
|--|--|
| **Claude Code** (ネイティブ版) | macOS / Linux / WSL: `curl -fsSL https://claude.ai/install.sh \| bash`<br>Windows (PowerShell): `irm https://claude.ai/install.ps1 \| iex`<br>Homebrew: `brew install --cask claude-code`<br>公式手順: <https://docs.claude.com/ja/docs/claude-code/quickstart> |
| **Node.js 24 以上** | 公式インストーラー: <https://nodejs.org/ja/download>（最新 LTS を選択）<br>※ このテンプレートが React/Vite を使うため必要です |

> 💡 以前は Claude Code 自体も Node.js 経由でインストールしていましたが、現在は **ネイティブ版**が公式の推奨方法です。Node.js は React アプリのビルドにのみ必要になります。

#### 任意

| あると便利 | 用途 |
|--|--|
| **Git** (<https://git-scm.com/downloads>) | バージョン管理したい場合のみ。後述の「ZIP ダウンロード」で進めるならなくてもOK |

インストール後、ターミナル（macOS は「ターミナル」アプリ、Windows は「PowerShell」または WSL2 のシェル）で次を実行して確認:
```bash
claude --version
node -v       # → v24.0.0 以上が出ればOK
```

### 1. テンプレートを取得
3つの方法から好きなものを選んでください。

**方法A（最も簡単・Git不要）**: ZIP をダウンロード
1. <https://github.com/nukacha/claude-code-mock-starter> を開く
2. 緑色の "**Code**" ボタン → "**Download ZIP**" をクリック
3. ダウンロードしたZIPを好きな場所に展開
4. ターミナルで展開したフォルダに移動: `cd path/to/claude-code-mock-starter-main`

**方法B（おすすめ・自分のリポジトリとして管理したい人向け）**: Use this template (要 GitHub アカウント)
1. <https://github.com/nukacha/claude-code-mock-starter> を開く
2. 緑色の "**Use this template**" → "Create a new repository" → リポジトリ名を入力して作成
3. 作ったリポジトリを自分のPCに取得（Git が必要）:
   ```bash
   git clone https://github.com/<あなたのGitHubユーザー名>/<新しいリポジトリ名>.git
   cd <新しいリポジトリ名>
   ```

**方法C（コマンド一発）**: degit (要 Node.js、Git不要)
```bash
npx degit nukacha/claude-code-mock-starter my-mock
cd my-mock
```

### 2. 依存関係のインストール
プロジェクトのフォルダに入った状態で:
```bash
npm install
npm run msw:init
```
初回は数分かかります。エラーが出た場合は Node.js のバージョン (`node -v`) が 24 以上か確認してください。

### 3. Chromium のインストール（必須）
AIは Playwright を使ってモックのスクリーンショットを撮り、自分の作業結果を確認します。Playwright は実際のブラウザを必要とするので、最初に Chromium をダウンロードします:
```bash
npx -y playwright@latest install chromium
```
初回は数百MBのダウンロードがあるので数分かかります。

**Linux / WSL2 ユーザーは追加で**（システムライブラリが必要なため）:
```bash
sudo npx -y playwright@latest install-deps chromium
```
パスワードを聞かれたら PC のログインパスワードを入力してください。macOS / Windows ネイティブでは不要です。

> 💡 **`claude mcp add playwright ...` を実行する必要はありません。** このテンプレートは Playwright MCP サーバーの定義を [visual-critic agent](.claude/agents/visual-critic.md) のフロントマターに直接埋め込んでいるので、必要な時だけ自動で起動し、エージェント終了時に自動で停止します。初回 `/loop`（または `/review`）実行時に Claude Code がセキュリティ確認のプロンプトを出すので、一度承認すれば以降は自動で動きます。
>
> ブラウザのダウンロード先: macOS は `~/Library/Caches/ms-playwright/`、Linux/WSL は `~/.cache/ms-playwright/`、Windows は `%USERPROFILE%\AppData\Local\ms-playwright\`

### 4. Claude Code を起動
プロジェクトのフォルダで:
```bash
claude
```
ターミナル内に対話画面が立ち上がります。

### 5. 4ステップでモック完成
Claude Code の対話画面で、以下を順番に入力します。`/` で始まるコマンドを打つだけ。
```
/discover    # 1. AIが質問してくるので答えるだけ → 要件定義書ができる
/spec        # 2. AIが要件を仕様書に変換
/tasks       # 3. AIが仕様書を実装タスクに分解
/loop        # 4. AIが自分で実装→確認→修正を繰り返す（手放しでOK）
```
それぞれの間に「この内容で進めて良いですか？」と確認されます。中身を読んで問題なければ次へ進めてください。

ループ完了後、別のターミナルウィンドウで以下を実行するとブラウザで完成したモックを確認できます:
```bash
npm run dev
```
表示されたURL（通常は http://127.0.0.1:5173 ）をブラウザで開いてください。

修正したい点があれば、最も簡単なのは **`/refine`** コマンドです。次のセクションを参照してください。

---

## 🔁 成果物に満足できなかった時: `/refine`

`/refine` は自然言語のフィードバックを受け取り、それに対応する**最小限の変更**を判断して実行します。**全部を最初から作り直したりしません** — 必要な部分だけを書き換えるので、既にできている作業を失わずに済みます。

```
/refine ダッシュボードのグラフを棒グラフじゃなくて折れ線にして
/refine 商品ページに検索ボックスを追加して
/refine 全体的にビジネスっぽすぎる、もっとカジュアルにしたい
```

フィードバックの**深さを自動判定**して、必要最小限の範囲だけを実行します:

| 深さ | `/refine` がやること | 例 |
|--|--|--|
| **SURFACE** | 1〜3個のソースファイルを編集。該当ページだけ visual-critic で確認。**doc 更新なし** | 「ボタンを大きく」「ヘッダーの誤字を直して」「カードの色を青に」 |
| **TARGETED** | SPEC の該当画面セクションと TASKS の該当タスクだけ surgical に更新。そのタスク1つだけ builder→critic→fixer で回す | 「ダッシュボードに検索ボックス追加」「商品カードに価格を表示」「設定画面を追加」 |
| **STRUCTURAL** | REQUIREMENTS.md を surgical に更新。どう波及させるか確認 (`/spec` 再実行 / 複数セクションの surgical 更新 / 一旦保存だけ) | 「ターゲットを B2B から一般消費者に変更」「全体をダークテーマに」 |

**なぜこれが重要か**: 小さな変更のたびに `/discover → /spec → /tasks → /loop` を全部回すのは時間の無駄で、AI が既に承認済みの部分まで再判断してしまうリスクもあります。`/refine` は既存の作業を保持したまま必要最小限だけ変更します。

もし `/refine` の深さ判定が違っていたら「これはもっと大きな変更だよ」と伝えれば再分類してくれます。

### `/refine` を使わない方が良い場合
- **既存の要件に収まらない全く新しい画面を追加したい** → `/discover` で先に REQUIREMENTS を更新してから続ける
- **全部捨ててやり直したい** → `docs/REQUIREMENTS.md` `docs/SPEC.md` `docs/TASKS.md` を削除して `/discover` から
- **コマンドを使うほどでもない会話レベルの調整** → コマンドを使わずに Claude Code に直接話しかければOK。`/refine` は「変更を doc/タスク システムで追跡したい時」のためのもの

---

## ⚡ 補足: `/loop` を完全に手放しで動かしたい場合

`/loop` は AI が自動でファイル編集や `npm` コマンドを実行しますが、デフォルトでは操作のたびに「このコマンドを実行してよいですか？」と確認を求められます。**席を離れている間にAIが止まってしまうのが嫌な場合**は、Claude Code を「権限スキップモード」で起動できます。

```bash
claude --dangerously-skip-permissions
```

このモードで起動すると、確認プロンプトが出ずに `/loop` が完全に手放しで進みます。コーヒーを淹れている間や寝ている間にモックを完成させたい時に便利です。

### ⚠️ 使う前に知っておくこと
- **名前の通り「危険」なオプション**です。AIが暴走した場合に止める機会がなくなります。
- このテンプレートでは [.claude/settings.json](.claude/settings.json) で `rm -rf` や `git push --force` などの破壊的コマンドを禁止していますが、それ以外のリスクは残ります。
- **使ってよい場面**:
  - このテンプレートのように、ファイル変更が `src/` 以下に限定されていて、Git でいつでも巻き戻せる状況
  - 手元のマシンで動かしていて、外部システムへの影響がない時
- **使うべきでない場面**:
  - 大事なファイルがあるフォルダで作業している時
  - 本番環境や共有サーバーに繋がっている時
  - 何が起きてるか確認したい時（最初の数回は通常モードで動かして挙動を理解してから）

### 安全に使うコツ
1. 最初の数回は **通常モード** で `/loop` を回して、AIがどんな動きをするか観察する
2. 慣れてきて、結果を Git でこまめにコミットしている状態なら `--dangerously-skip-permissions` を試す
3. 何かおかしいと感じたら `Ctrl+C` でいつでも止められます

---

## 🪟 Windows ユーザーへ

WSL2（Windows Subsystem for Linux 2）の上で動かすことを強くおすすめします。Claude Code と Playwright MCP の動作が安定し、トラブルが少ないためです。

**WSL2 のセットアップ**: <https://learn.microsoft.com/ja-jp/windows/wsl/install>

WSL2 を入れた後、Ubuntu のターミナルで:
```bash
# Node.js 24 をインストール（nvm 経由がおすすめ）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# 一度ターミナルを開き直してから:
nvm install 24
nvm use 24
node -v   # → v24.x.x が出ればOK
```
以降は上記クイックスタートと同じ手順です。

---

## 🔄 自己改善ループの仕組み

### 全体フロー
人間がレビューするのは ✋ の3箇所だけ。それ以降の `/loop` は手放しで動きます。

```mermaid
flowchart TD
    A([👤 あいまいな要望]) --> B[/discover<br/>対話で要件定義/]
    B --> R1{✋ 人間レビュー}
    R1 --> C[/spec<br/>実装可能な仕様へ/]
    C --> R2{✋ 人間レビュー}
    R2 --> D[/tasks<br/>小さな実装単位へ分解/]
    D --> R3{✋ 人間レビュー}
    R3 --> E[/loop<br/>以降ハンズオフ 🤖/]
    E --> F([🎉 完成したモック])

    style A fill:#b45309,stroke:#78350f,stroke-width:2px,color:#ffffff
    style B fill:#1e3a8a,stroke:#0f172a,stroke-width:2px,color:#ffffff
    style C fill:#1e3a8a,stroke:#0f172a,stroke-width:2px,color:#ffffff
    style D fill:#1e3a8a,stroke:#0f172a,stroke-width:2px,color:#ffffff
    style E fill:#1d4ed8,stroke:#0f172a,stroke-width:2px,color:#ffffff
    style F fill:#047857,stroke:#064e3b,stroke-width:2px,color:#ffffff
    style R1 fill:#b91c1c,stroke:#7f1d1d,stroke-width:2px,color:#ffffff
    style R2 fill:#b91c1c,stroke:#7f1d1d,stroke-width:2px,color:#ffffff
    style R3 fill:#b91c1c,stroke:#7f1d1d,stroke-width:2px,color:#ffffff
```

### `/loop` の中で起きていること
```mermaid
flowchart TD
    Start([次のタスク]) --> Builder[🛠 builder agent<br/>コードを書く]
    Builder --> Hook{post-edit hook<br/>typecheck + lint}
    Hook -->|fail| Builder
    Hook -->|pass| Critic[👀 visual-critic agent<br/>Playwright で<br/>スクリーンショット検証<br/>＋ gap をタグ付け]
    Critic --> Verdict{判定}
    Verdict -->|PASS ✅| Next([次のタスクへ])
    Verdict -->|FAIL ❌| Fixer[🔧 fixer agent<br/>差分を診断]
    Fixer -->|VISUAL/DATA/<br/>INTERACTION| Patch[最小修正でパッチ]
    Patch --> Hook
    Fixer -->|STRUCTURAL ⚠️| Builder
    Verdict -->|3回連続 FAIL| Escalate([🚨 人間に<br/>エスカレーション])

    style Start fill:#1d4ed8,stroke:#0f172a,stroke-width:2px,color:#ffffff
    style Next fill:#047857,stroke:#064e3b,stroke-width:2px,color:#ffffff
    style Escalate fill:#b91c1c,stroke:#7f1d1d,stroke-width:2px,color:#ffffff
    style Builder fill:#b45309,stroke:#78350f,stroke-width:2px,color:#ffffff
    style Critic fill:#b45309,stroke:#78350f,stroke-width:2px,color:#ffffff
    style Fixer fill:#b45309,stroke:#78350f,stroke-width:2px,color:#ffffff
    style Patch fill:#b45309,stroke:#78350f,stroke-width:2px,color:#ffffff
    style Hook fill:#374151,stroke:#0f172a,stroke-width:2px,color:#ffffff
    style Verdict fill:#374151,stroke:#0f172a,stroke-width:2px,color:#ffffff
```

3回連続で FAIL すると人間にエスカレーションします。

### なぜ builder と fixer を分けているのか
fixer は visual-critic からの gap レポートを **fresh なコンテキスト** で診断するために存在します。同じ builder に「自分の実装の欠点を直して」と頼むよりも、新しい agent に判断させた方がサンクコストバイアスが入りません。顧客提案レベルの品質を狙う場合、これによって:
- 診断からサンクコストバイアスを除去
- タスクごとのリトライカウンタが clean に保たれる
- fixer が**最小限の的を絞ったパッチ**を作れる
- **構造的に間違った実装には部分パッチを当てない** — fixer は `[STRUCTURAL]` タグの gap を builder に差し戻し、テープで覆い隠さず正しく作り直させます

---

## 📁 ディレクトリ構成

```
.
├── CLAUDE.md                # Claude Code 全体ルール
├── README.md                # 英語版（プライマリ）
├── README.ja.md             # このファイル
├── docs/
│   ├── REQUIREMENTS.template.md
│   ├── SPEC.template.md
│   └── TASKS.template.md
├── src/
│   ├── App.tsx              # ルーティング
│   ├── main.tsx             # MSW起動含むエントリ
│   ├── pages/               # 1ファイル = 1画面
│   ├── components/ui/       # shadcn/ui スタイルの基本部品
│   ├── components/          # 自作コンポーネント
│   ├── mocks/handlers.ts    # MSWハンドラ (全API)
│   └── lib/utils.ts         # cn() などの小さなユーティリティ
└── .claude/
    ├── settings.json        # hooks / 権限設定
    ├── commands/            # /discover /spec /tasks /loop /review
    ├── agents/              # builder / visual-critic / fixer / planner
    ├── hooks/               # cross-platform Node hooks
    └── skills/              # on-demand パターン集
```

---

## ❓ よくあるトラブル

| 症状 | 対処 |
|--|--|
| `command not found: node` / `npm` | Node.js が入っていません。<https://nodejs.org/ja/download> から LTS 版をインストール |
| `command not found: claude` | Claude Code が未インストール。`curl -fsSL https://claude.ai/install.sh \| bash`（macOS/Linux/WSL）または `irm https://claude.ai/install.ps1 \| iex`（Windows） |
| `npm install` でエラー | `node -v` が `v24` 以上か確認。古ければ Node.js を更新 |
| `/loop` で「Playwright MCP が見つからない」 | MCP サーバーは visual-critic agent に埋め込まれています。初回 `/loop` 実行時のセキュリティプロンプトを承認したか確認してください。再度プロンプトを出すには `claude mcp reset-project-choices` を実行してから `/loop` を再実行 |
| Linux/WSL で `chromium` 起動エラー (`error while loading shared libraries`) | `sudo npx playwright install-deps chromium` を実行してシステムライブラリを入れる |
| ブラウザに何も表示されない | ターミナルで `npm run dev` が動いているか、URL (http://127.0.0.1:5173) が正しいか確認 |
| Windows でうまく動かない | WSL2 上で実行することを強く推奨（上記セクション参照） |

困ったら Claude Code に「○○というエラーが出た」と話しかければ、ほとんどの場合解決方法を教えてくれます。

---

## 🛠 利用可能なnpmスクリプト

| Script | 内容 |
|--|--|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | TypeScript build + Vite production build |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |

---

## 🤝 参考
- [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)
- [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- [github/spec-kit](https://github.com/github/spec-kit)
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)

---

## 📄 License
MIT
