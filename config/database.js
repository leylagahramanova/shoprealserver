// server/config/database.js
import mongoose from 'mongoose';

const connectToDatabase = async () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        await mongoose.connect(process.env.DB, connectionParams);
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Error connecting to database:", error.message);
    }
};

export { connectToDatabase }; // Ensure this line is correct
