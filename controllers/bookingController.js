const { Booking, Room, Tool, User } = require("../models");

module.exports = {
    findAllBooking: async (req, res) => {
        try {
            if (!Booking || !Booking.findAll) {
                throw new Error("Rooms not found");
            }
            const result = await Booking.findAll();
            res.status(200).json({
                message: "Get All Data",
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
      },

  findAllBookingByUserId: async (req, res) => {
    try {
      const userId = req.userData.id;
      const result = await Booking.findAll({ 
        where: { 
          user_id: userId 
        },
          include: [Room, Tool]
       });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  showBookingById: async (req, res) => {
    try {
      const { id } = req.params;
      const Booked = await Booking.findOne({
        where: {
          id: id,
          //room_id: room_id
        },
          include: [Room, Tool],
      });

      if (!Booked) {
        return res.status(404).json({
          message: `Booking with id ${id} not found.`,
        });
      }

      res.status(200).json(Booked);
      console.log(Booked);
    } catch (error) {
      res.status(500).json({ message: "Internal server Error" });
    }
  },

  editBooking: async (req, res) => {
    try {
        const { id } = req.params;
        const { booking_status } = req.body;
        const Booked = await Booking.findOne({
            where: {
            id: id,
            },
        });

        if (!Booked) {
            return res.status(404).json({
            message: `Booking with id ${id} not found.`,
            });
        }

        const allowedStatus = ['pending', 'approved', 'rejected'];
        if (!allowedStatus.includes(booking_status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }
            Booked.booking_status = booking_status;
            await Booked.save();
            res.status(200).json({
              status: 200,
              data:Booked});

    } catch (error) {
      res.status(500).json({ message: "Internal server Error" });
    }
  },

  createBookingRoom: async (req, res) => {
    try {
        const userId = req.userData.id;
        const { 
            room_id,
            peminjam,
            kontak,
            booking_date,
            start_time,
            end_time,
            desk_activity,
            dept
          
        } = req.body; 
           
      // Buat Booking baru di database
        const newBooking = await Booking.create({
            user_id: userId,
            room_id: room_id,
            peminjam: peminjam,
            kontak: kontak,
            booking_date: booking_date,
            start_time: start_time,
            end_time: end_time,
            desk_activity: desk_activity,
            dept: dept,
            booking_status: 'pending',
        });
        console.log(userId)

        res.status(201).json({
            message: "Booking created successfully",
            data: newBooking,
            userID: userId,
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
        }
    },

    createBookingTool: async (req, res) => {
        try {
            const usersId = req.userData.id;
            const { 
                tool_id,
                peminjam,
                kontak,
                booking_date,
                start_time,
                end_time,
                desk_activity,
                dept,
            } = req.body; // Ambil data dari body permintaan
                
          // Buat Booking baru di database
            const newBooking = await Booking.create({
                user_id: usersId,
                tool_id: tool_id,
                peminjam: peminjam,
                kontak: kontak,
                booking_date: booking_date,
                start_time: start_time,
                end_time: end_time,
                desk_activity: desk_activity,
                dept: dept,
                booking_status: 'pending',
            });
    
            res.status(201).json({
                message: "Booking created successfully",
                data: newBooking,
            });
            } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error",
            });
            }
        },

  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Booking.destroy({
        where: { id: id },
      });

      if (result > 0) {
        return res.status(200).json({ message: `Booking with id ${id} deleted!` });
      } else {
        return res.status(404).json({ message: `Booking with id ${id} not found.` });
      }
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  },

  getBookingByRoomId: async (req, res) => {
    try {
      const { room_id } = req.params;
      
      const result = await Booking.findAll({
          where: {
              room_id: room_id,
          }
      });
      res.status(200).json({
        message: "Get All Data",
        data: result,
    });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  getBookingByToolId: async (req, res) => {
    try {
      const { tool_id } = req.params;
      
      const result = await Booking.findAll({
          where: {
              tool_id: tool_id,
          }
      });
      res.status(200).json({
        message: "Get All Data",
        data: result,
    });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  
};