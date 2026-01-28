import Chart, { type ChartItem, type ChartOptions } from "chart.js/auto";
import bpk from '../bpk.json' with { type: 'json' }

import 'chartjs-adapter-date-fns'
import { de } from 'date-fns/locale';

export const barColors = [
  "rgba(66,67,147,0.5)",
  "rgba(192,159,50,0.5)",
  "rgba(0,108,60,0.5)",
  "rgba(255,241,0,0.5)",
  "rgba(232,53,15,0.5)",
];

(async function () {
  const bpkData = (bpk as { data: Array<object> })["data"];

  new Chart(
    document.getElementById('landing-chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: bpkData.map((row: any) => row['date_y-m']),
        datasets: [
          {
            label: 'Total Words',
            data: bpkData.map((row: any) => row['transcript_words']).reverse(),
            backgroundColor: (c) => {
              const gradient = c.chart.ctx.createLinearGradient(0, 0, c.chart.width, 0);
              gradient.addColorStop(0.0, barColors[0]!);
              gradient.addColorStop(1 / 5, barColors[1]!);
              gradient.addColorStop(3 / 5, barColors[3]!);
              gradient.addColorStop(4 / 5, barColors[2]!);
              gradient.addColorStop(5 / 5, barColors[4]!);
              return gradient;
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
