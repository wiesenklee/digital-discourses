import Chart, { type ChartItem, type ChartOptions } from "chart.js/auto";
import bpk from '../bpk.json' with { type: 'json' }

import 'chartjs-adapter-date-fns'
import { de } from 'date-fns/locale';

export const barColors = [
  "rgba(232,53,15,0.4)",
  "rgba(66,67,147,0.4)",
  "rgba(192,159,50,0.4)",
  "rgba(0,108,60,0.4)",
  "rgba(255,241,0,0.4)",
];

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

  let chart = new Chart(
    document.getElementById('landing-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData.map((row: any) => row['date_y-m']),
        datasets: [
          {
            label: 'Total Words',
            data: bpkData.map((row: any) => row['transcript_words']),
            backgroundColor: bpkData.map((_, i) => barColors[i % barColors.length]),
            borderColor: "rgba(90, 90, 90, 1)",
            borderWidth: 2,
            animation: {
              duration: 685,
              easing: "easeInOutBack",
              loop: true,
            },
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

export const scaleOptions: ChartOptions["scales"] = {
  x: {
    ticks: {
      major: {
        enabled: true,
      },
      textStrokeColor: "#000",
      font: (c) => (c.tick?.major ?
        {
          weight: 'bold',
          size: 14,
        } : undefined
      ),
      maxRotation: 0,
    },
    grid: {
      lineWidth: (c) => (c.tick?.major ? 1.5 : 0.5),
    },
    type: "time",
    time: {
      displayFormats: {
        month: "MMM",
      },
      tooltipFormat: "MMMM yyyy",
    },
    adapters: {
      date: {
        locale: de,
      }
    },
    stacked: true,
  },
  y: {
    ticks: {
      textStrokeColor: "#000",
      font: (c) => (c.tick?.value % 50 === 0 ? {
        weight: 'bold',
        size: 14,
      } : undefined),
    },
    stacked: true,
    grid: {
      lineWidth: (c) => c.tick.value % 50 === 0 ? 1.5 : 0.5,
    }
  }
};
