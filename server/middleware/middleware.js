const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendJwtToken = (_id, name) => {
    const secret = process.env.jwt_sec;
    const data = {
        id: _id,
        name: name,
    };
    const token = jwt.sign(data, secret);
    return token;
};
const verifyToken = (req, res, next) => {
    const { token } = req.headers;
    // console.log(token)
    if (token) {
        const secret = process.env.jwt_sec;
        const decode = jwt.verify(token, secret);
        // console.log(decode)
        req.user = decode.id;
        next();
    } else {
        res.send({ exist: false });
    }
};
const encryptPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
};
const comparePassword = async (password, hashedPassword) => {
    const result = await bcrypt.compare(password, hashedPassword); // returns whether true or false
    return result;
};
module.exports = {
    sendJwtToken,
    verifyToken,
    encryptPassword,
    comparePassword,
};
