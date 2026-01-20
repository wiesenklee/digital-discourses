import 'chartjs-adapter-date-fns'
import Chart, { type ChartItem } from 'chart.js/auto'
import bpk from '../bpk.json';

(async function () {
  const bpkData = (bpk as { data: Array<object> })["data"];

  let chart1 = new Chart(
    document.getElementById('playground-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData.map((row: any) => row['date_y-m']),
        datasets: []
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

  let checkKeywordButton = document.getElementById("check-keyword-button");
  let addKeywordButton = document.getElementById("add-keyword-button");
  let deleteKeywordButton = document.getElementById("delete-keyword-button");
  let keywordInput = document.getElementById("add-keyword-input") as HTMLInputElement;

  addKeywordButton?.addEventListener("click", (_) => {
    let keyword = keywordInput.value;
    let countData: Array<Number> = [];
    if (keyword.length < 3) return;
    bpkData.forEach((d: any) => {
      countData.push(d.transcript.matchAll(new RegExp(keyword, "gi")).toArray().length)
    });
    chart1.data.datasets.push({ label: `${keyword}`, data: countData });
    chart1.update();
  });
  checkKeywordButton?.addEventListener("click", (_) => {
    let keyword = keywordInput.value;
    let countData: Array<Number> = [];
    if (keyword.length < 3) return;
    bpkData.forEach((d: any) => {
      countData.push(d.transcript.matchAll(new RegExp(keyword, "gi")).toArray().length)
    });
    chart1.data.datasets.splice(0, 1, ({ label: `${keyword}`, data: countData }));
    chart1.update();
  });
  deleteKeywordButton?.addEventListener("click", (_) => {
    chart1.data.datasets = [];
    chart1.update();
  });

  let autoZoom = document.getElementById("p-auto-zoom") as HTMLInputElement;
  autoZoom?.addEventListener("change", (e) => {
    if ((e.target as HTMLInputElement).checked) {
      chart1.options.scales!.y!.max = undefined;
    } else {
      chart1.options.scales!.y!.max = chart1.scales.y!.max;
    }
    chart1.update();
  });

  let suggestionsDiv = document.getElementById("p-suggestions")
  let newSuggestionsButton = document.getElementById('new-suggestions') as HTMLButtonElement;
  newSuggestionsButton.addEventListener('click', () => {
    addSuggestions(generateRandomSug());
  });
  addSuggestions(generateRandomSug());

  function generateRandomSug(): Array<string> {
    const randomSuggestions: Array<string> = [];
    let j = 8;
    for (let i = 0; i < j; i++) {
      let transcript = (bpkData.at(Math.floor(Math.random() * bpkData.length))! as any)["transcript"].split(" ");
      let random = transcript.at(Math.floor(Math.random() * transcript.length));
      if (random.charCodeAt(0) >= 65 &&
        random.charCodeAt(0) <= 90) {
        randomSuggestions.push(random);
      } else {
        if (j < 150) j++;
        else return [];
      }
    }
    return randomSuggestions;
  }
  function addSuggestions(sugList: Array<string>) {
    suggestionsDiv!.innerHTML = '';
    for (let k of sugList) {
      let span = document.createElement("span");
      span.classList.add("chip");
      span.textContent = k;
      span.addEventListener("click", (_) => {
        keywordInput.focus()
        keywordInput.value = k;
      })
      suggestionsDiv!.appendChild(span);
    }
  }

})();
