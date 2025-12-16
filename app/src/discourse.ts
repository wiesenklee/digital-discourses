import Chart, { ChartItem, ChartOptions } from 'chart.js/auto'

import { getBpkData } from './app';

(async function () {
  const bpkData = await getBpkData();

  const e1Keywords = ["migration", "asyl", "einwanderung", "abschiebung", "rückführung", "ausländer"]
  const e1Colors = ["#54A4C8", "#365E92", "#506072", "#B4A193", "#695B53", "#454136"]
  const e2Keywords = ["klimakrise", "emission", "co2", "klimawandel", "erneuerbare", "solar"]
  const e2Colors = ["#897956", "#96683F", "#D0933B", "#5A8356", "#F26A0E", "#FFDA3C"]

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          major: {
            enabled: true,
          },
          textStrokeWidth: (c) => c.tick.major ? 0.25 : 0,
          textStrokeColor: "#000"
        },
        grid: {
          lineWidth: (c) => c.tick?.major ? 1.5 : 0.5,
        },
        type: 'time',
        time: {
          displayFormats: {
            month: "MMM",
          },
          tooltipFormat: "MMMM yyyy",
        },
        stacked: true,
      },
      y: {
        ticks: {
          textStrokeWidth: (c) => c.tick.value % 50 === 0 ? 0.25 : 0,
          textStrokeColor: "#000"
        },
        stacked: true,
        grid: {
          lineWidth: (c) => c.tick.value % 50 === 0 ? 1.5 : 0.5,
        }
      },
    },
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  var chart1 = new Chart(
    document.getElementById('e1-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData.map((row: any) => row['date_y-m']),
        datasets: [
          ...e1Keywords.map((k, i) => {
            return {
              label: k,
              data: bpkData.map((row: any) => row.transcript.matchAll(new RegExp(k, "gi")).toArray().length),
              backgroundColor: e1Colors[i],
            }
          })
        ]
      },
      options: chartOptions,
    }
  );

  var chart2 = new Chart(
    document.getElementById('e2-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData.map((row: any) => row['date_y-m']),
        datasets: [
          ...e2Keywords.map((k, i) => {
            return {
              label: k,
              data: bpkData.map((row: any) => row.transcript.matchAll(new RegExp(k, "gi")).toArray().length),
              backgroundColor: e2Colors[i],
            }
          })
        ]
      },
      options: chartOptions,
    }
  );

  var lockScaleButton = document.getElementById("e-lock-scale-button") as HTMLButtonElement;

  var charMax = Math.max(chart1.scales.y.max, chart2.scales.y.max);
  chart1.options.scales!.y!.max = charMax;
  chart2.options.scales!.y!.max = charMax;
  chart1.update();
  chart2.update();

  var lockScale = true;
  lockScaleButton?.addEventListener("click", (_) => {
    if (lockScale) {
      chart1.options.scales!.y!.max = undefined;
      chart2.options.scales!.y!.max = undefined;
      lockScaleButton.textContent = "Lock Scale";
    } else {
      chart1.options.scales!.y!.max = charMax;
      chart2.options.scales!.y!.max = charMax;
      lockScaleButton.textContent = "Unlock Scale";
    }
    lockScale = !lockScale;
    lockScaleButton.classList.toggle("secondary")
    chart1.update();
    chart2.update();
  });
})();
