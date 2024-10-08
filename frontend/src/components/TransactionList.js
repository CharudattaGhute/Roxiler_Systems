import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, InputGroup } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "react-bootstrap";

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

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/transaction/getAllTransactions`
      );

      const transactions = response.data.data;
      console.log(transactions);

      if (Array.isArray(transactions)) {
        setTransactions(transactions);
        setFilteredTransactions(transactions);
        setTotalPages(Math.ceil(transactions.length / rowsPerPage)); // Set total pages based on all transactions
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
      console.log(response.data);

      setTotalSales(totalSalesAmount);
      setSoldItems(totalSoldItems);
      setNotSoldItems(totalNotSoldItems);
    } catch (error) {
      console.error(
        "Error fetching statistics:",
        error.response ? error.response.data : error.message
      );
      // Reset statistics on error
      setTotalSales(0);
      setSoldItems(0);
      setNotSoldItems(0);
    }
  };

  // Fetch and filter transactions by month and year
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
    setCurrentPage(1); // Reset to first page

    // Fetch statistics for the selected month and year
    fetchStatistics(month, year);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    // Update filtered transactions based on search text
    if (searchValue === "") {
      // If search is empty, show all transactions
      setFilteredTransactions(transactions);
    } else {
      // Filter based on search criteria
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
    // Reset to first page whenever search changes
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
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
    }
  };

  // Effect to update total pages whenever filtered transactions change
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

      {/* Display statistics */}
      <div className="statistics-container">
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

      <Table striped bordered hover className="table">
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
