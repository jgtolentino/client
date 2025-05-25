// Azure Functions custom handler - bridges Express to Functions
const app = require('../dist/index.js');

// Azure Functions provides the port via environment variable
const port = process.env.FUNCTIONS_CUSTOMHANDLER_PORT || 7071;

app.listen(port, () => {
  console.log(`Azure Functions custom handler listening on port ${port}`);
});