import 'chartjs-adapter-date-fns'
import Chart, { type ChartEvent, type ChartItem, type ChartOptions } from "chart.js/auto";
import bpk from '../bpk.json'

(async function () {
  const bpkData = (bpk as { data: Array<object> })["data"];

  const e1Keywords = [
    "migration",
    "asyl",
    "einwanderung",
    "abschiebung",
    "rückführung",
    "ausländer",
  ];
  const e1Colors = [
    "#B8B8FF",
    "#BFABCC",
    "#6E66D4",
    "#0024CC",
    "#0057BA",
    "#29BDAD",
  ]
  // Farbserie aus Karten bei Fitting 
  // const e1Colors = [
  //   "#54A4C8",
  //   "#365E92",
  //   "#506072",
  //   "#B4A193",
  //   "#695B53",
  //   "#454136",
  // ];
  const e2Keywords = [
    "co2",
    "emission",
    "klimakrise",
    "klimawandel",
    "erneuerbare",
    "solar",
  ];
  const e2Colors = [
    "#C2612C",
    "#D99E73",
    "#AD9295",
    "#BCD382",
    "#FFCFC4",
    "#FF7340",

  ]
  // Farbserie aus Karten bei Fitting 
  // const e2Colors = [
  //   "#897956",
  //   "#96683F",
  //   "#D0933B",
  //   "#5A8356",
  //   "#F26A0E",
  //   "#FFDA3C",
  // ];

  let showEvent = -1;
  const timeEvents = [
    { date: new Date(2021, 9 - 1, 1).getTime(), title: "Bundestagswahl" },
    { date: new Date(2022, 2 - 1, 1).getTime(), title: "Ukraine Krieg" },
    { date: new Date(2023, 9 - 1, 1).getTime(), title: "Gaza Krieg" },
    { date: new Date(2024, 9 - 1, 1).getTime(), title: "Remigration Recherche" },
    // { date: new Date(2025, 1 - 1, 1).getTime(), title: "Landtagswahlen Osten" },
    { date: new Date(2025, 1 - 1, 1).getTime(), title: "Abstimmung CDU mit AfD " },
    { date: new Date(2025, 2 - 1, 1).getTime(), title: "Bundestagswahl" },
  ]

  function drawTimeEvents(chart: Chart) {
    const bottom = Number(chart.id) === 3;
    const ctx = chart.ctx;
    const xAxis = chart.scales.x!;
    const yAxis = chart.scales.y!;

    ctx.save();
    ctx.strokeStyle = "#a1a1a179";
    ctx.fillStyle = "#8b8a8aff";
    ctx.lineWidth = 4;

    let depth = 1;
    let drawShowEvent: Array<() => void> = new Array();
    timeEvents.forEach((t, i) => {
      const xValue = xAxis!.getPixelForValue(t.date);
      ctx.beginPath();
      ctx.moveTo(xValue, yAxis.top);
      ctx.lineTo(xValue, yAxis.bottom);
      ctx.stroke();
      ctx.closePath();
      if (bottom) {
        let yValue = yAxis.top + 20;
        // Check if two timeEvents are near, only works for ordered array
        if (i > 0 && Math.abs(xAxis!.getPixelForValue(timeEvents[i - 1]!.date) - xValue) < 30) {
          yValue += 25 * depth;
          depth++;
        } else depth = 1;
        ctx.moveTo(xValue, yValue);
        ctx.beginPath();
        ctx.arc(xValue, yValue, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        if (showEvent == t.date) {
          drawShowEvent.push(() => {
            ctx.save()
            ctx.beginPath();
            ctx.font = "bold 10pt sans-serif";
            const width = ctx.measureText(t.title).width
            ctx.arc(xValue, yValue, 10, 0, 2 * Math.PI);
            ctx.rect(xValue, yValue - 10, width, 20)
            ctx.arc(xValue + width, yValue, 10, 0, 2 * Math.PI)
            ctx.stroke();
            ctx.fill()
            ctx.fillStyle = "#fff";
            ctx.fillText(t.title, xValue, yValue)
            ctx.closePath();
            ctx.restore()
          });
        }
      }
    });
    if (bottom && showEvent > -1) {
      drawShowEvent.forEach(f => f());
    }
    ctx.restore();
  }

  function onHover(e: ChartEvent, _: any, c: Chart) {
    if (e.native !== null) {
      const xLableIndex = c.getElementsAtEventForMode(e.native, "index", { axis: 'x' }, true)[0]!.index;
      const xLabel = c.data.labels![xLableIndex] as string;
      const xIndex = Date.parse(xLabel);
      if (timeEvents.find((event) => event.date == xIndex)) {
        showEvent = xIndex;
      } else {
        showEvent = -1;
      }
      chart2.update();
    }
  }

  type ScaleOptions = ChartOptions["scales"];
  const scaleOptions: ScaleOptions = {
    x: {
      ticks: {
        major: {
          enabled: true,
        },
        textStrokeWidth: (c) => (c.tick.major ? 0.5 : 0),
        textStrokeColor: "#000",
        maxRotation: 0,
      },
      grid: {
        lineWidth: (c) => (c.tick?.major ? 1.5 : 0.5),
      },
      type: "time",
      time: {
        displayFormats: {
          month: "MM",
        },
        tooltipFormat: "MMMM yyyy",
      },
      stacked: true,
    },
    y: {
      ticks: {
        textStrokeWidth: (c) => (c.tick.value % 50 === 0 ? 0.5 : 0),
        textStrokeColor: "#000",
      },
      stacked: true,
      grid: {
        lineWidth: (c) => c.tick.value % 50 === 0 ? 1.5 : 0.5,
      }
    }
  };
  let chart1 = new Chart(document.getElementById("e1-chart") as ChartItem, {
    type: "bar",
    data: {
      labels: bpkData.map((row: any) => row["date_y-m"]),
      datasets: [
        ...e1Keywords.map((k, i) => {
          return {
            label: k,
            data: bpkData.map(
              (row: any) =>
                row.transcript.matchAll(new RegExp(k, "gi")).toArray().length,
            ),
            backgroundColor: e1Colors[i],
          };
        }),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: scaleOptions,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      onHover: onHover,
    },
    plugins: [
      {
        id: "time-events",
        beforeDraw: drawTimeEvents,
      },
    ],
  });
  console.log(chart1)
  let chart2 = new Chart(document.getElementById("e2-chart") as ChartItem, {
    type: "bar",
    data: {
      labels: bpkData.map((row: any) => row["date_y-m"]),
      datasets: [
        ...e2Keywords.map((k, i) => {
          return {
            label: k,
            data: bpkData.map(
              (row: any) =>
                row.transcript.matchAll(new RegExp(k, "gi")).toArray().length,
            ),
            backgroundColor: e2Colors[i],
          };
        }),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: scaleOptions,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
      onHover: onHover,
    },
    plugins: [
      {
        id: "time-events",
        beforeDraw: drawTimeEvents,
      },
    ],
  });

  // Force lock Y-Scale
  let chartMax = Math.max(chart1.scales.y!.max, chart2.scales.y!.max);
  chart1.options.scales!.y!.max = chartMax;
  chart2.options.scales!.y!.max = chartMax;
  chart1.update();
  chart2.update();
})();
