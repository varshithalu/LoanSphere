const mongoose = require("mongoose");
const LoanApplication = require("../models/LoanApplication");

const seedData = [
    { applicantName: "John Doe", loanAmount: 50000, status: "Pending" },
    { applicantName: "Jane Smith", loanAmount: 75000, status: "Approved" },
    { applicantName: "Alice Johnson", loanAmount: 30000, status: "Rejected" },
];

const seedDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/loansphere", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await LoanApplication.deleteMany({});
        await LoanApplication.insertMany(seedData);

        console.log("Database seeded successfully");
        mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding data:", error);
    }
};

seedDB();
