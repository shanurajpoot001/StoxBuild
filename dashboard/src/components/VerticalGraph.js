import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Holdings",
    },
  },
};

export function VerticalGraph({ data }) {
  const hasData = data?.datasets?.some((dataset) =>
    dataset.data?.some((value) => Number(value) > 0)
  );
  const chartData = hasData
    ? data
    : {
        labels: ["Waiting for live data"],
        datasets: [
          {
            label: "Live current value",
            data: [1],
            backgroundColor: "rgba(180, 188, 200, 0.45)",
          },
        ],
      };

  return <Bar options={options} data={chartData} />;
}
