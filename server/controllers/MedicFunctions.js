const { Medicine, User } = require("../models/schema");
const nodemailer = require("nodemailer");
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
const getMedicSideRecipt = async (req, res) => {

    const data = await Medicine.find({});
    if (data) {
        res.status(200).send(data)
    }
    else {
        res.status(404).send(data);
    }
}
const getMedicReciptProfile = async (req, res) => {
    console.log('hi')
    const { userId } = req.body
    const data = await Medicine.find({ medicId: userId });
    if (data) {
        res.status(200).send(data)
    }
    else {
        res.status(404).send(data);
    }
}
const getPatientReciptProfile = async (req, res) => {
    const { userId } = req.body
    const data = await Medicine.find({ patientId: userId });
    if (data) {
        res.status(200).send(data)
    }
    else {
        res.status(404).send(data);
    }
}
const proccessMedicineOrder = async (req, res) => {
    console.log('hit')
    try {
        const { medicId, itemId } = req.body
        const data = await Medicine.findById(itemId);
        console.log(data, medicId, itemId)
        data.proccess_order = 1;
        data.medicId = medicId;
        data.save()
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
const getPatientRecipt = async (req, res) => {
    const { name, phoneNumber, email, userId } = req.body;
    const file = req.file.path;
    const data = await Medicine.create({
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        patientId: userId,
        path: file,
        proccess_order: 0
    });
    if (data) {
        res.status(200).send(data)
    }
    else {
        res.status(404).send(data);
    }
};
const submitOrder = async (req, res) => {
    const { id, treat, seller, price, address, medicines } = req.body
    const data = await Medicine.findOneAndUpdate({ _id: id }, {
        treat: treat,
        seller: seller,
        address: address,
        price: price,
        medicines: medicines,
        proccess_order: 2,
    })
    const medicData = await User.findById(data.medicId)
    const mailOptions = {
        from: "anshikthind@gmail.com", // Sender's email
        to: data.email, // Recipient's email
        subject: `Medicine Order !!!`,
        text: `Go and pickup your order from ${data.address} from Medic ${medicData.first_name} ${medicData.last_name} Check out your profile on website for medicines price and other details`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email verification error: " + error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
    res.send(data)

}
module.exports = {
    getPatientRecipt,
    getMedicSideRecipt,
    getPatientReciptProfile,
    getMedicReciptProfile,
    proccessMedicineOrder,
    submitOrder,
    getMedicReciptProfile
};

