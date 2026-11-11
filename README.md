# こんにゃくで、群馬をおいしく。 | 樹徳高等学校 2SS1班

群馬の名産こんにゃくを使って農家の方を間接的に支援し、群馬を盛り上げる探究プロジェクトのサイトです。

- 公開サイト: Render Static Site
- 技術: HTML + CSS + バニラJavaScript
- ビルド不要の静的サイト
- 商品: こんにゃく粉入りいちごクレープ。販売店はヤツドキクレープ。販売日・価格は確認後に掲載

## 開発

```bash
python3 -m http.server 8000 --directory .
# http://localhost:8000
```

## デプロイ（Render）

- Build Command: （空欄）
- Publish Directory: `.`

## 構成

- `index.html` — プロジェクト紹介サイト
- `product/index.html` — 商品ページ（将来の移設を想定した独立ページ）
- `survey/index.html` — クレープの感想アンケート（独自UI。Firebase送信機能は未接続）
- `assets/brand.css` — 共通デザイン（シンプルで見やすいポップなブランド表現）
- `assets/brand.js` — 控えめなスクロール表示アニメーション
- `assets/product.css` — 商品ページ専用のレイアウト・装飾
- `assets/product.js` — 商品ページのヘッダー演出とナビゲーション
- `assets/product-crepe.webp` — 商品イメージ（WebP、PNGフォールバックあり）
- `assets/strawberry-illustration.webp` — 苺のイラスト（WebP、PNGフォールバックあり）
- `assets/crepe-illustration.svg` — オリジナルのクレープイラスト
- `404.html` — ページが見つからないときの案内
- `robots.txt` — 検索エンジン向け設定

## アンケート画面

`/survey/` でアンケート画面を確認できます。現在は画面と入力項目のプレビューで、回答を送信・保存する機能はまだ接続していません。Firebase接続時は `survey/index.html` の `submitSurvey` 関数に保存処理を実装し、回答日時はサーバー側のタイムスタンプで記録してください。

## 更新するとき

- **活動記録**: `index.html` の「活動記録」セクションを更新する
- **フェーズ**: 商品ページとプロジェクト紹介ページの表記を揃えて更新する
- **商品情報**: `product/index.html` にいちごクレープとヤツドキクレープの情報を掲載する。販売日・価格は確認後に反映する
- **SNS**: アカウントが決まったら「今後の予定」にリンクを追加する
- **OGP**: 公開URLが決まったら `og:url` と `og:image` を追加する（現在は画像なし）

## メモ

- 商品ページのクレープ・苺イラストは提供された画像をWebP化して使用しています。実際の商品写真が用意できたら置き換えられます。
- 商品ページを学校サーバーへ移すときは、`assets/brand.css`、`assets/product.css`、`assets/product.js`、画像・アイコンも一緒に配置するか、参照先を調整してください。
- スクロール演出はOSの「視差効果を減らす」設定が有効な場合、自動的に停止します。
