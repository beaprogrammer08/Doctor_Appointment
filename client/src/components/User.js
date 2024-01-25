import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserHome() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [editAppointment, setEditAppointment] = useState(null);
    const [accept, setAccept] = useState(false);
    const [allAppointments, setAllAppointments] = useState([]);
    const [allReadyAppointed, setAppointed] = useState(false)
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const k = JSON.parse(user);
            setUserData(k);
            // console.log(k.token)
            axios
                .post(
                    "http://localhost:8080/auth/getAppointments",
                    {},
                    {
                        headers: {
                            token: k.token,
                        },
                    },
                )
                .then((data) => {
                    data.data.map((each) => {
                        if (each.check === "") {
                            setAppointed(true)
                        }
                        return
                    })
                    // console.log(data.data);
                    setAllAppointments(data.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            navigate("/login");
        }
    }, [editAppointment, accept]);
    const handleEditAppointment = (id) => {
        // alert(id);
        const k = allAppointments.filter((k) => k._id === id);
        // console.log(k);
        setEditAppointment(k[0]);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        console.log(name);
        console.log(value);
        setEditAppointment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleDeleteAppointment = (id) => {
        let k = localStorage.getItem("user");
        console.log(k);
        console.log(id);
        // console.log(id)
        k = JSON.parse(k);
        console.log(k);
        axios
            .post(
                "http://localhost:8080/auth/deleteAppointment",
                { _id: id },
                {
                    headers: {
                        token: k.token,
                    },
                },
            )
            .then((data) => {
                console.log(data.data);
            });
    };
    const handleEditSubmit = (e) => {
        e.preventDefault();
        console.log(editAppointment);
        let k = localStorage.getItem("user");
        k = JSON.parse(k);
        axios
            .patch("http://localhost:8080/auth/updateAppointment", editAppointment, {
                headers: {
                    token: k.token,
                },
            })
            .then((data) => {
                console.log(data.data);
            });
    };
    const handleUserAcceptRequest = (doctorid, appointmentid) => {
        // userId will be detected from user
        console.log(doctorid);
        console.log(appointmentid);
        let k = localStorage.getItem("user");
        k = JSON.parse(k);
        axios
            .post(
                "http://localhost:8080/auth/acceptdoctorbyuser",
                { _id: appointmentid, doctorId: doctorid },
                {
                    headers: {
                        token: k.token,
                    },
                },
            )
            .then((data) => {
                console.log(data.data);
                // setAllAppointments(null)
                setAccept(!accept);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            {userData ? (
                <div className="min-h-screen flex items-center flex-col justify-start w-screen bg-gray-300">
                    <nav className="bg-red-500 p-4 flex w-full items-center justify-between">
                        <div className="text-2xl text-white font-semibold">
                            {`${userData.first_name} ${userData.last_name}`}
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    navigate("/patientMedicProfile");
                                }}
                                className="bg-green-500 mr-4 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                            >
                                Medicines Orders
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    navigate("/order-medicine");
                                }}
                                className="bg-green-500 mr-4 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                            >
                                Buy Medicines
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
                    <div className="w-1/2  my-4 p-4 flex flex-col gap-5 items-center justify-center">
                        {
                            allReadyAppointed ?
                                <button
                                    className="px-6 py-3 bg-red-500  text-white font-semibold rounded-md shadow-md"
                                    type="button"
                                >
                                    Already Appointment in Progress .....
                                </button>
                                :
                                <button
                                    className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md"
                                    type="button"
                                    onClick={() => {
                                        navigate("/newappointment");
                                    }}
                                >
                                    New Appointment
                                </button>
                        }
                        <div className="flex flex-col gap-2">
                            <span className="px-6 py-3 bg-green-500  text-white w-full font-semibold rounded-md ">
                                Your Appointments
                            </span>

                            <div className="flex flex-wrap justify-center space-x-4">
                                {allAppointments.map((appointment) => (
                                    <div
                                        key={appointment._id}
                                        className="w-64 bg-white border rounded shadow p-4 mb-4"
                                    >
                                        {appointment.first_name && (
                                            <div>
                                                <span className="font-bold">Name: </span>
                                                {`${appointment.first_name} ${appointment.last_name}`}
                                            </div>
                                        )}
                                        {appointment.problem && (
                                            <div>
                                                <span className="font-bold">Health Issue: </span>
                                                {`${appointment.problem}`}
                                            </div>
                                        )}
                                        {appointment.gender && (
                                            <div>
                                                <span className="font-bold">Gender: </span>
                                                {appointment.gender}
                                            </div>
                                        )}
                                        {appointment.dob && (
                                            <div>
                                                <span className="font-bold">DOB: </span>
                                                {appointment.dob}
                                            </div>
                                        )}
                                        {appointment.contact && (
                                            <div>
                                                <span className="font-bold">Contact: </span>
                                                {appointment.contact}
                                            </div>
                                        )}
                                        {appointment.date && (
                                            <div className="text-green-800 font-bold">
                                                <span>Date: </span>
                                                {appointment.date}
                                            </div>
                                        )}
                                        {appointment.time && (
                                            <div className="text-green-800 font-bold">
                                                <span>Time: </span>
                                                {appointment.time}
                                            </div>
                                        )}
                                        <div className="mb-2">
                                            {appointment.doctorIds.length > 0 ? (
                                                <>
                                                    {appointment.doctorIds.map((each, index) => (
                                                        <div key={index} class="border p-4 rounded-md">
                                                            <p class="text-gray-800">
                                                                Doctor Name: {each.first_name}{" "}
                                                                {each.last_name}
                                                            </p>
                                                            <p class="text-gray-800">
                                                                Specialization:   {each.specialization}
                                                            </p>
                                                            <p class="text-gray-600">Date: {each.date}</p>
                                                            <p class="text-gray-600">Time: {each.time}</p>
                                                            {/* <p class="text-gray-600">Time: {each.doctorId}</p> */}
                                                            {!appointment.check ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleUserAcceptRequest(
                                                                            each.doctorId,
                                                                            appointment._id,
                                                                        );
                                                                    }}
                                                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                                >
                                                                    Accept
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                                                                >
                                                                    Accepted
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <button
                                                onClick={() => {
                                                    handleDeleteAppointment(appointment._id);
                                                    setAccept(!accept)
                                                }}
                                                type="button"
                                            >
                                                {/* delete */}
                                                <svg
                                                    width="24px"
                                                    height="24px"
                                                    viewBox="0 0 21.00 21.00"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="#000000"
                                                >
                                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                    <g
                                                        id="SVGRepo_tracerCarrier"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    ></g>
                                                    <g id="SVGRepo_iconCarrier">
                                                        {" "}
                                                        <title>delete [#1487]</title>{" "}
                                                        <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                                                        <g
                                                            id="Page-1"
                                                            stroke="none"
                                                            stroke-width="1"
                                                            fill="none"
                                                            fill-rule="evenodd"
                                                        >
                                                            {" "}
                                                            <g
                                                                id="Dribbble-Light-Preview"
                                                                transform="translate(-179.000000, -360.000000)"
                                                                fill="#000000"
                                                            >
                                                                {" "}
                                                                <g
                                                                    id="icons"
                                                                    transform="translate(56.000000, 160.000000)"
                                                                >
                                                                    {" "}
                                                                    <path
                                                                        d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z"
                                                                        id="delete-[#1487]"
                                                                    >
                                                                        {" "}
                                                                    </path>{" "}
                                                                </g>{" "}
                                                            </g>{" "}
                                                        </g>{" "}
                                                    </g>
                                                </svg>
                                            </button>
                                            {appointment.doctorIds.length == 0 ? (
                                                <button
                                                    onClick={() => {
                                                        handleEditAppointment(appointment._id);
                                                    }}
                                                    type="button"
                                                >
                                                    {/* Edit */}
                                                    <svg
                                                        width="24px"
                                                        height="24px"
                                                        viewBox="0 0 24.00 24.00"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                        <g
                                                            id="SVGRepo_tracerCarrier"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        ></g>
                                                        <g id="SVGRepo_iconCarrier">
                                                            {" "}
                                                            <path
                                                                fill-rule="evenodd"
                                                                clip-rule="evenodd"
                                                                d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"
                                                                fill="#000000"
                                                            ></path>{" "}
                                                        </g>
                                                    </svg>
                                                </button>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>loading....</div>
            )}
            {editAppointment ? (
                <dialog
                    open={true}
                    className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50"
                >
                    <form
                        onSubmit={handleEditSubmit}
                        className="bg-white p-8 rounded-lg px-4"
                    >
                        <div
                            className="flex flex-col gap-2 w-[26rem]"
                            key={editAppointment._id}
                        >
                            <label className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={editAppointment.first_name}
                                className="mt-1 p-2 w-full rounded border border-gray-300 focus:ring focus:ring-blue-300"
                                onChange={handleInputChange}
                            />
                            <label className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={editAppointment.last_name}
                                className="mt-1 p-2 w-full rounded border border-gray-300 focus:ring focus:ring-blue-300"
                                onChange={handleInputChange}
                            />
                            <label className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <input
                                type="text"
                                name="gender"
                                value={editAppointment.gender}
                                className="mt-1 p-2 w-full rounded border border-gray-300 focus:ring focus:ring-blue-300"
                                onChange={handleInputChange}
                            />
                            <label className="block text-sm font-medium text-gray-700">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dob"
                                value={editAppointment.dob}
                                className="mt-1 p-2 w-full rounded border border-gray-300 focus:ring focus:ring-blue-300"
                                onChange={handleInputChange}
                            />
                            <label className="block text-sm font-medium text-gray-700">
                                Contact
                            </label>
                            <input
                                type="text"
                                name="contact"
                                value={editAppointment.contact}
                                className="mt-1 p-2 w-full rounded border border-gray-300 focus:ring focus:ring-blue-300"
                                onChange={handleInputChange}
                            />
                            <label className="block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={editAppointment.date}
                                className="mt-1 p-2 w-full rounded border border-gray-300 focus:ring focus:ring-blue-300"
                                onChange={handleInputChange}
                            />
                            <label className="block text-sm font-medium text-gray-700">
                                Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={editAppointment.time}
                                className="mt-1 p-2 w-full rounded border border-gray-300 focus:ring focus:ring-blue-300"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex mt-5 flex-row gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditAppointment(null);
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded focus:outline-none focus:ring focus:ring-gray-400"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-600"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </dialog>
            ) : (
                <></>
            )}
        </>
    );
}
export default UserHome;
