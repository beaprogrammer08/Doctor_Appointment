const express = require('express');
const {
    sendAllAppointments,
    signupUser,
    loginUser,
    createUserAppointment,
    getUserAppointment,
    deleteUserAppointment,
    updateUserAppointment,
    verifyEmailToken,
    acceptUserAppointment,
    acceptDoctorByUser,
    uploadMedicine,
    getAllMedicine,
    buyMedicine,
    getAllAppointmentDoctorPerspective,
    DoctorPerspectiveUpdateAppointment
} = require("../controllers/functions");
const routerUser = express.Router();
const routerAppointment = express.Router();
// login / signup / verifyemail
routerUser.route("/login").post(loginUser);
routerUser.route("/sell").post(uploadMedicine);
routerUser.route("/allmedicine").get(getAllMedicine);
routerUser.route("/buy").post(buyMedicine);
routerUser.route("/signup").post(signupUser);
routerUser.route("/verifyemail").post(verifyEmailToken);
// routerAppointment 
routerAppointment.route("/getAppointments").post(getUserAppointment);
routerAppointment.route("/updatedoc").post(DoctorPerspectiveUpdateAppointment);
routerAppointment.route("/getAccRej").post(getAllAppointmentDoctorPerspective);
routerAppointment.route("/createAppointment").post(createUserAppointment);
routerAppointment.route("/deleteAppointment").post(deleteUserAppointment);
routerAppointment.route("/updateAppointment").patch(updateUserAppointment);
routerAppointment.route("/getallappointments").post(sendAllAppointments);
routerAppointment.route("/acceptuserappointments").post(acceptUserAppointment);
routerAppointment.route("/acceptdoctorbyuser").post(acceptDoctorByUser);


module.exports = { routerUser, routerAppointment };
