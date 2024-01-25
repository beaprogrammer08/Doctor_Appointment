import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function OrderMedicHistory() {
    const [userData, setUserData] = useState({ first_name: "Medicine Order", last_name: "Profile" });
    const [medicineData, setMedicineData] = useState([]);
    const fetchData = async () => {
        try {
            const data = localStorage.getItem("user");
            let m;
            if (data) {
                const k = JSON.parse(data);
                m = k.id;
            }
            const response = await axios.post(
                "http://localhost:8080/medicMediProfile",
                { userId: m },
            );
            if (response.status === 200) {
                setMedicineData(response.data.reverse());
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const k = JSON.parse(user);
            setUserData(k);
            fetchData()
        }
    }, []);
    const navigate = useNavigate()
    return <>
        <nav className="bg-red-500 p-4 flex w-full items-center justify-between">
            <div className="text-2xl text-white font-semibold">
                {`${userData.first_name} ${userData.last_name}`}
            </div>
            <div>
                <button
                    type="button"
                    onClick={() => {
                        navigate("/");
                    }}
                    className="bg-green-500 mr-4 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                >
                    Home
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
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-6 text-center">
                Previous Deliveries
            </h1>
            <div className="grid gap-8 grid-cols-1  lg:grid-cols-2 w-full">
                {medicineData.length > 0 ? (
                    medicineData.map((medicine, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg overflow-hidden shadow-md"
                        >
                            <img
                                src={`http://localhost:8080/${medicine.path}`}
                                className="w-full h-48 object-cover object-center"
                                alt="Medicine"
                            />
                            <div className="p-4">
                                <p className="text-lg font-semibold">
                                    Your Name: {medicine.name}
                                </p>
                                <p className="text-lg">Your Email: {medicine.email}</p>
                                {medicine.proccess_order === 1 ? (
                                    <div className="text-yellow-600 font-semibold">
                                        Order Picked up (Checkout Pending){" "}
                                    </div>
                                ) : (
                                    <>
                                        {medicine.proccess_order === 0 ? (
                                            <div className="text-red-600 font-semibold">
                                                Order pickup pending.
                                            </div>
                                        ) : (
                                            <div className="text-green-600">
                                                <p className="text-lg">
                                                    Medic Seller Name: {medicine.seller}
                                                </p>
                                                <p className="text-lg">Treatment: {medicine.treat}</p>
                                                <p className="text-lg">
                                                    Medicine Details: {medicine.medicines}
                                                </p>
                                                <p className="text-lg">
                                                    Medic Address: {medicine.address}
                                                </p>
                                                <p className="text-lg">
                                                    Medicine Price: {medicine.price}
                                                </p>
                                                <button
                                                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md focus:outline-none"
                                                    type="button"
                                                >
                                                    Order Done
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-lg col-span-3 text-center">
                        No medicine data found for this user.
                    </p>
                )}
            </div>
        </div>
    </>
}
