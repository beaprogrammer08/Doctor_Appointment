const { Appointment, User, Medicine } = require("../models/schema");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {
    encryptPassword,
    comparePassword,
    sendJwtToken,
} = require("../middleware/middleware");

const getUserAppointmentx = async (req, res) => {
    const id = req.body.id;
    const allappointments = await Appointment.find({});
    const k = allappointments.filter((each) => each.check === id);
    res.send(k);
};
const DoctorPerspectiveUpdateAppointment = async (req, res) => {
    const { _id, time, date } = req.body;
    const appointmentId = _id;
    const doctorId = req.user; // Make sure req.user contains the correct doctor ID

    try {
        const data = await Appointment.findById(appointmentId);
        const indx = data.doctorIds.map((each, index) => {
            if (each.doctorId === doctorId) {
                console.log(doctorId);
                console.log(index);
                return index;
            }
            else {
                return null;
            }
        });
        data.doctorIds[indx[0]] = { ...data.doctorIds[indx[0]], date: date, time: time }
        data.save()
        console.log(data);
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
const getAllAppointmentDoctorPerspective = async (req, res) => {
    try {
        const userId = req.user;
        const data = await User.findById(userId);
        const acc = data.AccecptedAppointments;
        const rej = data.RejectedAppointments;

        const accp = await Promise.all(
            acc.map(async (each) => {
                const dk = await Appointment.findById(each);
                return dk;
            }),
        );

        const rejp = await Promise.all(
            rej.map(async (each) => {
                const dk = await Appointment.findById(each);
                return dk;
            }),
        );

        res.send({ acceptedArray: accp, rejectedArray: rejp, user: data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};
const buyMedicine = async (req, res) => {
    const { id, buyyerID } = req.body;
    console.log(id);
    console.log(buyyerID);
    try {
        const data = await Medicine.findById(id);
        const buyyer = await User.findById(buyyerID);
        if (data) {
            const mailOptions = {
                from: "anshikthind@gmail.com", // Sender's email
                to: data.seller, // Recipient's email
                subject: `User ${buyyer.email} will buy Medicine`,
                text: `User  ${buyyer.email + " " + buyyer.first_name + " " + buyyer.last_name
                    } will is coming to buy ${data.name} for ${data.treat} from you.`,
            };

            const mailOption = {
                from: "anshikthind@gmail.com", // Sender's email
                to: buyyer.email, // Recipient's email
                subject: `Buy Medicine from ${data.seller}`,
                text: `You can go and buy medicine from ${data.seller} at ${data.address}`,
            };
            // Send the email
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log("Email verification error: " + error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Email verification error: " + error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
            res.send({ buy: true });
        }
    } catch (error) {
        res.send({ buy: false });
    }
};
const getAllMedicine = async (req, res) => {
    const data = await Medicine.find();
    if (data) {
        res.send(data);
    } else {
        res.send([]);
    }
};
const uploadMedicine = async (req, res) => {
    const { name, price, treat, seller, address } = req.body;
    // console.log('hit')
    try {
        const data = await Medicine.create({
            name: name,
            price: price,
            address: address,
            seller: seller,
            treat: treat,
        });
        if (data) {
            res.send({ update: data });
        } else {
            res.send({ update: false });
        }
    } catch (error) {
        res.send({ update: "err" });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await User.findOne({ email: email });
        if (!data) {
            res
                .status(200)
                .send({ token: "", login: false, msg: "Credentials are wrong" });
        }
        const result = await comparePassword(password, data.password);
        if (result) {
            const token = sendJwtToken(data._id, data.name);
            if (data.verified) {
                res.status(200).send({
                    token: token,
                    login: true,
                    msg: "logged in successfully",
                    first_name: data.first_name,
                    last_name: data.last_name,
                    id: data._id,
                    dob: data.dob,
                    gender: data.gender,
                    contact: data.contact,
                    verified: data.verified,
                    role: data.role,
                    specialization: data.specialization,
                });
            } else {
                res.status(200).send({
                    login: true,
                    verified: data.verified,
                });
            }
        } else {
            res
                .status(200)
                .send({ token: "", login: false, msg: "Credentials are wrong" });
        }
    } catch (err) {
        res.status(200).send({ token: "", login: false, msg: "User don't exist" });
    }
};
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString("hex");
};
const verifyEmailToken = async (req, res) => {
    const token = req.body.token;
    if (!token) {
        // Handle the case where there's no token
        return res.status(400).json({ message: "Verification token is missing." });
    }

    try {
        // Find the user with the matching verification token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found or already verified." });
        }

        // Update the user's email verification status
        user.verified = true;

        // Remove the verification token (optional)
        user.verificationToken = undefined;

        await user.save(); // Save the updated user record

        res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred during email verification." });
    }
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "anshikthind@gmail.com",
        pass: "pnff bbip tzwr kinx",
    },
});
const sendVerificationEmail = (email, token) => {
    // Verification link
    const verificationLink = `${process.env.weburl}/verify-email?token=${token}`;
    // Email options
    const mailOptions = {
        from: "anshikthind@gmail.com", // Sender's email
        to: email, // Recipient's email
        subject: "Email Verification",
        text: `Please click the following link to verify your email: ${verificationLink}`,
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email verification error: " + error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};
const signupUser = async (req, res) => {
    console.log("hit");
    let {
        first_name,
        last_name,
        email,
        password,
        contact,
        role,
        dob,
        gender,
        address,
        specialization,
    } = req.body;
    password = await encryptPassword(password);
    const verificationToken = generateVerificationToken();
    try {
        const user = await User.create({
            verificationToken: verificationToken,
            specialization: specialization,
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name,
            address: address,
            gender: gender,
            dob: dob,
            role: role,
            contact: contact,
            verified: false,
            Accecpted: 0,
            Rejected: 0,
        });
        if (user) {
            sendVerificationEmail(email, verificationToken);
            res.json({ signup: true });
        } else {
            res.send({ signup: false });
        }
    } catch (error) {
        res.send({ signup: false });
    }
};

const createUserAppointment = async (req, res) => {
    // console.log(req.user);
    // console.log("Appointment create");
    // console.log(req.body);
    const { first_name, problem, last_name, gender, dob, contact, date, time } =
        req.body;
    console.log(problem);
    const appointmentDetails = await Appointment.create({
        userId: req.user,
        first_name: first_name,
        last_name: last_name,
        problem: problem,
        gender: gender,
        dob: dob,
        contact: contact,
        date: date,
        time: time,
        check: "",
    });
    if (appointmentDetails) {
        res.send({ appointmentRegistered: true });
    } else {
        res.send({ appointmentRegistered: false });
    }
};
const getUserAppointment = async (req, res) => {
    const allappointments = await Appointment.find({
        userId: req.user,
    });
    console.log("Appointment got");
    res.send(allappointments);
    // try {
    //     const oneTaskDetails = await Appointment.findOne({ _id: id });
    // } catch (error) {
    //     res.send("task not found").status(400);
    // }
};

const updateUserAppointment = async (req, res) => {
    console.log("Appointment update");
    // res.send({ yed: 'k' })
    // return;
    const { first_name, last_name, gender, dob, contact, date, time, _id } =
        req.body;
    console.log(req.body);
    const data = await Appointment.findOneAndUpdate(
        { _id: _id },
        {
            userId: req.user,
            first_name: first_name,
            last_name: last_name,
            gender: gender,
            dob: dob,
            contact: contact,
            date: date,
            time: time,
        },
        {
            new: true,
            runValidators: true,
        },
    );
    if (data) {
        res.send(data);
    } else {
        res.send({ yed: "k" });
    }
};
const sendAllAppointments = async (req, res) => {
    const data = await Appointment.find({ check: "" });
    if (data) {
        res.send(data);
    } else {
        res.send({ data: null });
    }
};
const acceptDoctorByUser = async (req, res) => {
    try {
        const userId = req.user;
        const { doctorId, _id } = req.body;
        const data = await Appointment.findById(_id);
        const user = await User.findById(userId);
        const doctorName = await User.findOne({ _id: doctorId });

        if (!data.check) {
            doctorName.Accecpted = doctorName.Accecpted + 1;
            doctorName.AccecptedAppointments.push(_id);
            doctorName.save();
            data.check = doctorId;
            data.save();

            for (const each of data.doctorIds) {
                if (each.doctorId !== doctorId) {
                    const k = await User.findOne({ _id: each.doctorId });
                    k.RejectedAppointments.push(_id);
                    k.Rejected = k.Rejected + 1;
                    await k.save();
                }
            }
            // Filter and save the accepted doctor in a synchronous manner
            const doctor = data.doctorIds.filter((e) => e.doctorId === doctorId);
            data.doctorIds = doctor;
            await data.save();


            const mailOptions = {
                from: "anshikthind@gmail.com",
                to: user.email,
                subject: "Your Appointment Details",
                text: `Your Appointment time is ${doctor[0].time} ${doctor[0].date} with ${doctorName.first_name} ${doctorName.last_name} specialized in ${doctor[0].specialization}`,
            };

            const mailOption = {
                from: "anshikthind@gmail.com",
                to: doctorName.email,
                subject: "Your Appointment Details",
                text: `Your Appointment time is ${doctor.time} ${doctor.date} with ${user.first_name} ${user.last_name}`,
            };

            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log("Email verification error: " + error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Email verification error: " + error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });

            res.send("done");
        } else {
            res.send("done");
        }
    } catch (error) {
        console.error(error);
        res.status(404).send("err");
    }
};
const acceptUserAppointment = async (req, res) => {
    const { _id, time, date } = req.body;
    const appointmentId = _id;
    const doctorId = req.user;
    const doctorData = await User.findById(doctorId);
    const data = await Appointment.findById(appointmentId);
    if (data) {
        if (data.check == 0) {
            data.doctorIds.push({
                doctorId: doctorId,
                first_name: doctorData.first_name,
                specialization: doctorData.specialization,
                last_name: doctorData.last_name,
                time: time,
                date: date,
            });
            data.save();

            res.send(data);
        }
    } else {
        res.send({ data: null });
    }
};
const deleteUserAppointment = async (req, res) => {
    const data = await Appointment.findOneAndDelete({ _id: req.body._id });
    res.send(data);
};
module.exports = {
    signupUser,
    loginUser,
    createUserAppointment,
    getUserAppointment,
    deleteUserAppointment,
    updateUserAppointment,
    verifyEmailToken,
    sendAllAppointments,
    acceptUserAppointment,
    acceptDoctorByUser,
    uploadMedicine,
    getAllMedicine,
    buyMedicine,
    getAllAppointmentDoctorPerspective,
    DoctorPerspectiveUpdateAppointment,
    getUserAppointmentx
};
