
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorProfile = () => {
    const [userData, setUserData] = useState({});
    const [appointments, setAppointments] = useState({ acceptedArray: [], rejectedArray: [] });

    useEffect(() => {
        const k = localStorage.getItem('user')
        const l = JSON.parse(k)
        const token = l.token
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/auth/getAccRej', {}, {
                    headers: {
                        token: token
                    }
                });
                console.log(response.data)
                console.log(response.data.user)
                setUserData(response.data.user);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="">
            <div className="bg-gray-200 p-4 rounded shadow mb-5">
                <h1 className="text-3xl font-bold">{`${userData.first_name} ${userData.last_name}`}</h1>
                <p>{`Specialization: ${userData.specialization}`}</p>
                <p>{`Email: ${userData.email}`}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {appointments.acceptedArray.length > 0 && appointments.acceptedArray[0] !== null ?
                    <>
                        {appointments.acceptedArray.map(appointment => (
                            <div key={appointment._id} className="bg-green-200 p-4 rounded shadow">
                                <h2 className="text-lg font-bold mb-2">{`${appointment.first_name} ${appointment.last_name}`}</h2>
                                <p>{`Problem: ${appointment.problem}`}</p>
                                <p>{`Date: ${appointment.date} ${appointment.time}`}</p>
                            </div>
                        ))}
                    </> : <div>No Accepted Appointments...</div>
                }

                {appointments.rejectedArray.length > 0 && appointments.rejectedArray[0] !== null ?
                    <>
                        {appointments.rejectedArray.map(appointment => (
                            <div key={appointment._id} className="bg-red-200 p-4 rounded shadow">
                                <h2 className="text-lg font-bold mb-2">{`${appointment.first_name} ${appointment.last_name}`}</h2>
                                <p>{`Problem: ${appointment.problem}`}</p>
                                <p>{`Date: ${appointment.date} ${appointment.time}`}</p>
                            </div>
                        ))}

                    </> : <div>No Rejected Appointments...</div>
                }
            </div>
        </div>
    );
};


export default DoctorProfile;
