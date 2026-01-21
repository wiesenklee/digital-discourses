import Chart, { type ChartItem } from "chart.js/auto";
import bpk from '../bpk.json' with { type: 'json' }

(async function () {
  const bpkData = (bpk as { data: Array<object> })["data"];

  let buttonNav0 = document.getElementById("button-nav-0");
  buttonNav0?.addEventListener("click", (_) => {
    document.getElementById("section-0")?.scrollIntoView({ behavior: 'smooth' });
  });


  let buttonNav1 = document.getElementById("button-nav-1");
  buttonNav1?.addEventListener("click", (_) => {
    document.getElementById("section-1")?.scrollIntoView({ behavior: 'smooth' });
  });

  let buttonNav2 = document.getElementById("button-nav-2");
  buttonNav2?.addEventListener("click", (_) => {
    document.getElementById("section-2")?.scrollIntoView({ behavior: 'smooth' });
  });

  new Chart(
    document.getElementById('landing-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData.map((row: any) => row['date_y-m']),
        datasets: [
          {
            label: 'Total Words',
            data: bpkData.map((row: any) => row['transcript_words']),
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
