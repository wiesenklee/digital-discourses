import Chart, { type ChartEvent, type ChartItem } from "chart.js/auto";
import bpk from '../bpk.json' with { type: 'json' }
import { scaleOptions } from "./app";

const migrationKeywords = [
  { label: "migration", color: "#6E66D4" },
  { label: "asyl", color: "#BFABCC" },
  { label: "einwanderung", color: "#B8B8FF" },
  { label: "abschiebung", color: "#0024CC" },
  { label: "rückführung", color: "#025BFD" },
  { label: "ausländer", color: "#298ebdff" }
];
const climateKeywords = [
  { label: "co2", color: "#B06A28" },
  { label: "emission", color: "#D99E73" },
  { label: "klimakrise", color: "#AD9295" },
  { label: "klimawandel", color: "#BCD382" },
  { label: "erneuerbare", color: "#FFCFC4" },
  { label: "solar", color: "#FF7340" },
];

(async function () {
  const bpkData = (bpk as { data: Array<object> })["data"];

  const timeEvents = [
    { date: new Date(2020, 11 - 1, 1), title: "Youtube liefert keine Daten" },
    { date: new Date(2021, 9 - 1, 1), title: "Bundestagswahl 2021" },
    { date: new Date(2022, 2 - 1, 1), title: "Ukraine Invasion" },
    { date: new Date(2022, 11 - 1, 1), title: "COP 27 - Klimakonferenz" },
    { date: new Date(2023, 10 - 1, 1), title: "Gaza-Israel Krieg" },
    { date: new Date(2024, 1 - 1, 1), title: "Correktiv-Recherche: Remigration" },
    { date: new Date(2024, 9 - 1, 1), title: "Beginn von Binnen-Grenzkontrollen" },
    { date: new Date(2025, 2 - 1, 1), title: "Bundestagswahl 2025" },
  ]

  let activeDate: Date | undefined = undefined;

  function onHover(e: ChartEvent, _: any, c: Chart) {
    const date = new Date(new Date(c.scales.x!.getValueForPixel(e.x!)!).toDateString())
    date.setDate(1)
    if (activeDate !== date) {
      activeDate = date;
      climateChart.update();
    }
  }

  const timeEventPlugin = {
    id: "time-events",
    afterDraw: (chart: Chart) => {
      const bottom = chart.canvas.id === "climate-chart";
      const ctx = chart.ctx;
      const xAxis = chart.scales.x!;
      const yAxis = chart.scales.y!;

      ctx.save();
      ctx.strokeStyle = "#6e6e6eff";
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 1;

      let depth = 1;
      let activeEvent: { x: number, y: number, t: string } | undefined;
      timeEvents.forEach((t, i) => {
        const xValue = xAxis!.getPixelForValue(t.date.getTime());
        ctx.beginPath();
        ctx.moveTo(xValue, yAxis.top);
        ctx.setLineDash([5, 5])
        ctx.lineTo(xValue, yAxis.bottom);
        ctx.stroke();
        ctx.setLineDash([])
        ctx.closePath();
        if (bottom) {
          let yValue = yAxis.top + 20;
          // Check if near previous event
          if (i > 0 && Math.abs(xAxis!.getPixelForValue(timeEvents[i - 1]!.date.getTime()) - xValue) < 30) {
            yValue += 25 * depth;
            depth++;
          } else depth = 1;
          ctx.beginPath();
          let size = 8;
          ctx.moveTo(xValue - size, yValue);
          ctx.lineTo(xValue, yValue + size)
          ctx.lineTo(xValue + size, yValue)
          ctx.lineTo(xValue, yValue - size)
          ctx.lineTo(xValue - size, yValue);
          ctx.fill();
          ctx.closePath();
          if (t.date.toDateString() === activeDate?.toDateString()) {
            activeEvent = { x: xValue, y: yValue, t: t.title };
          }
        }
      });
      if (activeEvent !== undefined) {
        ctx.beginPath();
        ctx.font = "bold 10pt sans-serif";
        const padding = 5;
        const height = 20;
        const width = ctx.measureText(activeEvent.t).width + padding
        const x = activeEvent.x - width / 2;
        const y = activeEvent.y - 10;
        ctx.moveTo(x, y)
        ctx.lineTo(x - height / 2, y + height / 2);
        ctx.lineTo(x, y + height)
        ctx.rect(x, y, width, 20)
        ctx.moveTo(x + width, y)
        ctx.lineTo(x + width + height / 2, y + height / 2);
        ctx.lineTo(x + width, y + height)
        ctx.fill()
        ctx.fillStyle = "#fff";
        ctx.fillText(activeEvent.t, activeEvent.x - (width / 2) + padding / 2, activeEvent.y)
        ctx.closePath();
      }
      ctx.restore();
    }
  }

  const paddingTopLegendPlugin = {
    id: "padding-top-legend",
    beforeInit(chart: Chart) {
      // Get a reference to the original fit function
      const origFit = chart.legend!.fit;
      chart.legend!.fit = function fit() {
        origFit.bind(chart.legend)();
        // Change the height to any desired value
        this.height += 12 + 8;
      }
    }
  }

  let migrationChart = new Chart(
    document.getElementById("migration-chart") as ChartItem,
    {
      type: "bar",
      data: {
        labels: bpkData.map((row: any) => row["date_y-m"]),
        datasets: [
          ...migrationKeywords.map((k) => {
            return {
              label: k.label,
              data: bpkData.map(
                (row: any) =>
                  Array.from(row.transcript.matchAll(new RegExp(k.label, "gi"))).length,
              ),
              backgroundColor: k.color,
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
        timeEventPlugin,
        paddingTopLegendPlugin,
      ],
    });
  let climateChart = new Chart(
    document.getElementById("climate-chart") as ChartItem,
    {
      type: "bar",
      data: {
        labels: bpkData.map((row: any) => row["date_y-m"]),
        datasets: [
          ...climateKeywords.map((k) => {
            return {
              label: k.label,
              data: bpkData.map(
                (row: any) =>
                  Array.from(row.transcript.matchAll(new RegExp(k.label, "gi"))).length,
              ),
              backgroundColor: k.color,
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
            title: {
              display: true,
              padding: { top: 8 },
            }
          },
        },
        onHover: onHover,
      },
      plugins: [
        timeEventPlugin,
      ],
    });

  // Force lock Y-Scale
  let chartMax = Math.max(migrationChart.scales.y!.max, climateChart.scales.y!.max);
  migrationChart.options.scales!.y!.max = chartMax;
  climateChart.options.scales!.y!.max = chartMax;
  migrationChart.update();
  climateChart.update();
})();
