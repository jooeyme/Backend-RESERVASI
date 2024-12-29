require("dotenv").config();
const { Booking, Room, Tool, User, sequelize } = require("../../models");
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const Sequelize = require('sequelize');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
function combineDateTime(dateString, timeString) {
  // Pisahkan komponen tanggal (tahun, bulan, hari)
  const [year, month, day] = dateString.split("-").map(Number);

  // Pisahkan komponen waktu (jam, menit)
  const [hours, minutes] = timeString.split(":").map(Number);

  // Buat objek Date dengan komponen yang digabung
  return new Date(year, month - 1, day, hours, minutes);
}
module.exports = {
  getTodayBookings: async (req, res) => {
    try {
      if (!Booking || !Booking.findAll) {
        throw new Error("Rooms not found");
      }
      const result = await Booking.findAll({
          include: [Room, Tool]
      });
        
      if (!Array.isArray(result)) {
          throw new Error("Expected an array of bookings");
        }
        
        const currentDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
        const currentTime = moment().tz('Asia/Jakarta');
        
        const todayBookings = result.filter(booking => {
          const bookingDate = moment(booking.booking_date, moment.ISO_8601).format('YYYY-MM-DD');
          const endTime = moment(`${bookingDate} ${booking.end_time}`, moment.ISO_8601);
          console.log("bokkdate:", bookingDate);
          console.log("endTime:", endTime);
          return bookingDate === currentDate && endTime.isAfter(currentTime);
        });

        console.log("logday: ", todayBookings)
    
        res.json(todayBookings);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error masa si", error: error.message });
      }
    },
  
      DownloadAllBooking: async (req, res) => {
        try {
            // Memeriksa apakah model Booking tersedia
            if (!Booking || !Booking.findAll) {
                throw new Error("Booking model not found");
            }

            // Mendapatkan query parameters untuk filter berdasarkan tanggal
            const { year, month } = req.params;

            // Membuat kondisi pencarian berdasarkan tanggal
            let dateFilter = {};

            if (year && month) {
              dateFilter = {
                  [Op.and]: [
                      Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal(`YEAR FROM "booking_date"`)), year),
                      Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal(`MONTH FROM "booking_date"`)), month)
                  ]
              };
          } else if (year) {
              dateFilter = Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal(`YEAR FROM "booking_date"`)), year);
          } else {
              throw new Error("Year is required for filtering.");
          }

            // Mengambil semua data booking dengan filter jika ada
            const result = await Booking.findAll({
                where: dateFilter
            });

            console.log("hasil:",result);

            // Membuat workbook dan worksheet baru
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Bookings');

            // Menambahkan header
            worksheet.columns = [
                { header: 'Booking ID', key: 'id', width: 10 },
                { header: 'Room ID', key: 'room_id', width: 10 },
                { header: 'User ID', key: 'user_id', width: 10 },
                { header: 'peminjam', key: 'peminjam', width: 10 },
                { header: 'kontak', key: 'kontak', width: 10 },
                { header: 'Booking date', key: 'booking_date', width: 10 },
                { header: 'Start time', key: 'start_time', width: 20 },
                { header: 'End time', key: 'end_time', width: 20 },
                { header: 'Deskripsi kegiatan', key: 'desk_activity', width: 20 },
                { header: 'Departemen', key: 'dept', width: 20 },
                { header: 'Status', key: 'booking_status', width: 20 },
                // Tambahkan kolom lain sesuai dengan struktur tabel booking Anda
            ];

            // Menambahkan data dari result ke worksheet
            result.forEach(booking => {
                worksheet.addRow({
                  user_id: booking.userId,
                  room_id: booking.room_id,
                  peminjam: booking.peminjam,
                  kontak: booking.kontak,
                  booking_date: booking.booking_date,
                  start_time: booking.start_time,
                  end_time: booking.end_time,
                  desk_activity: booking.desk_activity,
                  dept: booking.dept,
                  booking_status: booking.booking_status,
                    
                    // Tambahkan data lain sesuai dengan kolom yang ada
                });
            });

            // Menulis file Excel ke response dan set header untuk pengunduhan
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=bookings.xlsx');

            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    findAllBooking: async (req, res) => {
        try {
            if (!Booking || !Booking.findAll) {
                throw new Error("Rooms not found");
            }
            const result = await Booking.findAll({
              include: [Room, Tool]
           });
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
      res.status(500).json({ message: "Internal server Error", error: error.message });
    }
  },

  editBooking: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { booking_status, note } = req.body;
        
        const Booked = await Booking.findOne({
            where: {
            id: id,
            },
            transaction,
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
            
            if (booking_status === 'rejected' && Booked.booking_status !== 'rejected') {
              // Cari alat berdasarkan tool_id
              const tool = await Tool.findOne({
                  where: { tool_id: Booked.tool_id },
                  transaction,
              });
  
              if (!tool) {
                  return res.status(404).json({ message: "Tool not found" });
              }
  
              // Tambahkan jumlah alat kembali ke stok
              const updatedJumlah = tool.jumlah + Booked.quantity;
              await Tool.update(
                  { jumlah: updatedJumlah },
                  { where: { tool_id: Booked.tool_id }, transaction }
              );
              console.log("jumlah:", updatedJumlah);
          }

            Booked.note = note; 
            Booked.booking_status = booking_status;
            await Booked.save({transaction});
            
            await transaction.commit();

            res.status(200).json({
              status: 200,
              data:Booked});

    } catch (error) {
      await transaction.rollback();
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
        const statusBooking = 'pending';
        const quantity = 1;

        const startTime = combineDateTime(booking_date, start_time);
        const endTime = combineDateTime(booking_date, end_time);	

        if (startTime >= endTime) {
          return res.status(400).json({ message: 'Waktu mulai harus sebelum waktu selesai.' });
        }

        const conflict = await Booking.findOne({
          where: {
            room_id: room_id,
            [Sequelize.Op.or]: [
              {
                start_time: {
                  [Sequelize.Op.lt]: endTime,
                },
                end_time: {
                  [Sequelize.Op.gt]: startTime,
                },
              },
            ],
          },
        });
    
        if (conflict) {
          return res.status(400).json({ message: 'Waktu sudah direservasi, silakan pilih waktu lain.' });
        }
           
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
            booking_status: statusBooking,
            quantity: quantity,
        });
        

        // Kirim notifikasi email setelah booking berhasil dibuat
        // const userMailOptions = {
        //   from: 'mtejo25@gmail.com', // Ganti dengan email Anda
        //   to: 'tejom697@gmail.com', // Email peminjam yang dikirim melalui req.body
        //   subject: 'Booking Ruangan Berhasil',
        //   text: `
        //     Halo ${peminjam},

        //     Booking Anda telah berhasil dibuat dengan rincian sebagai berikut:

        //     - Ruangan: ${room_id}
        //     - Tanggal: ${moment(booking_date).format('DD MMM YYYY')}
        //     - Waktu Mulai: ${start_time}
        //     - Waktu Selesai: ${end_time}
        //     - Aktivitas: ${desk_activity}
        //     - Status: ${statusBooking}

        //     Terima kasih telah menggunakan layanan kami.

        //     Salam,
        //     Admin
        //   `,
        // };

        // Kirim email untuk admin
        const adminMailOptions = {
          from: 'mtejo25@gmail.com', // Ganti dengan email Anda
          to: 'spenseev9@gmail.com', // Ganti dengan email admin
          subject: 'Notifikasi Booking Baru',
          text: `
            Halo Admin,

            Ada booking baru yang telah dibuat dengan rincian sebagai berikut:

            - Pemesan: ${peminjam}
            - Ruangan: ${room_id}
            - Tanggal: ${moment(booking_date).format('DD MMM YYYY')}
            - Waktu Mulai: ${start_time}
            - Waktu Selesai: ${end_time}
            - Aktivitas: ${desk_activity}
            - Status: ${statusBooking}

            Mohon untuk memeriksa detail booking ini di sistem.

            Terima kasih.
          `,
        };

        try {
          // await req.transporter.sendMail(userMailOptions);
          await req.transporter.sendMail(adminMailOptions);
          console.log('Email sent successfully');
        } catch (error) {
          console.error('Error sending email:', error);
        }

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
          const accessTokenResponse = await oAuth2Client.getAccessToken();
          const accessToken = accessTokenResponse.token;

          const transporter = nodemailer.createTransport({
             service: 'gmail',
             auth: {
                 type: 'OAuth2',
                 user: 'mtejo25@gmail.com',
                 clientId: CLIENT_ID,
                 clientSecret: CLIENT_SECRET,
                 refreshToken: REFRESH_TOKEN,
                 accessToken: accessToken.token,
             },
          });

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
                quantity,
            } = req.body; // Ambil data dari body permintaan
            const statusBooking = 'pending';
            
            const startTime = new combineDateTime(booking_date, start_time);
            const endTime = new combineDateTime(booking_date, end_time);

            console.log("waktu mulai:", startTime);
            console.log("waktu selesai:", endTime);	

            if (startTime >= endTime) {
              return res.status(400).json({ message: 'Waktu mulai harus sebelum waktu selesai.' });
            }

            const conflict = await Booking.findOne({
              where: {
                tool_id: tool_id,
                [Sequelize.Op.or]: [
                  {
                    start_time: {
                      [Sequelize.Op.lt]: endTime,
                    },
                    end_time: {
                      [Sequelize.Op.gt]: startTime,
                    },
                  },
                ],
              },
            });
        
            if (conflict) {
              return res.status(400).json({ message: 'Waktu sudah direservasi, silakan pilih waktu lain.' });
            }

            const tool = await Tool.findOne({
              where: { tool_id: tool_id },
            });
            console.log("datatool:",tool);
            if (!tool) {
              return res.status(404).json({ message: 'Alat tidak ditemukan'});
            }

            if (tool.jumlah < quantity) {
              return res.status(400).json({ message: 'Jumlah alat tersedia tidak mencukupi'});
            }

            const updateJumlah = tool.jumlah - quantity;
            await Tool.update(
              { jumlah: updateJumlah},
              { where: { tool_id: tool_id} }
            );
                
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
                booking_status: statusBooking,
                quantity: quantity,
            });

            // Kirim notifikasi email setelah booking berhasil dibuat
            const userMailOptions = {
             from: 'mtejo25@gmail.com', // Ganti dengan email Anda
             to: 'tejom697@gmail.com', // Email peminjam yang dikirim melalui req.body
            subject: 'Booking Alat Berhasil',
             text: `
              Halo ${peminjam},

               Booking Anda telah berhasil dibuat dengan rincian sebagai berikut:

               - Alat: ${tool_id}
               - Tanggal: ${moment(booking_date).format('DD MMM YYYY')}
               - Waktu Mulai: ${start_time}
               - Waktu Selesai: ${end_time}
               - Aktivitas: ${desk_activity}
               - Status: ${statusBooking}

               Terima kasih telah menggunakan layanan kami.

                Salam,
                Admin
              `,
            };

            // Kirim email untuk admin
            const adminMailOptions = {
              from: 'mtejo25@gmail.com', // Ganti dengan email Anda
              to: 'spenseev9@gmail.com', // Ganti dengan email admin
              subject: 'Notifikasi Booking Baru',
              text: `
                Halo Admin,

                Ada booking baru yang telah dibuat dengan rincian sebagai berikut:

                - Pemesan: ${peminjam}
                - Alat: ${tool_id}
                - Tanggal: ${moment(booking_date).format('DD MMM YYYY')}
                - Waktu Mulai: ${start_time}
                - Waktu Selesai: ${end_time}
                - Aktivitas: ${desk_activity}
                - Status: ${statusBooking}

                Mohon untuk memeriksa detail booking ini di sistem.

                Terima kasih.
              `,
            };

            try {
              await transporter.sendMail(userMailOptions);
              await transporter.sendMail(adminMailOptions);
              console.log('Email sent successfully');
            } catch (error) {
              console.error('Error sending email:', error);
            }
        
            res.status(201).json({
                message: "Booking created successfully",
                data: newBooking,
            });
            } catch (error) {
            console.error(error);
            res.status(500).json({
                message: `Internal server error ${error.message}`,
            });
            }
        },
      
  turnInTool: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({
        where: { id: id }
      })
      //console.log(`Booking :`, booking)

      if (!booking) {
        return res.status(404).json({ message: "Booking not found"});
      }

      if (booking.booking_status === 'returned') {
        return res.status(400).json({ message: "Alat sudah dikembalikan sebelumnya" });
      }

      const tool = await Tool.findOne({
        where: { tool_id: booking.tool_id}
      });

      if (!tool) {
        return res.status(404).json({ message: "Tool not found"});
      }

      const updatedJumlah = tool.jumlah + booking.quantity;
      await Tool.update(
        { jumlah: updatedJumlah},
        {where: {tool_id: booking.tool_id}}
      );

      await Booking.update(
        { booking_status: 'returned'},
        { where: { id: id}}
      );

      res.status(200).json({ 
        message: "Alat Berhasil Dikembalikan",
        data: {
          tool_id: booking.tool_id,
          tool_name: booking.tool_name,
          returned_quantity: booking.quantity,
          available_quantity: updatedJumlah
        },
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });    
    }
  },

  turnInRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({
        where: { id: id }
      })

      if (!booking) {
        return res.status(404).json({ message: "Booking not found"});
      }

      if (booking.booking_status === 'returned') {
        return res.status(400).json({ message: "Booking sudah dikembalikan sebelumnya" });
      }

      await Booking.update(
        { booking_status: 'returned'},
        { where: { id: id}}
      );

      res.status(200).json({ 
        message: "Alat Berhasil Dikembalikan",
        data: {
          returned_quantity: booking.quantity,
        },
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });    
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
          }, 
            include: [Room, Tool]
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
          }, 
          include: [Room, Tool]
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