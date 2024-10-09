import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import CustomBarChart from './components/BarChart';
import CustomPieChart from './components/PieChart';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('03'); // Default to March

  return (
    <div>
      <h1>Transactions Overview</h1>

      <label>Select Month: </label>
      <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      {/* Table Component */}
      <TransactionsTable month={selectedMonth} />
      
      {/* Bar Chart */}
      <h2>Transactions Bar Chart</h2>
      <CustomBarChart month={selectedMonth} />
      
      {/* Pie Chart */}
      <h2>Transactions Pie Chart</h2>
      <CustomPieChart month={selectedMonth} />
    </div>
  );
};

export default App;
