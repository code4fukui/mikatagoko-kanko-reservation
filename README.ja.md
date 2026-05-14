# Mikatagoko Kanko Reservation

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

富山県の「御在所湖（御在所五湖）」エリアの宿泊予約状況を可視化するウェブアプリケーションです。インタラクティブなチャートを通じて、地域の観光動向を視覚的に把握できます。

### ライブデモ

**<https://code4fukui.github.io/mikatagoko-kanko-reservation/>**

![mikatagoko-kanko-reservationアプリケーションのスクリーンショット。日付範囲にわたる宿泊率、平均日額、総客数などの観光データを折れ線と棒グラフで表示しています。](https://raw.githubusercontent.com/code4fukui/mikatagoko-kanko-reservation/main/screenshot.png)

## 機能

-   **インタラクティブな可視化**: OCC（占有レート）、ADR（平均日額）、RevPARなどの主要なメトリクスを毎日のグラフで確認できます。
-   **カスタム日付範囲**: 特定の期間を選択してチャートを動的に更新できます。
-   **データのダウンロード**: 最新の集計済み予約データをCSV形式（`latest_rsv_sum.csv`）でダウンロードできます。
-   **自動更新**: データはGitHub Actionsのワークフローを通じて、毎日JST午前3時31分に自動的に取得・更新されます。

## 重要なメトリクスの説明

このアプリケーションでは、予約状況を表すためにホスピタリティ業界の標準的なメトリクスを使用しています：

- **OCC (稼働率)**: `Booked Rooms / Total Available Rooms`
- **ADR (平均日額)**: `Total Revenue / Booked Rooms`
- **RevPAR (利用可能部屋あたりの収益)**: `Total Revenue / Total Available Rooms`（`OCC × ADR` と等価）

## データ

データは毎日自動的に取得および処理されます。

-   **データソース**: データは、福井県観光連盟が提供するAPIから取得されます。
-   **生成ファイル**:
    -   `latest_hotel.csv`: 参加施設とその客室数の一覧。
    -   `latest_rsv_sum.csv`: すべての施設の最新の予約データの集計。
    -   `data/YYYY-MM-DD.csv`: 予約データの毎日のバックアップ。

## 技術スタック

-   **フロントエンド**: HTML, JavaScript, [D3.js](https://d3js.org/), [C3.js](https://c3js.org/), [Bootstrap](https://getbootstrap.com/)
-   **データ更新バッチ**: [Deno](https://deno.land/), [GitHub Actions](https://github.com/features/actions)

## 開発環境のセットアップ

このプロジェクトをローカルで実行するには、以下の手順を実行してください。

1.  **リポジトリをクローンする:**
    ```bash
    git clone https://github.com/code4fukui/mikatagoko-kanko-reservation.git
    cd mikatagoko-kanko-reservation
    ```

2.  **環境変数を設定する:**
    データ更新スクリプト (`update.deno.ts`) は、以下の環境変数を設定する必要があります。`.env` ファイルを作成するか、シェルで設定してください。
    -   `LATEST_HOTEL_URL`: 宿泊施設リストのURL。
    -   `LATEST_RESERVATION_URL`: 予約状況データのURL。

3.  **更新スクリプトを実行する:**
    このコマンドで最新のデータを取得し、必要なCSVファイルを生成します。
    ```bash
    deno run -A --unstable update.deno.ts
    ```

4.  **ブラウザで表示する:**
    `index.html` をウェブブラウザで開いて、ローカルのCSVデータでチャートを表示してください。

## データソースとクレジット

- データソース: [福井県観光データ分析システム「FTAS」](https://www.fuku-e.com/feature/detail_266.html) by [福井県観光連盟](https://www.fuku-e.com/)
- データ収集とアプリ: [GitHubでオープンソース](https://github.com/code4fukui/mikatagoko-kanko-reservation/) by [Code for FUKUI](https://code4fukui.github.io/)

## ライセンス

このプロジェクトは[MIT License](LICENSE)の下でライセンスされています。

## デモ

-   **本アプリケーション**
    -   <https://code4fukui.github.io/mikatagoko-kanko-reservation/>
-   **その他のエリア**
    -   福井県内の他エリアの宿泊予約状況については、[福井県観光データ分析システム「FTAS」](https://www.fuku-e.com/FTAS) の `１−３）` をご確認ください。

## 主な機能

-   **予約状況の可視化**: 客室稼働率 (OCC)、客室平均単価 (ADR)、RevPARなどの指標を日別グラフで表示します。
-   **期間指定**: 任意の期間を指定して、グラフを動的に更新できます。
-   **データダウンロード**: 最新の集計済み予約データをCSV形式 (`latest_rsv_sum.csv`) でダウンロードできます。
-   **自動データ更新**: GitHub Actionsにより、毎日午前3時31分 (JST) にデータが自動で更新されます。
-   **更新失敗通知**: データ更新に失敗した場合、Slackに通知が送信されます。

## 主な指標

本アプリケーションでは、宿泊業界で一般的に利用される以下の指標を用いています。

-   **客室稼働率 (OCC - Occupancy Rate)**: `Reserved rooms / Total available rooms`
-   **客室平均単価 (ADR - Average Daily Rate)**: `Total revenue / Reserved rooms`
-   **RevPAR (Revenue Per Available Room)**: `Total revenue / Total available rooms` (Equivalent to OCC × ADR)

## データについて

本アプリケーションで利用しているデータは、GitHub Actionsを通じて毎日自動的に取得・更新されています。

- **データソース**: 福井県観光連
