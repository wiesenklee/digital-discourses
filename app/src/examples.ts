import Chart, { ChartConfiguration, ChartItem } from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

import { getBpkData } from './app';

(async function () {
  const bpkData = await getBpkData();

  const e1Keywords = ["migration", "ausländer", "asyl", "einwanderung", "abschiebung", "rückführung"]
  const e2Keywords = ["klimakrise", "klimawandel", "emission", "co2", "erneuerbare", "solar"]

  var chart1 = new Chart(
    document.getElementById('e1-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData.map((row: any) => row['date_y-m']),
        datasets: [
          ...e1Keywords.map((k) => {
            return {
              label: k,
              data: bpkData.map((row: any) => row.transcript.matchAll(new RegExp(k, "gi")).toArray().length)
            }
          })
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              display: false
            },
            stacked: true,
          },
          y: {
            stacked: true,
          },
        }
      },
    }
  );

  var chart2 = new Chart(
    document.getElementById('e2-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData.map((row: any) => row['date_y-m']),
        datasets: [
          ...e2Keywords.map((k) => {
            return {
              label: k,
              data: bpkData.map((row: any) => row.transcript.matchAll(new RegExp(k, "gi")).toArray().length)
            }
          })
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: "MMMM yyyy",
            },
            stacked: true,
          },
          y: {
            stacked: true,
          },
        }
      },
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
    chart1.update();
    chart2.update();
  });
})();
