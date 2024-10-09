const express = require('express');
const { initializeData, listTransactions, getStatistics, getBarChart, getPieChart } = require('../controllers/productController');

const router = express.Router();

router.get('/initialize', initializeData);
router.get('/transactions', listTransactions);
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChart);
router.get('/piechart', getPieChart);

module.exports = router;
