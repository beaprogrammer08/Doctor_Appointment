const express = require("express");
const path = require('path')
const fs = require("fs");
const { routerAppointment, routerUser } = require("./routes/tasks");
const cors = require("cors");
const { connect } = require("./db/connect.js");
const { verifyToken } = require("./middleware/middleware");
const { upload } = require("./middleware/Multer");
const { getPatientRecipt, getMedicSideRecipt, getPatientReciptProfile, proccessMedicineOrder, submitOrder, getMedicReciptProfile } = require("./controllers/MedicFunctions");
const { getUserAppointmentx } = require("./controllers/functions");
const app = express();
require("dotenv").config();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.post("/medic", upload.single("file"), getPatientRecipt);
app.post("/getmedicside", getMedicSideRecipt);
app.post("/patientMediProfile", getPatientReciptProfile);
app.post("/medicMediProfile", getMedicReciptProfile);
app.post("/proccessOrder", proccessMedicineOrder);
app.post("/submitOrder", submitOrder);
app.post("/kkkk", getUserAppointmentx);
app.use("/api", routerUser);
app.use("/auth", verifyToken, routerAppointment);
const start = async () => {
    try {
        const db_url = process.env.mongod_url;
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
            console.log("Uploads directory created");
        } else {
            console.log("Uploads directory already exists");
        }
        const port = process.env.PORT || 8080;
        connect(db_url);
        app.listen(port, () =>
            console.log(`server up n running on ${port} and connected to db....`),
        );
    } catch (error) {
        console.log(error);
        console.log("server did not started because of error in db connection...");
    }
};
start();
