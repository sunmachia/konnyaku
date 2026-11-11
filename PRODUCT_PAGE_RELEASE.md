# 商品ページ共有メモ

## 公開ページ

Renderの公開サイトURLの末尾に `/product/` を付けたページです。

```text
https://<Renderの公開URL>/product/
```

Renderの再デプロイ完了後、このURLを班のメンバーに共有してください。

## ページ内容

- こんにゃく粉入りいちごクレープの紹介
- 提供されたクレープと苺のイラスト
- ヤツドキクレープの紹介、住所・営業時間・電話番号
- Instagram、Googleマップ、埋め込み地図へのリンク
- アンケートへの導線

店舗情報は桐生市公式ページを参照しています。営業時間・定休日は変更されることがあるため、来店前に最新情報をご確認ください。掲載イラストは商品イメージであり、実際の商品写真ではありません。

## 公開範囲について

このサイトとGitHubリポジトリは公開設定です。ページURLを班内で共有できますが、URLを知る人だけに限定したアクセス制御はありません。また、Renderの公開ディレクトリはリポジトリルートのため、公開サイトには商品ページ以外の既存ページも含まれます。

## 更新ファイル

- `product/index.html` — 商品ページ
- `assets/product.css` — 商品ページ専用のスタイル
- `assets/product.js` — ヘッダー演出とセクション連動ナビ
- `assets/brand.css`、`assets/brand.js` — 共通スタイルと表示演出
- `assets/project-emblem.png` — サイトロゴ・アイコン
- `assets/product-crepe.webp`、`assets/product-crepe.png` — クレープのイラスト（WebP＋フォールバック）
- `assets/strawberry-illustration.webp`、`assets/strawberry-illustration.png` — 苺のイラスト（WebP＋フォールバック）
