import "./App.css";
import TransactionTable from "./components/TransactionList";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <hr />
      <TransactionTable />
    </div>
  );
}

export default App;
