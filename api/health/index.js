module.exports = async function (context, req) {
    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'client-api',
            version: '1.0.0'
        }
    };
};