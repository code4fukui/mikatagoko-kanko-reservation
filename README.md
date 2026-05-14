> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)



### `README.md` (English)

```markdown
# Mikatagoko Kanko Reservation

A web application that visualizes accommodation reservation status for the Mikatagoko (Five Lakes of Mikata) area in Fukui Prefecture, Japan. The data is presented in an interactive chart, providing insights into local tourism trends.

### Live Demo

**<https://code4fukui.github.io/mikatagoko-kanko-reservation/>**

![Screenshot of the mikatagoko-kanko-reservation application, showing a line and bar chart with tourism data like occupancy rate, average daily rate, and total guests over a date range.](https://raw.githubusercontent.com/code4fukui/mikatagoko-kanko-reservation/main/screenshot.png)

## Features

-   **Interactive Visualization**: View key metrics like Occupancy Rate (OCC), Average Daily Rate (ADR), and RevPAR on a daily graph.
-   **Custom Date Range**: Dynamically update the chart by selecting a specific period.
-   **Data Download**: Download the latest aggregated reservation data in CSV format (`latest_rsv_sum.csv`).
-   **Automated Updates**: Data is automatically fetched and updated daily at 03:31 JST via a GitHub Actions workflow.

## Key Metrics Explained

This application uses standard hospitality industry metrics to represent the reservation status:

-   **OCC (Occupancy Rate)**: `Booked Rooms / Total Available Rooms`
-   **ADR (Average Daily Rate)**: `Total Revenue / Booked Rooms`
-   **RevPAR (Revenue Per Available Room)**: `Total Revenue / Total Available Rooms` (equivalent to `OCC × ADR`)

## Data

The data is automatically retrieved and processed daily.

-   **Data Source**: The data is fetched from an API provided by the Fukui Prefectural Tourism Federation.
-   **Generated Files**:
    -   `latest_hotel.csv`: A list of participating accommodation facilities and their room counts.
    -   `latest_rsv_sum.csv`: The latest aggregated reservation data for all facilities.
    -   `data/YYYY-MM-DD.csv`: Daily backups of the reservation data.

## Tech Stack

-   **Frontend**: HTML, JavaScript, [D3.js](https://d3js.org/), [C3.js](https://c3js.org/), [Bootstrap](https://getbootstrap.com/)
-   **Data Update Batch**: [Deno](https://deno.land/), [GitHub Actions](https://github.com/features/actions)

## Development Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/code4fukui/mikatagoko-kanko-reservation.git
    cd mikatagoko-kanko-reservation
    ```

2.  **Set Environment Variables:**
    The data update script (`update.deno.ts`) requires the following environment variables to fetch data. You can create a `.env` file or set them in your shell.
    -   `LATEST_HOTEL_URL`: URL for the accommodation facility list.
    -   `LATEST_RESERVATION_URL`: URL for the reservation status data.

3.  **Run the update script:**
    This command fetches the latest data and generates the necessary CSV files.
    ```bash
    deno run -A --unstable update.deno.ts
    ```

4.  **View in Browser:**
    Open `index.html` in your web browser to see the chart rendered with the local CSV data.

## Data Source & Attribution

-   Data Source: [Fukui Prefecture Tourism Data Analysis System "FTAS"](https://www.fuku-e.com/feature/detail_266.html) by [Fukui Prefectural Tourism Federation](https://www.fuku-e.com/)
-   Data Collection & App: [Open Source on GitHub](https://github.com/code4fukui/mikatagoko-kanko-reservation/) by [Code for FUKUI](https://code4fukui.github.io/)

## License

This project is licensed under the [MIT License](LICENSE).
```

```markdown
# mikatagoko-kanko-reservation

三方五湖エリアの宿泊予約状況をグラフで分かりやすく可視化するウェブアプリケーションです。

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

-   **客室稼働率 (OCC - Occupancy Rate)**: `予約された客室数 / 販売可能な総客室数`
-   **客室平均単価 (ADR - Average Daily Rate)**: `売上合計 / 予約された客室数`
-   **RevPAR (Revenue Per Available Room)**: `売上合計 / 販売可能な総客室数` (OCC × ADR と同等)

## データについて

本アプリケーションで利用しているデータは、GitHub Actionsを通じて毎日自動的に取得・更新されています。

-   **データソース**: 福井県観光連