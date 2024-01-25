import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import UserHome from "./components/User";
import NewAppointment from "./components/NewAppointment";
import EmailVerification from "./components/EmailVerification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoctorPage from "./components/Doctor";
// import MedicSell from "./components/MedicSell";
import GetAllMedicine from "./components/AllMedicine";
import DoctorProfile from "./components/DoctorProfile";
import DoctorUpdateAppointments from "./components/DoctorUpdateAppointments";
import PatientMedicineProfile from "./components/PatientMedicProfile";
import AllMedicOrders from "./components/AllMedicOrders";
import OrderMedicHistory from "./components/OrderMedicHistoryProfile";

function App() {
    return <>
        <div>
            <K />
            <ToastContainer />
        </div>
    </>
}
function K() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        }
    }, [localStorage.getItem('user')]);
    if (user) {
        if (user.role === "doctor") {
            return (
                <Router>
                    <Routes>
                        <Route path="/*" element={<DoctorPage />} />
                        <Route path="/profile" element={<DoctorProfile />} />
                        <Route
                            path="/yourappointments"
                            element={<DoctorUpdateAppointments />}
                        />
                    </Routes>
                </Router>
            );
        } else if (user.role === "patient") {
            return (
                <Router>
                    <Routes>
                        <Route
                            path="/patientMedicProfile"
                            element={<PatientMedicineProfile />}
                        />
                        <Route path="/newappointment" element={<NewAppointment />} />
                        <Route path="/*" element={<UserHome />} />
                        <Route path="/order-medicine" element={<GetAllMedicine />} />
                    </Routes>
                </Router>
            );
        } else if (user.role === "medic") {
            return (
                <Router>
                    <Routes>
                        <Route path="/*" element={<AllMedicOrders />} />
                        <Route path="/order-history" element={<OrderMedicHistory />} />
                        {/* <Route path="/*" element={<GetAllMedicine />} /> */}
                    </Routes>
                </Router>
            );
        }
    } else {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify-email" element={<EmailVerification />} />
                </Routes>
            </Router>
        );
    }
    // return (
    //     <Router>
    //         <div>
    //             <Routes>
    //                 <Route path="/" element={<Home />} />
    //                 <Route path="/register" element={<Register />} />
    //                 <Route path="/login" element={<Login />} />
    //                 <Route path="/verify-email" element={<EmailVerification />} />
    //                 {user && user.role === "doctor" ? (
    //                     <>
    //                         <Route path="/*" element={<DoctorPage />} />
    //                         <Route path="/profile" element={<DoctorProfile />} />
    //                         <Route
    //                             path="/yourappointments"
    //                             element={<DoctorUpdateAppointments />}
    //                         />
    //                     </>
    //                 ) : (
    //                     <>
    //                         {user && user.role === "medic" ? (
    //                             <>
    //                                 <Route path="/home" element={<GetAllMedicine />} />
    //                                 <Route path="/medicsell" element={<MedicSell />} />
    //                             </>
    //                         ) : (
    //                             <>
    //                                 <Route path="/buy" element={<GetAllMedicine />} />
    //                                 <Route
    //                                     path="/patientMedicProfile"
    //                                     element={<PatientMedicineProfile />}
    //                                 />
    //                                 <Route path="/home" element={<UserHome />} />
    //                                 <Route path="/newappointment" element={<NewAppointment />} />
    //                                 <Route path="/verify-email" element={<EmailVerification />} />
    //                             </>
    //                         )}
    //                     </>
    //                 )}
    //                 {/* <Route path="*" element={<Navigate to="/" />} /> */}
    //             </Routes>
    //         </div>
    //         <ToastContainer />
    //     </Router>
    // );
}

export default App;
