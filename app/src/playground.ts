import { Chart, ChartItem } from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

import { getBpkData } from './bpk';

(async function () {
  const bpkData = await getBpkData();

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
          }
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
          }

        },
        plugins: {
          colors: {
            forceOverride: true
          },
        },
      }
    }
  );

  var checkKeywordButton = document.getElementById("check-keyword-button");
  var addKeywordButton = document.getElementById("add-keyword-button");
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
  checkKeywordButton?.addEventListener("click", (_) => {
    var keyword = keywordInput.value;
    var countData: Array<Number> = [];
    if (keyword.length < 3) return;
    bpkData.forEach((d: any) => {
      countData.push(d.transcript.matchAll(new RegExp(keyword, "gi")).toArray().length)
    });
    chart.data.datasets.splice(1, 1, ({ label: `${keyword}`, data: countData }));
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
    lockScaleButton.classList.toggle("secondary")
    lockScale = !lockScale;
    chart.update();
  });


  const randomSuggestions: Array<string> = [];
  let j = 8;
  for (let i = 0; i < j; i++) {
    let transcript = (bpkData.at(Math.floor(Math.random() * bpkData.length))! as any)["transcript"].split(" ");
    let random = transcript.at(Math.floor(Math.random() * transcript.length));
    if (random.charCodeAt(0) >= 65 &&
      random.charCodeAt(0) <= 90) {
      randomSuggestions.push(random);
    } else {
      if (j < 100) j++;
      else return;
    }
  }

  const suggestionKeywords = ["test", "corona", "hitze", "fdp", "linke", "afd", "9 euro", "diesel", "streik"]
  let suggestions = document.getElementById("p-suggestions")
  for (let k of randomSuggestions) {
    let span = document.createElement("span");
    span.classList.add("chip");
    span.textContent = k;
    span.addEventListener("click", (_) => {
      keywordInput.focus()
      keywordInput.value = k;
    })
    suggestions?.appendChild(span);
  }
})();
