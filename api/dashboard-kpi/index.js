module.exports = async function (context, req) {
    // Mock KPI data for now
    const kpiData = {
        totalRevenue: 1250000,
        totalRevenueChange: 15.3,
        customerCount: 45000,
        customerCountChange: 8.2,
        averageOrderValue: 85.50,
        averageOrderValueChange: -2.1,
        conversionRate: 3.2,
        conversionRateChange: 0.5
    };

    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: kpiData
    };
};