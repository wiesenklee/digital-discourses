import Chart, { type ChartItem, type ScaleChartOptions } from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import bpk from '../bpk.json' with { type: 'json' }
import { scaleOptions, barColors } from './app';

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
        scales: (scaleOptions as ScaleChartOptions),
      }
    }
  );

  let keywordInput = document.getElementById("add-keyword-input") as HTMLInputElement;
  document.getElementById("add-keyword-button")?.addEventListener("click", (_) => {
    let keyword = keywordInput.value;
    let countData: Array<number> = [];
    if (keyword.length < 3) return;
    bpkData.forEach((d: any) => {
      let k = wholeWord ? " " + keyword + " " : keyword;
      countData.push(Array.from(d.transcript.matchAll(new RegExp(k, "gi"))).length)
    });
    chart1.data.datasets.push({ label: `${keyword}`, data: countData, backgroundColor: barColors[chart1.data.datasets.length % barColors.length] });
    chart1.update();
  });
  document.getElementById("delete-keyword-button")?.addEventListener("click", (_) => {
    chart1.data.datasets.pop();
    chart1.update();
  });

  document.getElementById("switch-auto-zoom")?.addEventListener("change", (e) => {
    if ((e.target as HTMLInputElement).checked) {
      chart1.options.scales!.y!.max = undefined;
    } else {
      chart1.options.scales!.y!.max = chart1.scales.y!.max;
    }
    chart1.update();
  });

  let wholeWord = false;
  document.getElementById("switch-whole-word")?.addEventListener("change", (e) => {
    wholeWord = (e.target as HTMLInputElement).checked;
  });

  chart1.options.scales!.y!.stacked = false;
  chart1.options.scales!.x!.stacked = false;
  document.getElementById("switch-stacked")?.addEventListener("change", (e) => {
    chart1.options.scales!.y!.stacked = (e.target as HTMLInputElement).checked;
    chart1.options.scales!.x!.stacked = (e.target as HTMLInputElement).checked;
    chart1.update();
  });

  let suggestionsDiv = document.getElementById("suggestions")
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
