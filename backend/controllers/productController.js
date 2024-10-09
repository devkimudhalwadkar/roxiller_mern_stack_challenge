const Product = require('../models/Product');
const axios = require('axios');

// Initialize database with seed data
exports.initializeData = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const products = response.data;

        await Product.insertMany(products);
        res.status(200).json({ message: 'Database initialized with seed data.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// List all transactions with search & pagination
exports.listTransactions = async (req, res) => {
    const { search = '', page = 1, perPage = 10, month } = req.query;
    
    try {
        const query = {
            dateOfSale: { $regex: `-${month}-` }, // Matches any year, only filters by month
            $or: [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { price: new RegExp(search, 'i') }
            ]
        };

        const products = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        
        const total = await Product.countDocuments(query);
        
        res.status(200).json({ data: products, total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Statistics API
exports.getStatistics = async (req, res) => {
    const { month } = req.query;

    try {
        const query = { dateOfSale: { $regex: `-${month}-` } };

        const totalSoldItems = await Product.countDocuments({ ...query, sold: true });
        const totalNotSoldItems = await Product.countDocuments({ ...query, sold: false });
        const totalSaleAmount = await Product.aggregate([
            { $match: { ...query, sold: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        res.status(200).json({
            totalSaleAmount: totalSaleAmount[0]?.total || 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Bar chart API
exports.getBarChart = async (req, res) => {
    const { month } = req.query;

    try {
        const query = { dateOfSale: { $regex: `-${month}-` } };
        
        const priceRanges = [
            { range: '0-100', count: 0 },
            { range: '101-200', count: 0 },
            { range: '201-300', count: 0 },
            { range: '301-400', count: 0 },
            { range: '401-500', count: 0 },
            { range: '501-600', count: 0 },
            { range: '601-700', count: 0 },
            { range: '701-800', count: 0 },
            { range: '801-900', count: 0 },
            { range: '901-above', count: 0 }
        ];

        const products = await Product.find(query);

        products.forEach(product => {
            if (product.price <= 100) priceRanges[0].count++;
            else if (product.price <= 200) priceRanges[1].count++;
            // Continue for other ranges...
            else priceRanges[9].count++;
        });

        res.status(200).json(priceRanges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Pie chart API
exports.getPieChart = async (req, res) => {
    const { month } = req.query;

    try {
        const query = { dateOfSale: { $regex: `-${month}-` } };

        const categories = await Product.aggregate([
            { $match: query },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
