import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import "./categorystyle.css";

const CategoryPieChart = ({ selectedMonth, selectedYear }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthIndex =
          new Date(Date.parse(`${selectedMonth} 1, 2021`)).getMonth() + 1;
        const response = await axios.get(
          `http://localhost:5001/api/transaction/getCategoriesCount`,
          {
            params: { month: monthIndex, year: selectedYear },
          }
        );

        if (response.data && Array.isArray(response.data.data)) {
          setCategoryData(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setCategoryData([]);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        setCategoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const chartData = {
    labels: categoryData.map((item) => item.category || "Unknown"),
    datasets: [
      {
        data: categoryData.map((item) => item.count || 0),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="piechart-container">
      <h2 className="chart-title">Category Distribution for {selectedMonth}</h2>
      {loading ? <p>Loading...</p> : <Pie data={chartData} options={options} />}
    </div>
  );
};

export default CategoryPieChart;
