import Chart, { ChartItem } from "chart.js/auto";

import 'chartjs-adapter-date-fns'
import bpk from 'url:./bpk.json'

let bpkData: Array<object> | undefined = undefined;

export async function getBpkData() {
  while (bpkData === undefined) {
    await new Promise((r) => setTimeout(r, 200));
  }
  return bpkData;
}

export let primaryColor: string = window.getComputedStyle(document.body).getPropertyValue('--pico-primary');

(async function () {
  const response = await fetch(bpk);
  const json = await response.json();
  bpkData = json.data;

  let html = document.getElementsByTagName("html")[0];

  let buttonIntroduction = document.getElementById("button-introduction");
  let buttonCloseIntroduction = document.getElementById("button-close-introduction");
  let dialogIntroduction = document.getElementById("dialog-introduction");

  buttonIntroduction?.addEventListener("click", (_) => {
    dialogIntroduction?.toggleAttribute("open");
    html.classList.toggle("modal-is-open");
  });

  buttonCloseIntroduction?.addEventListener("click", (_) => {
    dialogIntroduction?.toggleAttribute("open");
    html.classList.toggle("modal-is-open");
  });

  dialogIntroduction?.addEventListener("click", (e) => {
    if (e.target !== e.currentTarget) return;
    dialogIntroduction?.toggleAttribute("open");
    html.classList.toggle("modal-is-open");
  })

  let buttonNav1 = document.getElementById("button-nav-1");
  buttonNav1?.addEventListener("click", (_) => {
    document.getElementById("section-1")?.scrollIntoView({ behavior: 'smooth' });
  });

  let buttonNav2 = document.getElementById("button-nav-2");
  buttonNav2?.addEventListener("click", (_) => {
    document.getElementById("section-2")?.scrollIntoView({ behavior: 'smooth' });
  });


  var chart1 = new Chart(
    document.getElementById('landing-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData!.map((row: any) => row['date_y-m']),
        datasets: [
          {
            label: 'Total Words',
            data: bpkData!.map((row: any) => row['transcript_words']),
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        events: [],
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          }
        },
      },
    }
  );

})();
