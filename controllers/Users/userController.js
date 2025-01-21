const { User } = require('../../models')
const argon2 = require("argon2");

module.exports = {
    getUser: async(req, res) => {
        try {
            const result = await User.findAll({
                attributes:['id','username','email','password', 'NIM', 'alamat']
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

    getUserById: async(req, res) => {
        try {
            const {id} = req.params;
            const result = await User.findOne({
                where: {
                    id: id,
                },
            });

            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ 
                message: `Successfully get user ${id}`,
                data: result,
            });
        } catch (error) {
            res.status(500).json({ message:"internal server error", error: error})
        }
    },

    updateUser: async(req, res) => {
        const { id } = req.params;
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        const {username, email, password, NIM, dept, alamat} = req.body;
        // let hashPassword;
        // if(password === "" || password === null){
        //     hashPassword = user.password
        // }else{
        //     hashPassword = await argon2.hash(password);
        // }
        // if(password !== confirmPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
        try {
            const UpdatedUser = await User.update({
                username: username,
                email: email,
                password: password,
                NIM: NIM,
                dept: dept,
                alamat:alamat,
            },{
                where:{
                    id: user.id
                }
            });
            res.status(200).json({
                msg: "User Updated",
                data: UpdatedUser
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteUser: async(req, res) => {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        try {
            await User.destroy({
                where:{
                    id: user.id
                }
            });
            res.status(200).json({msg: "User Deleted"});
        } catch (error) {
            res.status(400).json({msg: error.message});
        }
    }
}