import { VariableData } from "@/types/variable_data";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Colors,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

export default function LineChart({ line_data }: { line_data: VariableData }) {
  const max_length = line_data.data.reduce((max, data) => {
    return Math.max(max, data.value.length);
  }, 0);
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: line_data.label,
        font: {
          size: 20,
        },
      },
      colors: {
        forceOverride: true,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Step",
          font: {
            size: 15,
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  const datasets = line_data.data.map((data) => {
    return {
      label: data.name,
      data: data.value,
      fill: true,
      tension: 0.1,
      pointRadius: 0,
    };
  });
  const labels = Array.from(Array(max_length).keys());
  const chart_data = {
    labels: labels,
    datasets: datasets,
  };
  return (
    <div className="h-72 w-3/4">
      <Line data={chart_data} options={commonOptions} />
    </div>
  );
}
