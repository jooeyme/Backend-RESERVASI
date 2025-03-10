require("dotenv").config();
const { User, Admin } = require("../../models")
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const BASE_LINK = process.env.FRONTEND_URL;

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

    ForgotPassword: async(req, res) => {
        const { email } = req.body;

        if(!email) {
            return res.status(440).json({message: "Invalid input email"})
        }
        const user = await User.findOne({
            where: { email: email}
        });

        if (!user) return res.status(404).json({ message: 'Email tidak ditemukan' });
        
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '60m' });
        const resetLink = `${BASE_LINK}/auth/reset-password/${token}`;
    
        // Kirim email
        await req.transporter.sendMail({
            from: process.env.EMAIL_MNH,
            to: user.email,
            subject: 'Reset Password',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
                <div style="text-align: center; margin-bottom: 20px;">
                <H1>Forest Management Services</H1>
                </div>
                <p>Hello,</p>
                <p>You are receiving this email because we received a password reset request for your account.</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>This password reset link will expire in 60 minutes.</p>
                <p>If you did not request a password reset, no further action is required.</p>
                <p>Thanks,</p>
                <p>Forest Management</p>

                <div style="background-color:azure; padding: 20px; max-width: 600px; margin: auto;">
                    <p>If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser: ${resetLink}</p>    
                </div>
            </div>
            `,
        });
    
        res.json({ message: 'Email reset password telah dikirim' });
    },

    ResetPassword: async(req, res) => {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
            const { confirmPassword } = req.body;
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({
                where: { email: decoded.email}
            });
            if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
            
            if(newPassword !== confirmPassword) {
                return res.status(400).json({
                    msg: "Password dan Confirm Password baru tidak cocok"
                });
            }
            const passwordHashed = await argon2.hash(newPassword);

            await User.update(
                { password: passwordHashed },
                { where: { email: decoded.email } }
            );
            res.json({ message: 'Password berhasil direset' });
        } catch (error) {
            res.status(400).json({ message: 'Token tidak valid atau telah kadaluarsa' });
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