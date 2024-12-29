// const { Room } = require("../models");

// module.exports = {
//     getImages: async (req, res) => {
//         try {
//             const gambar = req.params
//             const result = await Room.findOne({
//                 where: {
//                   gambar_room: gambar,
//                 },
//               });
//             res.status(200).json({
//                 message: "Get Images Successfully",
//                 data: result, 
//             });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: "Internal server error" });
//         }

//     },

// }