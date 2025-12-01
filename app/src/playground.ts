import Chart, { ChartItem } from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

import { getBpkData } from './app';

(async function () {

  const bpkData = await getBpkData();

  const startKeywords = ["test", "corona", "hitze", "fdp", "linke", "afd", "9 euro", "diesel", "streik"]
  const randomKeywords: Array<string> = [];
  for (let i = 0; i < 2; i++) {
    let w = startKeywords.at(Math.floor(Math.random() * startKeywords.length))!;
    if (randomKeywords.indexOf(w) < 0) {
      randomKeywords.push(w);
    } else { i--; }
  }

  var chart = new Chart(
    document.getElementById('playground-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData.map((row: any) => row['date_y-m']),
        datasets: [
          {
            label: 'Total Words',
            data: bpkData.map((row: any) => row['transcript_words']),
            hidden: true
          },
          ...randomKeywords.map((k) => {
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

        },
        plugins: {
          colors: {
            forceOverride: true
          },
        },
      }
    }
  );

  var addKeywordButton = document.getElementById("add-keyword-button");
  var removeKeywordButton = document.getElementById("remove-keyword-button");
  var lockScaleButton = document.getElementById("p-lock-scale-button") as HTMLButtonElement;
  var keywordInput = document.getElementById("add-keyword-input") as HTMLInputElement;
  addKeywordButton?.addEventListener("click", (_) => {
    var keyword = keywordInput.value;
    var countData: Array<Number> = [];
    if (keyword.length < 3) return;
    bpkData.forEach((d: any) => {
      countData.push(d.transcript.matchAll(new RegExp(keyword, "gi")).toArray().length)
    });
    chart.data.datasets.push({ label: `${keyword}`, data: countData });
    chart.update();
  });
  removeKeywordButton?.addEventListener("click", (_) => {
    chart.data.datasets.pop();
    chart.update();
  });

  var lockScale = false;
  lockScaleButton?.addEventListener("click", (_) => {
    if (lockScale) {
      chart.options.scales!.y!.max = undefined;
      lockScaleButton.textContent = "Lock Scale";
    } else {
      chart.options.scales!.y!.max = chart.scales.y.max;
      lockScaleButton.textContent = "Unlock Scale";
    }
    lockScale = !lockScale;
    chart.update();
  });
})();
