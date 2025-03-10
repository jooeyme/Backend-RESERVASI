const { Room } = require("../../models");
const path = require("path");
const fs = require("fs");

module.exports = {
  findAllRoom: async (req, res) => {
    try {
      if (!Room || !Room.findAll) {
        throw new Error("Rooms not found");
      }
      const result = await Room.findAll();
      res.status(200).json({
        message: "Get All Data",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  findAllRoomsId: async (req, res) => {
    try {      
      const availableRoooms = await Room.findAll({
        attributes:['room_id', 'name_room']
      });

      if (availableRoooms.length === 0) {
        
        return res.status(404).json({ message: "Tidak ada ruangan yang dapat digunakan."});
      }
  
      res.status(200).json({ rooms: availableRoooms});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error: error.message  });
    }
  },

  showRoomById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Room.findOne({
        where: {
          id: id,
        },
      });

      if (!Room) {
        return res.status(404).json({
          message: `Room with id ${id} not found.`,
        });
      }

      res.status(200).json({
        message: `Success get Room with id ${id}`,
        data: result,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server Error" });
    }
  },

  editRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        room_id, 
        name_room, 
        alamat_room, 
        kapasitas, 
        luas, 
        deskripsi_room, 
        fasilitas,
        require_double_verification,
        type,
        pengelola,
      } = req.body;
      //const gambar_room = req.file.filename;

      const result = await Room.findOne({
        where: {
          id: id,
        },
      });

      if (!result) {
        return res.status(404).json({
          message: `Room with id ${id} not found.`,
        });
      }

      let newGambarRoom;
      if (req.file) { // Image upload detected
        newGambarRoom = req.file.filename;

        // Delete previous image (if applicable)
        if (result.gambar_room) {
          const previousImagePath = path.join('public/images', result.gambar_room); // Adjust path as needed
          try {
            if(fs.existsSync(previousImagePath)) {
            await fs.promises.unlink(previousImagePath); // Use fs.promises for async/await
          } 
        } catch (error) {
            console.error(`Error deleting previous image: ${error}`);
            // Consider returning an appropriate error response if deletion is critical
          }
        }
      } else { // No image upload, keep existing image
        newGambarRoom = result.gambar_room;
      }

      const updateRoom = await Room.update(
        {
            room_id: room_id, 
            name_room: name_room, 
            alamat_room: alamat_room, 
            kapasitas: kapasitas, 
            luas: luas,  
            deskripsi_room: deskripsi_room, 
            fasilitas: fasilitas, 
            require_double_verification: require_double_verification,
            type: type,
            pengelola: pengelola,
            gambar_room: newGambarRoom, 
        },
        {
          where: {
            id: id,
          },
        }
      );

      res.status(200).json({
        message: `Success update job with id ${id}`,
        data: updateRoom,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server Error" });
    }
  },

  createRoom: async (req, res) => {
    try {
        const { 
            room_id, 
            name_room, 
            alamat_room, 
            kapasitas, 
            luas, 
            deskripsi_room, 
            fasilitas,
            require_double_verification,
            type,
            pengelola,
          } = req.body;
        
        const gambar_room = req.file.filename;
         

      // Buat job baru di database
      const newRoom = await Room.create({
        room_id: room_id, 
        name_room: name_room, 
        alamat_room: alamat_room, 
        kapasitas: kapasitas, 
        luas: luas,  
        deskripsi_room: deskripsi_room, 
        fasilitas: fasilitas, 
        require_double_verification: require_double_verification,
        type: type,
        pengelola: pengelola,
        gambar_room: gambar_room, 
      });

      res.status(201).json({
        message: "Room created successfully",
        data: newRoom,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
 
  deleteRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const room = await Room.findOne({
        where: { id: id },
      });
      
      if (room) {
        const imagePath = path.join('public/images', room.gambar_room); 
        try {
          if(fs.existsSync(imagePath)) {
          await fs.promises.unlink(imagePath);
          await Room.destroy({
            where: { id: id },
          });
          res.status(200).json({
            message: `Room with id ${id} deleted successfully`
          })}
        } catch (error) {
          return res.status(500).json({ 
            message: `Error deleting image` 
          });
        }
      } else {
        return res.status(404).json({ 
          message: `Room with id ${id} not found.` 
        });
      }
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  },
};