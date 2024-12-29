const { Admin } = require('../../models')
const argon2 = require('argon2');

module.exports = {
    getAdmin: async(req, res) => {
        try {
            const result = await Admin.findAll({
                attributes:['id','username_admn','email_admn', 'role', 'password']
            });
            res.status(200).json({
                message: "Get All Data",
                data: result,
              });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getAdminById: async(req, res) => {
        try {
            const {id} = req.params;
            const result = await Admin.findOne({
                where: {
                    id: id,
                },
            });

            if (!result) {
                return res.status(404).json({ message: "Admin not found" });
            }

            res.status(200).json({ 
                message: `Successfully get admin ${id}`,
                data: result,
            });
        } catch (error) {
            res.status(500).json({ message:"internal server error", error: error})
        }
    },

    updateAdmin: async(req, res) => {
        const admin = await Admin.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!admin) return res.status(404).json({msg: "User tidak ditemukan"});
        const {
            username_admn, 
            email_admn, 
            password, 
            role
        } = req.body;
        let hashPassword;
        // if(password === "" || password === null){
        //     hashPassword = admin.password
        // }else{
        //     hashPassword = await argon2.hash(password);
        // }
        // if(password !== confirmPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
         try {
            await Admin.update({
                username_admn: username_admn,
                email_admn: email_admn,
                password: password,
                role: role,
            },{
                where:{
                    id: admin.id
                }
            });
            res.status(200).json({msg: "User Updated"});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteAdmin: async(req, res) => {
        const admin = await Admin.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!admin) return res.status(404).json({msg: "Admin tidak ditemukan"});
        try {
            await Admin.destroy({
                where:{
                    id: admin.id
                }
            });
            res.status(200).json({msg: "Admin Deleted"});
        } catch (error) {
            res.status(400).json({msg: error.message});
        }
    }
    
}