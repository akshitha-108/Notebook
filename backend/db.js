 const mongoose = require('mongoose');
 const mongoURI = "mongodb+srv://akshithajnv:baMjDyXj3tRRZAxc@cluster0.lkmgcv6.mongodb.net/inotebook";

//  const connectToMongo = async ()=>{
//     await mongoose.connect(mongoURI, ()=>{
//         console.log("connected to mongo successfully")
//     })
//  }
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

 module.exports = connectToMongo;