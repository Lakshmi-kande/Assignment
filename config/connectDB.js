const mongoose = require ('mongoose');
const connectDb = async() => {
  try {
    const connect = await mongoose.connect(process.env.connect_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,  
    });
    const message = `Database connected: ${connect.connection.host} ${connect.connection.name}`;
    console.log(message);
  } catch(err) {
    console.error('Failed to connect to the database:', err);
  }
};

module.exports = connectDb;