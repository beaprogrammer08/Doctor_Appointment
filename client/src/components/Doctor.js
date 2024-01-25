import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DoctorPage = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [details, setDetails] = useState(null);
    const [user, setUser] = useState(null);
    const [date_time, setDateTime] = useState({
        date: "",
        time: "",
    });

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            localStorage.clear("user");
            navigate("/home");
            toast.warn("This Account is not accociated with Doctor Account");
            toast.error("Logging Out !!!")

            return;
        }
        const k = JSON.parse(user);
        if (k.role != "doctor") {
            localStorage.clear("user");
            navigate("/");
        }
        axios
            .post(
                "http://localhost:8080/auth/getallappointments",
                {},
                {
                    headers: {
                        token: k.token,
                    },
                },
            )
            .then((response) => {
                const filteredData = response.data.filter((object) => {
                    return !object.doctorIds.some((doctor) => doctor.doctorId === k.id);
                });
                setAppointments(filteredData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [details]);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setDateTime((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const submitForm = (id) => {
        console.log(id);
        console.log(date_time);
        const l = {
            _id: id,
            time: date_time.time,
            date: date_time.date,
        };
        let k = localStorage.getItem("user");
        console.log(k);
        console.log(id);
        k = JSON.parse(k);
        // console.log(k);
        axios
            .post("http://localhost:8080/auth/acceptuserappointments", l, {
                headers: {
                    token: k.token,
                },
            })
            .then((data) => {
                console.log(data.data);
                setDetails(null);
                setDateTime(null);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="">
                <nav className="bg-red-500 p-4 flex items-center justify-between">
                    <div className="text-2xl text-white font-semibold">
                        Doctor Portal Page
                    </div>
                    <div className="flex flex-row gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                navigate("/yourappointments");
                            }}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                        >
                            Your Appointments
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                navigate("/profile");
                            }}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                        >
                            Profile
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem("user");
                                localStorage.clear("user");
                                navigate("/");
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                        >
                            Sign Out
                        </button>
                    </div>
                </nav>
                <h1 className="text-2xl font-bold my-4">Appointments</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {appointments.length > 0 ? (
                        <>
                            {" "}
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="border p-4 rounded-md shadow-md"
                                >
                                    <h2 className="text-lg font-semibold">
                                        {appointment.first_name} {appointment.last_name}
                                    </h2>
                                    <h2 className="text-lg font-semibold">
                                        Health Issue: {appointment.problem}
                                    </h2>
                                    <p className="text-gray-600">Gender: {appointment.gender}</p>
                                    <p className="text-gray-600">
                                        Date of Birth: {appointment.dob}
                                    </p>
                                    <p className="text-gray-600">
                                        Contact: {appointment.contact}
                                    </p>
                                    <p className="text-gray-600">Date: {appointment.date}</p>
                                    <p className="text-gray-600">Time: {appointment.time}</p>
                                    {/* <p className="text-gray-600">Time: {appointment._id}</p> */}
                                    <button
                                        type="button"
                                        className="p-2 bg-green-500"
                                        onClick={() => {
                                            setDetails({
                                                Name: `${appointment.first_name} ${appointment.last_name}`,
                                                dob: appointment.dob,
                                                gender: appointment.gender,
                                                date: appointment.date,
                                                time: appointment.time,
                                                id: appointment._id,
                                            });
                                        }}
                                    >
                                        Accept
                                    </button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>No Appointments found</>
                    )}
                </div>
            </div>
            {details ? (
                <>
                    <dialog
                        open={true}
                        className="w-screen absolute flex justify-center items-center top-0 h-screen bg-black bg-opacity-80"
                    >
                        <div className="w-full max-w-md p-6 mx-auto bg-white rounded-md">
                            <div className="mb-4">
                                <h2 className="text-2xl font-semibold">Appointment Details</h2>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <p className="text-gray-800">{details.Name}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <div
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Select Date"
                                >
                                    {details.date}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Time
                                </label>
                                <div
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Select Time"
                                >
                                    {details.time}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <input
                                    onChange={handleChange}
                                    type="date"
                                    name="date"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Select Date"
                                    value={date_time.date}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Time
                                </label>
                                <input
                                    onChange={handleChange}
                                    type="time"
                                    name="time"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Select Time"
                                    value={date_time.time}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => {
                                        setDetails(null); // You need to define a function to close the dialog
                                    }}
                                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => submitForm(details.id)} // You need to define a function to handle form submission
                                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </dialog>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default DoctorPage;
