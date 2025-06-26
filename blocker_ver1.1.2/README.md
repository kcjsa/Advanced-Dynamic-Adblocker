# YT & Global Adblocker

## 概要

YouTube広告、および主要なウェブ広告ドメインを完全にブロックする Chrome 拡張機能です。  
`declarativeNetRequest` API を使用して動的にルールを更新しています。

## 特徴

- YouTube広告通信の完全ブロック
- Facebook / Twitter / Google / LinkedIn / AppNexus など主要広告ネットワークを遮断
- Manifest V3 対応（Service Worker）
- モジュール統合でシンプルな構成

## インストール方法

1. このフォルダを保存
2. Chrome で `chrome://extensions` にアクセス
3. 「デベロッパーモード」ON → 「パッケージ化されていない拡張機能を読み込む」→ このフォルダ選択

## 今後の拡張案

- オプション画面からのルール制御
- フィルターの外部自動更新
- ポップアップUI

