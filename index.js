const express = require ('express');
const connectDb = require('./config/connectDB');

require('dotenv').config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/v1/role', require('./routes/roleRoute'));
app.use('/api/v1', require('./routes/userRoute'));
app.use('/api/v1', require('./routes/communityRoute'));
app.use('/api/v1', require('./routes/memberRoute'));

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});