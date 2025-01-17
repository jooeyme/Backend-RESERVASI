
const { User, Admin } = require("../../models")
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    Register: async(req, res) => {
        const {
            username,
            email,
            password,
            confirmPassword,
            NIM,
            dept,
            alamat
        } = req.body;

        if(password !== confirmPassword) {
            return res.status(400).json({
                msg: "Password dan Confirm Password tidak cocok"
            });
        }
        try {
            const hashPassword = await argon2.hash(password);
    
            await User.create({
                username: username,
                email: email,
                password: hashPassword,
                NIM: NIM,
                dept: dept,
                alamat: alamat
            });
            res.status(201).json({msg: "Register Berhasil"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
},
Login : async (req, res) =>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email  
            }
        });
        
        if(!user) 
            return res.status(404).json({
                msg: "User tidak ditemukan"
            });
        const match = await argon2.verify( user.password, password,);
        if(!match) 
            return res.status(400).json({
                msg: "Wrong Password"
            });
            // Generate JWT token with user information
            const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: 'user',
                type: 'user',
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }); // Set expiry time
            
        res.status(200).json({token, role: 'user', id:user.id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
},

AddAdmin: async(req, res) => {
    const {
        username_admn,
        email_admn,
        password,
        confirmPassword,
        role
    } = req.body;
    if(password !== confirmPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const hashPassword = await argon2.hash(password);
    try {
        await Admin.create({
            username_admn: username_admn,
            email_admn: email_admn,
            password: hashPassword,
            role: role 
        });
        res.status(201).json({msg: "Register Berhasil"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

},

LoginAdmin : async (req, res) =>{
    try {
        const { email_admn, password} =req.body;
        const admin = await Admin.findOne({
            where: {
                email_admn,
            }
        });
        if(!admin) {
            return res.status(404).json({msg: "Admin tidak ditemukan"});
        }
        const match = await argon2.verify(admin.password, password);
        if(!match) {
            return res.status(400).json({msg: "Wrong Password"});
        }

        const payload = {
            id: admin.id,
            username_admn: admin.username_admn,
            email_admn: admin.email_admn,
            role: admin.role,
            type: 'admin',
          };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60m' }); // Set expiry time
    
        res.status(200).json({ token, role: admin.role });
    } catch (error) {
        console.error(error);
      res.status(500).json({ message: "Internal server error", error });
    }
},





}