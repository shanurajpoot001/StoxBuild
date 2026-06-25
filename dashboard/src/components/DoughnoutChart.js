import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        font: { size: 11 },
      },
    },
  },
};

export function DoughnutChart({ data }) {
  const hasData = data?.datasets?.some((dataset) =>
    dataset.data?.some((value) => Number(value) > 1)
  );
  const chartData = hasData
    ? data
    : {
        labels: ["Waiting for live data"],
        datasets: [
          {
            label: "Live price",
            data: [1],
            backgroundColor: ["rgba(180, 188, 200, 0.45)"],
            borderColor: ["rgba(180, 188, 200, 0.8)"],
            borderWidth: 1,
          },
        ],
      };

  return (
    <div className="chart-wrap">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}
