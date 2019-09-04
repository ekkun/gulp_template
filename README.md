# Gulp Template

## npmパッケージをインストール

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

+ pug -> html
+ js -> babel -> js
+ sass -> css

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
│  ├─ html/ (直にHTMLを生成する場合)
│  ├─ fonts/
│  ├─ images/
│  ├─ sass/
│  │  ├─ _partial/
│  │  ├─ _base/
│  │  ├─ _mixin/
│  │  ├─ _module/
│  │  ├─ _page/
│  │  ├─ _pulgins/
│  │  ├─ _setting/
│  │  └─ style.scss
│  ├─ js/
│  │  ├─ _core/
│  │  ├─ _app/
│  │  └─ functions.js など
│  └─ index.pug など
│
├─ postcss-sorting.json
├─ .eslintrc.json
├─ gulpfile.js
├─ package.json
└─ README.md
```

