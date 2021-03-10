# Gulp Template

For node v14.15.4

## npm パッケージをインストール

```
#プロジェクトのディレクトリに移動して
$ npm install
```

## gulp の監視

```
$ gulp
```

## 納品ファイル生成

デプロイ用のファイル一式を生成

```
$ gulp build
```

## ディレクトリ構成

./src/ 内のファイルを編集

- pug -> html
- js -> babel -> js
- sass -> css

```
├─ node_modules/
│  └─ パッケージ各種
│
├─ dist/（ビルド後、納品ファイルがここに生成される）
│  ├─ assets/
│  │  ├─ fonts/
│  │  ├─ images/
│  │  ├─ css/
│  │  └─ js/
│  └─ index.html など
│
├─ src/（ビルド前のソース）
│  ├─ fonts/
│  ├─ html/ (直にHTMLを生成する場合)
│  ├─ images/
│  ├─ javascript/
│  ├─ js/
│  │  ├─ _app/
│  │  ├─ _core/
│  │  └─ functions.js など
│  ├─ pug/
│  │  ├─ _template/
│  │  └─ index.pug
│  └─ sass/
│      ├─ _base/
│      ├─ _mixin/
│      ├─ _module/
│      ├─ _page/
│      │  └─ _index/
│      ├─ _pulgins/
│      ├─ _setting/
│      └─ style.scss
│
├─ postcss-sorting.json
├─ .eslintrc.json
├─ gulpfile.js
├─ package.json
└─ README.md
```
