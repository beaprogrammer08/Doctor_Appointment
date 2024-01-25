import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AllMedicOrders() {
    const [medicineData, setMedicineData] = useState([]);
    const [userId, setUserId] = useState("");
    const [editData, setEditData] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [userData, setUserData] = useState({ first_name: "Medic", last_name: "Profile" });
    const fetchData = async () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserData(parsedUser)
            setUserId(parsedUser.id);
            try {
                const response = await axios.post(
                    "http://localhost:8080/getmedicside",
                    {},
                );
                if (response.status === 200) {
                    const filteredData = response.data.filter(
                        (each) => each.proccess_order !== 2,
                    );
                    setMedicineData(filteredData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };
    const navigate = useNavigate()
    const handleOrderDetails = (e) => {
        setOrderDetails((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const proccessOrder = async (data) => {
        const id = data;
        const response = await axios.post("http://localhost:8080/proccessOrder", {
            medicId: userId,
            itemId: id,
        });
        if (response.status === 200) {
            toast.success("Successfully processed");
        }
    };
    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8080/submitOrder", {
            id: editData._id,
            treat: orderDetails.treat,
            seller: orderDetails.seller,
            price: orderDetails.price,
            address: orderDetails.address,
            medicines: orderDetails.medicines,
        });
        if (response.status === 200) {
            console.log(response.data);
            setEditData(null)
        }
    };

    useEffect(() => {
        fetchData();
    }, [editData]);

    return (
        <>
            <nav className="bg-red-500 p-4 flex w-full items-center justify-between">
                <div className="text-2xl text-white font-semibold">
                    {`${userData.first_name} ${userData.last_name}`}
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/order-history");
                        }}
                        className="bg-green-500 mr-4 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                    >
                        History
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
            <div className="max-w-screen-xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-6">Patient Medicine Profile</h1>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {medicineData.length > 0 ? (
                        medicineData.map((medicine, index) => (
                            <div key={index} className="bg-white rounded-md shadow-md p-4">
                                <img
                                    src={`http://localhost:8080/${medicine.path}`}
                                    alt={medicine.name}
                                    className="w-full h-40 object-cover rounded-md mb-2"
                                />
                                <p className="text-lg font-semibold">
                                    Patient Name: {medicine.name}
                                </p>
                                <p className="text-gray-600">Patient Email: {medicine.email}</p>
                                {medicine.proccess_order === 1 && medicine.medicId !== userId ? (
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-2 mt-2 rounded-md cursor-not-allowed"
                                        disabled
                                    >
                                        Order Already in Process
                                    </button>
                                ) : (
                                    <>
                                        {medicine.proccess_order === 1 &&
                                            medicine.medicId === userId ? (
                                            <button
                                                onClick={() => {
                                                    setEditData(medicine);
                                                }}
                                                type="button"
                                                className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                Checkout Order (Medicine Delivery Pending)
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditData(medicine);
                                                    proccessOrder(medicine._id);
                                                }}
                                                type="button"
                                                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                Process Order
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No medicine data found for this user.</p>
                    )}
                </div>
                {editData && (
                    <div className="fixed inset-0 z-10 flex justify-center items-center h-screen overflow-y-scroll bg-black bg-opacity-40">
                        <form
                            onSubmit={handleOrderSubmit}
                            className="bg-white w-full sm:w-[50%] md:w-[40%] lg:w-[30%] p-8 rounded-md"
                        >
                            <p className="text-lg font-semibold">Medicine Receipt Image:</p>
                            <img
                                src={`http://localhost:8080/${editData.path}`}
                                alt={editData.name}
                                className="w-full object-cover rounded-md mb-4"
                            />
                            <p className="text-lg font-semibold">
                                Patient Name: {editData.name}
                            </p>
                            <p className="text-gray-600">Patient Email: {editData.email}</p>
                            <div className="flex flex-col gap-4">
                                <label className="text-lg font-semibold">Medicine details:</label>
                                <textarea
                                    name="medicines"
                                    placeholder="Medicines Names and all details e.g., Paracetamol (2 times a day),..."
                                    onChange={handleOrderDetails}
                                    className="border rounded-md p-2"
                                />
                                <label className="text-lg font-semibold">Treatment:</label>
                                <input
                                    name="treat"
                                    placeholder="Treatment"
                                    onChange={handleOrderDetails}
                                    className="border rounded-md p-2"
                                    type="text"
                                />
                                <label className="text-lg font-semibold">Your Name:</label>
                                <input
                                    name="seller"
                                    placeholder="Your Name"
                                    onChange={handleOrderDetails}
                                    className="border rounded-md p-2"
                                    type="text"
                                />
                                <label className="text-lg font-semibold">Medicine Profile:</label>
                                <input
                                    name="price"
                                    placeholder="Price"
                                    onChange={handleOrderDetails}
                                    className="border rounded-md p-2"
                                    type="text"
                                />
                                <label className="text-lg font-semibold">Your Medic Address:</label>
                                <textarea
                                    name="address"
                                    placeholder="Your Medic Address... (4444, street, California)"
                                    onChange={handleOrderDetails}
                                    className="border rounded-md p-2"
                                    type="text"
                                />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditData(null)}
                                    className="bg-gray-500 text-white px-4 py-2 ml-4 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default AllMedicOrders;
