const express = require('express');
const app = express();
const port = 3000;
const apiRoutes = require('./api/routes');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Data Analytics API');
});

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
