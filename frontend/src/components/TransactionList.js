import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, InputGroup, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "react-bootstrap";
import BarChartComponent from "./BarchartComponent";
import CategoryPieChart from "./CategoryPieChart";
import "./styles.css";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [month, setMonth] = useState("March");
  const [year, setYear] = useState("2022");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [totalSales, setTotalSales] = useState(0);
  const [soldItems, setSoldItems] = useState(0);
  const [notSoldItems, setNotSoldItems] = useState(0);

  const rowsPerPage = 10;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = ["2021", "2022"];

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/transaction/getAllTransactions`
      );

      const transactions = response.data.data;
      if (Array.isArray(transactions)) {
        setTransactions(transactions);
        setFilteredTransactions(transactions);
        setTotalPages(Math.ceil(transactions.length / rowsPerPage));
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchStatistics = async (selectedMonth, selectedYear) => {
    try {
      const monthIndex = months.indexOf(selectedMonth) + 1;

      const response = await axios.get(
        `http://localhost:5001/api/transaction/getStatistics?month=${monthIndex}&year=${selectedYear}`
      );
      const { totalSalesAmount, totalSoldItems, totalNotSoldItems } =
        response.data;

      setTotalSales(totalSalesAmount);
      setSoldItems(totalSoldItems);
      setNotSoldItems(totalNotSoldItems);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setTotalSales(0);
      setSoldItems(0);
      setNotSoldItems(0);
    }
  };

  const filterTransactionsByMonthYear = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      const transactionMonth = transactionDate.toLocaleString("default", {
        month: "long",
      });
      const transactionYear = transactionDate.getFullYear().toString();

      return transactionMonth === month && transactionYear === year;
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
    fetchStatistics(month, year);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchStatistics(month, year);
  }, [month, year]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    if (searchValue === "") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (transaction) =>
          transaction.title.toLowerCase().includes(searchValue) ||
          transaction.description.toLowerCase().includes(searchValue) ||
          transaction.price.toString().includes(searchValue) ||
          transaction.category.toString().includes(searchValue) ||
          transaction.year.toString().includes(searchValue)
      );
      setFilteredTransactions(filtered);
    }

    setCurrentPage(1);
  };

  const paginateTransactions = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredTransactions.slice(
      startIndex,
      startIndex + rowsPerPage
    );
    return paginatedData;
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredTransactions.length / rowsPerPage));
  }, [filteredTransactions]);

  return (
    <div className="table-container">
      <div className="search-filter-container">
        <InputGroup className="search-box">
          <Form.Control
            placeholder="Search transactions"
            value={searchText}
            onChange={handleSearch}
          />
        </InputGroup>

        <div className="dropdown-container">
          <Form.Select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mb-3 dropdown-select"
          >
            {months.map((m, index) => (
              <option key={index} value={m}>
                {m}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mb-3 dropdown-select"
          >
            {years.map((y, index) => (
              <option key={index} value={y}>
                {y}
              </option>
            ))}
          </Form.Select>

          <Button
            className="search-button"
            onClick={filterTransactionsByMonthYear}
          >
            Search
          </Button>
        </div>
      </div>

      <Row>
        <Col md={6}>
          <BarChartComponent selectedMonth={month} selectedYear={year} />
        </Col>

        <Col>
          <Row>
            <Col md={6} style={{ marginLeft: "30%" }}>
              <div className="piechart-container">
                <h1
                  className="chart-title"
                  style={{ fontWeight: "bold", color: "black" }}
                >
                  Category Distribution
                </h1>
                <CategoryPieChart selectedMonth={month} selectedYear={year} />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Col md={6} style={{ marginLeft: "25%" }}>
        <div className="statistics-container" style={{ color: "black" }}>
          <p>
            <strong>Total Sale Amount:</strong> {totalSales}
          </p>
          <p>
            <strong>Total Sold Items:</strong> {soldItems}
          </p>
          <p>
            <strong>Total Not Sold Items:</strong> {notSoldItems}
          </p>
        </div>
      </Col>
      <hr />

      <Table striped bordered hover className="table mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {paginateTransactions().map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? "Yes" : "No"}</td>
              <td>
                <img
                  src={transaction.image}
                  alt={transaction.title}
                  width="50"
                  height="50"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="pagination-container">
        <span className="page-number">
          Page {currentPage} of {totalPages}
        </span>

        <span
          className="pagination-arrows"
          onClick={handlePrevious}
          style={{ marginRight: "200px" }}
        >
          Previous
          <FaArrowLeft
            className={`pagination-arrow ${
              currentPage === 1 ? "disabled" : ""
            }`}
          />
        </span>

        <span
          className="pagination-arrows"
          onClick={handleNext}
          style={{ marginRight: "30%" }}
        >
          <FaArrowRight
            className={`pagination-arrow ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          />
          Next
        </span>
      </div>
    </div>
  );
};

export default TransactionTable;
