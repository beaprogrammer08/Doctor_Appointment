import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DoctorUpdateAppointments() {
    const navigate = useNavigate();
    const [date_time, setDateTime] = useState({
        date: "",
        time: "",
    });
    const [date_time_temp, setDate_time_temp] = useState(null);
    const [old_date_array, setOld_date_array] = useState([]);
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            localStorage.clear("user");
            navigate("/home");
            toast.warn("This Account is not accociated with Doctor Account");
            toast.error("Logging Out !!!");

            return;
        }
        const k = JSON.parse(user);
        if (k.role != "doctor") {
            localStorage.clear("user");
            navigate("/");
        }
        axios
            .post(
                "http://localhost:8080/kkkk",
                { id: k.id },
                {
                    headers: {
                        token: k.token,
                    },
                },
            )
            .then((response) => {
                const filteredData = response.data.filter((object) => {
                    return object.doctorIds.some((doctor) => doctor.doctorId === k.id);
                });

                const data = filteredData;
                // const targetDoctorId = "654e087512252dff442f0f1e"; // Replace this with your actual doctorId
                // const targetDoctorId = "654e08512252dff442f0f1"; // Replace this with your actual doctorId
                const filteredexcludedDoctor = data
                    .map((entry) => {
                        const matchingDoctors = entry.doctorIds.filter(
                            (doctor) => doctor.doctorId !== k.id,
                        );
                        if (matchingDoctors.length > 0) {
                            return matchingDoctors;
                        } else {
                            return null;
                        }
                    })
                    .filter(Boolean); // Remove null entries if any
                const filteredIncludedDoctor = data
                    .map((entry) => {
                        const matchingDoctors = entry.doctorIds.filter(
                            (doctor) => doctor.doctorId === k.id,
                        );
                        if (matchingDoctors.length > 0) {
                            return matchingDoctors[0];
                        } else {
                            return null;
                        }
                    })
                    .filter(Boolean);
                console.log('filteredIncludedDoctor');
                console.log(filteredIncludedDoctor);
                console.log('filteredExcludedDoctor');
                console.log(filteredexcludedDoctor);
                console.log(filteredData);
                setAppointments(filteredData);
                setDateTime(filteredIncludedDoctor);
                setOld_date_array(filteredexcludedDoctor);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);
    const editDateTime = (data) => {
        console.log(data);
        setDate_time_temp(data);
    };
    const handleUpdate = (id) => {
        const user = localStorage.getItem("user");
        if (!user) {
            localStorage.clear("user");
            navigate("/home");
            toast.warn("This Account is not accociated with Doctor Account");
            toast.error("Logging Out !!!");

            return;
        }
        const k = JSON.parse(user);
        if (k.role != "doctor") {
            localStorage.clear("user");
            navigate("/");
        }
        axios
            .post(
                "http://localhost:8080/auth/updatedoc",
                { date: date_time.date, time: date_time.time, _id: id },
                {
                    headers: {
                        token: k.token,
                    },
                },
            )
            .then((response) => {
                console.log(response.data);
                setDate_time_temp(null)

            });
    };
    // return <></>
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
                            {appointments.map((appointment, index) => (
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
                                    <p className="text-gray-600"></p>
                                    <h2 className="text-lg font-semibold">
                                        Your Date and Time: {date_time[index].date}{" "}
                                        {date_time[index].time}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            editDateTime(appointment._id);
                                        }}
                                        type="button"
                                        className="p-2 bg-blue-400"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>No Appointments found</>
                    )}
                </div>
            </div>
            {date_time_temp ? (
                <>
                    <dialog
                        className="w-full h-screen bg-black  absolute flex items-center justify-center top-0"
                        open
                    >
                        <div className="bg-white p-6 rounded-lg">
                            <div className="mb-4">
                                <label className="block text-gray-700">Date</label>
                                <input
                                    name="date"
                                    onChange={(e) => {
                                        setDateTime((k) => ({
                                            ...k,
                                            [e.target.name]: e.target.value,
                                        }));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    type="date"
                                    value={date_time.date}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Time</label>
                                <input
                                    name="time"
                                    onChange={(e) => {
                                        setDateTime((k) => ({
                                            ...k,
                                            [e.target.name]: e.target.value,
                                        }));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    type="time"
                                    value={date_time.time}
                                />
                            </div>
                            <button
                                className="bg-blue-500 mr-3 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={() => {
                                    setDate_time_temp(null);
                                }}
                            >
                                Close
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={() => {
                                    console.log(date_time_temp);
                                    handleUpdate(date_time_temp);
                                    // Handle the button click
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </dialog>
                </>
            ) : (
                <></>
            )}
        </>
    );
}
