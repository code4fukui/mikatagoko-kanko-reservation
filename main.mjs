// @ts-check
import { CSV } from "https://js.sabae.cc/CSV.js";
import { Day } from "https://js.sabae.cc/DateTime.js";
import { TimeZone } from "https://code4fukui.github.io/day-es/DateTime.js";

fromDate.setAttribute("value", new Day().toString());
toDate.setAttribute("value", new Day().dayAfter(89).toString());

const hotelData = CSV.toJSON(await CSV.fetch("./latest_hotel.csv"));
totalHotelCount.textContent = hotelData.length;
totalRoomCount.textContent = hotelData.reduce((sum, h) => {
  return sum + parseInt(h.nrooms);
}, 0);

const getChartFile = async (targetDate) => {
  const url = "./latest_rsv_sum.csv";
  const csv = await CSV.fetch(url);
  const map = {
    "n_room": "室数",
    "n_people": "利用総人数",
    "n_stay": "平均泊数",
    "amount_fee": "利用金額合計",
    "n_reserve": "予約件数",
    "date_visit": "利用開始日",
  };
  for (let i = 0; i < csv[0].length; i++) {
    csv[0][i] = map[csv[0][i]];
  }
  return CSV.toJSON(csv);
};

const makeChartColumns = (data, startday, endday, colnames) => {
  const dates = [];
  for (let d = startday; d.includes(startday, endday); d = d.dayAfter(1)) {
    dates.push(d.toStringYMD());
  }
  dates.unshift("x");

  const cols = [];
  cols.push(dates);

  const targetData = data.filter((d) => {
    const targetDate = new Day(d.利用開始日);
    return targetDate.includes(startday, endday);
  });
  for (let j = 0; j < colnames.length; j++) {
    const colname = colnames[j];

    const nrsv = Array(dates.length - 1);
    nrsv.fill(0);
    for (const d of targetData) {
      const targetDate = new Day(d.利用開始日);
      const startMsec = new Date(
        startday.year,
        startday.month - 1,
        startday.day,
      );
      const targetMsec = new Date(
        targetDate.year,
        targetDate.month - 1,
        targetDate.day,
      );
      const diffDay = parseInt((targetMsec - startMsec) / 1000 / 60 / 60 / 24);
      nrsv[diffDay] = parseInt(d[colname]);
    }
    nrsv.unshift(colname);
    cols.push(nrsv);
  }

  // 平均泊数
  for (let i = 1; i < cols[3].length; i++) {
    if (!targetData[i - 1] || parseInt(targetData[i - 1]["予約件数"]) == 0) {
      continue;
    }

    cols[3][i] =
      (parseInt(cols[3][i]) / parseInt(targetData[i - 1]["予約件数"])).toFixed(
        2,
      );
  }
  return cols;
};

const NAME_FEE = "利用金額合計";
const NAME_OCC = "客室稼働率 (OCC)";
const NAME_ADR = "客室平均単価 (ADR)";
const NAME_AVE = "客平均単価";
const NAME_REVPAR = "RevPAR (OCC x ADR)";

const showChart = (bindto, columns) => {
  const axes = {};
  for (const n of [NAME_FEE, NAME_AVE, NAME_ADR, NAME_REVPAR]) {
    axes[n] = "y2";
  }
  const chart = c3.generate({
    bindto: bindto,
    data: {
      x: "x",
      xFormat: "%Y%m%d", // 'xFormat' can be used as custom format of 'x'
      columns,
      axes,
    },
    axis: {
      x: {
        type: "timeseries",
        tick: {
          format: "%Y-%m-%d",
        },
      },
      y2: {
        show: true,
      },
    },
    tooltip: {
      format: {
        value: (value) => d3.format(",")(value),
      },
      // nullを設定するとデータのカラム順に表示される
      order: null,
    },
    regions: [
      {
        axis: "x",
        end: new Date(new Day().prevDay().toString()),
        class: "regionX",
      },
    ],
  });
};

const chartData = await getChartFile();

const show = async (startDate, endDate) => {
  if (!startDate || !endDate) {
    return;
  }

  const colnames = ["利用総人数", "室数", "平均泊数", NAME_FEE];
  const startday = new Day(startDate);
  const endday = new Day(endDate);
  const columns = makeChartColumns(chartData, startday, endday, colnames);

  const occ = [NAME_OCC];
  const adr = [NAME_ADR];
  const adr2 = [NAME_AVE];
  const revpar = [NAME_REVPAR];
  for (let i = 1; i < columns[0].length; i++) {
    // columns[0] // date
    const people = columns[1]; // 人数
    const room = columns[2]; // 室数
    const amount = columns[4]; // 利用金額合計
    if (room[i] == 0) {
      occ[i] = "";
      adr[i] = "";
      adr2[i] = "";
      revpar[i] = "";
    } else {
      const capacity = hotelData.filter((h) => {
        return new Date(h.create_file_begin_date) <=
          new Date(new Day(columns[0][i]).toString());
      }).reduce((sum, h) => {
        return sum + parseInt(h.nrooms);
      }, 0);
      occ[i] = (parseInt(room[i]) / capacity * 100).toFixed(1);
      adr[i] = (parseInt(amount[i]) / parseInt(room[i])).toFixed(0);
      adr2[i] = (parseInt(amount[i]) / parseInt(people[i])).toFixed(0);
      revpar[i] = (occ[i] / 100 * adr[i]).toFixed(0);
    }
  }
  columns.push(adr2);
  columns.push(occ);
  columns.push(adr);
  columns.push(revpar);
  showChart("#chart", columns);

  const today = new Day(TimeZone.JST);
  const spanDateElements = document.getElementsByClassName("span-date");
  Array.from(spanDateElements).forEach((element) => {
    element.innerText = `${today.year}年${today.month}月${today.day}日`;
  });
};

fromDate.onchange = () => {
  show(fromDate.value, toDate.value);
};
toDate.onchange = () => {
  show(fromDate.value, toDate.value);
};

show(fromDate.value, toDate.value);
