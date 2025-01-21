require("dotenv").config();
const { Booking, Room, Tool, User, sequelize } = require("../../models");
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const Sequelize = require('sequelize');
const moment = require('moment-timezone');
const { google } = require('googleapis');
const { format } = require('date-fns');
const fs = require('fs');
const { id } = require('date-fns/locale'); // Import locale Indonesia
const { PDFDocument, rgb } = require('pdf-lib');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const email = process.env.EMAIL_MNH;

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
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
  
  DownloadAllRoomBooking: async (req, res) => {
      try {
          // Mendapatkan query parameters untuk filter berdasarkan tanggal
          const { startDate, endDate } = req.query;

          console.log("date1:", startDate)

          // Membuat kondisi pencarian berdasarkan tanggal
          if (!startDate || !endDate) {
            return res.status(400).json({message: "Start date and end date are required"})  
          }

          console.log("date1:", startDate)

          // Mengambil semua data booking dengan filter jika ada
          const result = await Booking.findAll({
              where: {room_id: {[Op.ne]: null},
              booking_date: {
                [Op.between]:  [new Date(startDate), new Date(endDate)],
              }
            },
          });

          // Membuat workbook dan worksheet baru
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Room Bookings');

          // Menambahkan header
          worksheet.columns = [
              { header: 'Booking ID', key: 'id', width: 10 },
              { header: 'User ID', key: 'user_id', width: 10 },
              { header: 'Room ID', key: 'room_id', width: 10 },
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
              id: booking.id,
              user_id: booking.user_id,
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
          res.setHeader('Content-Disposition', `attachment; filename=RekapRoombookings-${startDate}-${endDate}.xlsx`);

          await workbook.xlsx.write(res);
          res.end();

      } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal server error", error: error.message });
      }
  },

  DownloadAllToolBooking: async (req, res) => {
    try {
      // Mendapatkan query parameters untuk filter berdasarkan tanggal
      const { startDate, endDate } = req.query;

      // Membuat kondisi pencarian berdasarkan tanggal
      if (!startDate || !endDate) {
        return res.status(400).json({message: "Start date and end date are required"})  
      }

      // Mengambil semua data booking dengan filter jika ada
      const result = await Booking.findAll({
          where: {tool_id: {[Op.ne]: null},
        booking_date: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
        },
      });

      // Membuat workbook dan worksheet baru
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Tool Bookings');

      // Menambahkan header
      worksheet.columns = [
          { header: 'Booking ID', key: 'id', width: 10 },
          { header: 'User ID', key: 'userId', width: 10 },
          { header: 'Tool ID', key: 'tool_id', width: 10 },
          { header: 'Banyak alat:', key: 'quantity', width: 10 },
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
            id: booking.id,
            user_id: booking.user_id,
            tool_id: booking.tool_id,
            quantity: booking.quantity,
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
      res.setHeader('Content-Disposition', `attachment; filename=RekapToolbookings-${month}-${year}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      
    }
  },

  DownloadAllRoomRecapPDF: async (req, res) => {
    try {
      const {startDate, endDate} = req.query;

      if(!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required'});
      }

      const bookings = await Booking.findAll({
        where: {
          room_id: { [Op.ne]: null},
          booking_date: {
            [Op.between]:  [new Date(startDate), new Date(endDate)],
          }
        },
      });

      if(!bookings || bookings.length === 0) {
        return res.status(404).send({ message: 'Booking not found' });
      }

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]);

      const {width, height} = page.getSize();
      const marginX = 10;
      const marginY = 50;

      page.drawText('Room Booking Recap', {
        x: marginX,
        y: height - marginY,
        size: 16,
        color: rgb(0, 0, 0),
      });

      page.drawText(`From: ${startDate} To: ${endDate}`, {
        x: marginX,
        y: height - marginY - 20,
        size: 12,
        color: rgb(0, 0, 0),
      });

      const headers = ['No', 'Room ID', 'Peminjam', 'Kontak', 'Booking Date', 'Start time', 'End time', 'Deskripsi Kegiatan', 'Departemen', 'Status'];
      const columnWidths = [20, 50, 70, 70, 70, 50, 50, 80, 70, 70]; // Lebar kolom tetap
      const columnOffsets = columnWidths.reduce((acc, width, i) => {
        acc.push((acc[i - 1] || marginX) + width);
        return acc;
      }, []);
      const rowHeight = 30;

      // Header tabel
      let currentY = height - marginY - 50;
      headers.forEach((header, index) => {
        page.drawText(header, {
          x: columnOffsets[index] - columnWidths[index] + 5,
          y: currentY,
          size: 8,
          color: rgb(0, 0, 0),
        });
      });

      // Garis bawah header
      page.drawLine({
        start: { x: marginX, y: currentY - 5 },
        end: { x: columnOffsets[columnOffsets.length - 1], y: currentY - 5 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });

      currentY -= 10;
      
      const wrapText = (text, columnWidth, fontSize) => {
        const maxChars = Math.floor(columnWidth / (fontSize* 0.5));
        const words = text.split(' ');
        let line = '';
        const lines = [];
  
        words.forEach((word) => {
          if ((line + word).length <= maxChars) {
            line += word + ' ';
          } else {
            lines.push(line.trim());
            line = word + ' ';
          }
        });
  
        if (line) lines.push(line.trim());
        return lines;
      };      
      
      bookings.forEach((booking, index) => {
        const row = [
            (index + 1).toString(),
            booking.room_id || '-',
            booking.peminjam || '-',
            booking.kontak || '-',
            booking.booking_date.toISOString().slice(0, 10),
            booking.start_time || '-',
            booking.end_time || '-',
            booking.desk_activity || '-',
            booking.dept || '-',
            booking.booking_status || '-',
        ];

    // Tentukan tinggi baris berdasarkan konten terpanjang
        let maxRowHeight = rowHeight;

        row.forEach((cell, cellIndex) => {
          const columnWidth = columnWidths[cellIndex];
          const textLines = wrapText(cell, columnWidth - 10, 8);
  
          textLines.forEach((line, lineIndex) => {
            page.drawText(line, {
              x: columnOffsets[cellIndex] - columnWidth + 5,
              y: currentY - lineIndex * 12 - 8,
              size: 8,
              color: rgb(0, 0, 0),
            });
          });
  
          const cellHeight = textLines.length * 12 + 10;
          if (cellHeight > maxRowHeight) {
            maxRowHeight = cellHeight;
          }
        });

        // Gambar garis horizontal untuk baris
        page.drawLine({
          start: { x: marginX, y: currentY - maxRowHeight },
          end: { x: columnOffsets[columnOffsets.length - 1], y: currentY - maxRowHeight },
          thickness: 0.5,
          color: rgb(0, 0, 0),
        });

        currentY -= maxRowHeight;

        // Tambahkan halaman baru jika ruang tidak cukup
        if (currentY < marginY) {
          currentY = height - marginY;
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          page = newPage;
        }
    
        

      // Gambar garis vertikal untuk border kolom
      //   columnWidths.reduce((xPos, colWidth) => {
      //     page.drawLine({
      //         start: { x: xPos, y: startY },
      //         end: { x: xPos, y: startY - maxRowHeight },
      //         thickness: 0.5,
      //         color: rgb(0, 0, 0),
      //     });
      //     return xPos + colWidth;
      // }, startX);
    
        // currentY -= maxRowHeight;
    
        // Tambahkan halaman baru jika ruang tidak cukup
        // if (currentY < 50) {
        //     currentY = height - 50;
        //     const newPage = pdfDoc.addPage([595.28, 841.89]); // Pastikan halaman baru dirujuk
        //     page = newPage; // Referensi ke halaman baru
        
    });
    
     // Konversi PDF ke buffer
     const pdfBytes = await pdfDoc.save();

     // Header untuk unduhan PDF
     
     res.setHeader('Content-Type', 'application/pdf');
     res.setHeader('Content-Disposition', `attachment; filename=RecapRoomBookings-${startDate}-to-${endDate}.pdf`);
     res.send(Buffer.from(pdfBytes));

    } catch (error) {
      console.error("Error in downloadRecapPDF:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  DownloadAllToolRecapPDF: async (req, res) => {
    try {
      const {startDate, endDate} = req.query;

      if(!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required'});
      }

      const bookings = await Booking.findAll({
        where: {
          tool_id: { [Op.ne]: null},
          booking_date: {
            [Op.between]:  [new Date(startDate), new Date(endDate)],
          }
        },
      });

      if(!bookings || bookings.length === 0) {
        return res.status(404).send({ message: 'Booking not found' });
      }

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]);

      const {width, height} = page.getSize();
      const marginX = 10;
      const marginY = 50;

      page.drawText('Room Booking Recap', {
        x: marginX,
        y: height - marginY,
        size: 16,
        color: rgb(0, 0, 0),
      });

      page.drawText(`From: ${startDate} To: ${endDate}`, {
        x: marginX,
        y: height - marginY - 20,
        size: 12,
        color: rgb(0, 0, 0),
      });

      const headers = ['No', 'Tool ID', 'Peminjam', 'Kontak', 'Jumlah alat', 'Booking Date', 'Start time', 'End time', 'Deskripsi Kegiatan', 'Departemen', 'Status'];
      const columnWidths = [20, 40, 60, 60, 20, 70, 50, 50, 80, 70, 70]; // Lebar kolom tetap
      const columnOffsets = columnWidths.reduce((acc, width, i) => {
        acc.push((acc[i - 1] || marginX) + width);
        return acc;
      }, []);
      const rowHeight = 30;

      // Header tabel
      let currentY = height - marginY - 50;
      headers.forEach((header, index) => {
        page.drawText(header, {
          x: columnOffsets[index] - columnWidths[index] + 5,
          y: currentY,
          size: 8,
          color: rgb(0, 0, 0),
        });
      });

      // Garis bawah header
      page.drawLine({
        start: { x: marginX, y: currentY - 5 },
        end: { x: columnOffsets[columnOffsets.length - 1], y: currentY - 5 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });

      currentY -= 10;
      
      const wrapText = (text, columnWidth, fontSize) => {
        const maxChars = Math.floor(columnWidth / (fontSize* 0.5));
        const words = text.split(' ');
        let line = '';
        const lines = [];
  
        words.forEach((word) => {
          if ((line + word).length <= maxChars) {
            line += word + ' ';
          } else {
            lines.push(line.trim());
            line = word + ' ';
          }
        });
  
        if (line) lines.push(line.trim());
        return lines;
      };      
      
      bookings.forEach((booking, index) => {
        const row = [
            (index + 1).toString(),
            booking.tool_id || '-',
            booking.peminjam || '-',
            booking.kontak || '-',
            booking.quantity || '-',
            booking.booking_date.toISOString().slice(0, 10),
            booking.start_time || '-',
            booking.end_time || '-',
            booking.desk_activity || '-',
            booking.dept || '-',
            booking.booking_status || '-',
        ];

        
    // Tentukan tinggi baris berdasarkan konten terpanjang
        let maxRowHeight = rowHeight;

        row.forEach((cell, cellIndex) => {
          const columnWidth = columnWidths[cellIndex];
          const textLines = wrapText(cell, columnWidth - 10, 8);
  
          textLines.forEach((line, lineIndex) => {
            page.drawText(line, {
              x: columnOffsets[cellIndex] - columnWidth + 5,
              y: currentY - lineIndex * 12 - 8,
              size: 8,
              color: rgb(0, 0, 0),
            });
          });
  
          const cellHeight = textLines.length * 12 + 10;
          if (cellHeight > maxRowHeight) {
            maxRowHeight = cellHeight;
          }
        });

        // Gambar garis horizontal untuk baris
        page.drawLine({
          start: { x: marginX, y: currentY - maxRowHeight },
          end: { x: columnOffsets[columnOffsets.length - 1], y: currentY - maxRowHeight },
          thickness: 0.5,
          color: rgb(0, 0, 0),
        });

        currentY -= maxRowHeight;

        // Tambahkan halaman baru jika ruang tidak cukup
        if (currentY < marginY) {
          currentY = height - marginY;
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          page = newPage;
        }
    
    });
    
     // Konversi PDF ke buffer
     const pdfBytes = await pdfDoc.save();

     // Header untuk unduhan PDF
     
     res.setHeader('Content-Type', 'application/pdf');
     res.setHeader('Content-Disposition', `attachment; filename=RecapRoomBookings-${startDate}-to-${endDate}.pdf`);
     res.send(Buffer.from(pdfBytes));

    } catch (error) {
      console.error("Error in downloadRecapPDF:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  findAllBooking: async (req, res) => {
      try {
          if (!Booking || !Booking.findAll) {
              throw new Error("Rooms not found");
          };
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
          user_id: userId,
          is_admin: false
        },
          include: [Room, Tool]
       });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  findAllBookingByAdminId: async (req, res) => {
    try {
      const userId = req.adminData.id;
      const result = await Booking.findAll({ 
        where: { 
          user_id: userId,
          is_admin: true
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
      console.log("nilai room:",Booked.Room);
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

  verifyBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const roleAdm = req.adminData.role
      const { verify_status, note } = req.body;
  
      // Validasi input status
      if (![true, false].includes(verify_status)) {
        return res.status(400).json({ message: 'Status must be true or false.' });
      }
  
      // Cari booking berdasarkan ID
      const booking = await Booking.findByPk(id, {
        include: [Room, Tool]
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }
  
      // Verifikasi oleh Admin Lab = 'admin_staff'
      if (roleAdm === 'admin_staff') {
        if (booking.Room?.type === 'lab' || booking.Tool?.type === 'lab' || booking.Tool?.type === 'multimedia') {
          booking.verified_admin_lab = verify_status;
        
          if (verify_status === false && !note) {
            return res.status(400).json({ message: 'Note is required when rejecting as lab admin.' });
          }

          if (verify_status === true && (booking.Tool.require_double_verification == false || booking.Room.require_double_verification === false)) {
            booking.booking_status = 'approved';
          }
  
          if (verify_status === false) {
            booking.booking_status = 'rejected';
            booking.note = note; // Alasan penolakan dari Admin Lab
          }
          await booking.save();
      
          return res.json({
            message: verify_status
              ? 'Booking approved by lab admin, waiting for super admin.'
              : 'Booking rejected by lab admin.',
          });
      }}
      // Verifikasi oleh Admin Multimedia = 'admin_mm'
      if (roleAdm === 'admin_mm') {
        if (booking.Tool?.type === 'multimedia') {
          booking.verified_admin_lab = verify_status;
        
          if (verify_status === false && !note) {
            return res.status(400).json({ message: 'Note is required when rejecting as lab admin.' });
          }

          if (verify_status === true && booking.Tool.require_double_verification == false) {
            booking.booking_status = 'approved';
          }
  
          if (verify_status === false) {
            booking.booking_status = 'rejected';
            booking.note = note; // Alasan penolakan dari Admin mm
          }
          await booking.save();
      
          return res.json({
            message: verify_status
              ? 'Booking approved by multimedia admin, waiting for tu admin.'
              : 'Booking rejected by multimedia admin.',
          });
      }}

      // Verifikasi oleh Admin Room = 'admin' atau Admin TU = 'admin_tu'
      if (roleAdm === 'admin') {
        if (booking.Room?.type === 'meeting' || booking.Room?.type === 'class' ) {
          booking.verified_admin_room = verify_status;
        
          if (verify_status === false && !note) {
            return res.status(400).json({ message: 'Note is required when rejecting as lab admin.' });
          }

          if (verify_status === true && (booking.Tool.require_double_verification == false || booking.Room.require_double_verification === false)) {
            booking.booking_status = 'approved';
          }
  
          if (verify_status === false) {
            booking.booking_status = 'rejected';
            booking.note = note; // Alasan penolakan dari Admin Lab
          }
          await booking.save();
      
          return res.json({
            message: verify_status
              ? 'Booking approved by room admin, waiting for leader admin.'
              : 'Booking rejected by room admin.',
          });
      }}
  
      // Verifikasi oleh Admin Super
      if (roleAdm === 'admin_tu') {
        if (booking.Tool?.require_double_verification || booking.Room?.require_double_verification && booking.verified_admin_lab) {
          booking.verified_admin_tu = verify_status;
  
          if (verify_status === false && !note) {
            return res.status(400).json({ message: 'Note is required when rejecting as super admin.' });
          }
          
          if (verify_status === false) {
            booking.booking_status = 'rejected';
            booking.note = note; // Alasan penolakan dari Admin Super
          } else {
            booking.booking_status = 'approved'; 
          }
          await booking.save();
          return res.json({
            message: verify_status
              ? 'Booking approved by super admin.'
              : 'Booking rejected by super admin.',
          });
      }}

      if (roleAdm === 'admin_leader') {
        if (booking.Room?.require_double_verification && booking.verified_admin_room) {
          booking.verified_admin_leader = verify_status;

          if (verify_status === 'false') {
            booking.booking_status = 'rejected';
            booking.note = note;
          } else {
            booking.booking_status = 'approved';
          }

          await booking.save();
          return res.json({
            message: verify_status
              ? 'Booking approved by leader admin.'
              : 'Booking rejected by leader admin.',
          });
        }
      }
  
      return res.status(400).json({ message: 'Invalid roleAdm.'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  },

  getFilteredBooking: async (req, res) => {
    try {
      const roleAdm = req.adminData.role;

      console.log("role admin:", roleAdm);
      let whereCondition = {};

      if (roleAdm === 'admin_staff') {
        whereCondition = {
          [Sequelize.Op.or]: [
            { '$Room.type$': 'lab' },
            { '$Tool.type$': 'lab' },  
          ],
          booking_status: 'pending',
          verified_admin_lab: null,
        };

      } else if (roleAdm === 'admin_mm') {
        whereCondition = {
          '$Tool.type$': 'multimedia',
          booking_status: 'pending',
          verified_admin_lab: null,
        };

      } else if (roleAdm === 'admin') {
        whereCondition = {
          [Sequelize.Op.or]: [
            {'$Room.type$': 'class'},
            {'$Room.type$': 'meeting'},
          ],
          booking_status: 'pending',
          verified_admin_room: null,
        };

      } else if (roleAdm === 'admin_tu') {
        whereCondition = {
          [Sequelize.Op.or]: [
            {'$Room.type$': 'lab'},
            {'$Tool.type$': 'lab'},
            {'$Tool.type$': 'multimedia'},
            {'$Tool.require_double_verification$': true},
            {'$Room.require_double_verification$': true}
          ],
          booking_status: 'pending',
          verified_admin_lab: true,
          verified_admin_tu: null,
        };

      } else if (roleAdm === 'admin_leader') {
        whereCondition = {
          '$Room.require_double_verification$': true,
          booking_status: 'pending',
          verified_admin_room: true,
          verified_admin_leader: null
        };
      }

      console.log("apa isi:", whereCondition)

      const bookings = await Booking.findAll({
        where: whereCondition,
        include: [Room, Tool]
      });

      res.status(200).json({
        message: "Get All Filtered Data Booking",
        data: bookings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
  },

  getFilteredBookingNotPending: async (req, res) => {
    try {
      const roleAdm = req.adminData.role;

      let whereCondition = {
        booking_status: { [Sequelize.Op.ne]: 'pending' },
      };

      if (roleAdm === 'admin_staff') {
        whereCondition = {
          ...whereCondition,
          [Sequelize.Op.or]: [
            { '$Room.type$': 'lab' },
            { '$Tool.type$': 'lab' },  
          ]
        };

      } else if (roleAdm === 'admin_mm') {
        whereCondition = {
          ...whereCondition,
          '$Tool.type$': 'multimedia',
        };

      } else if (roleAdm === 'admin') {
        whereCondition = {
          ...whereCondition,
          [Sequelize.Op.or]: [
            {'$Room.type$': 'class'},
            {'$Room.type$': 'meeting'},
          ],
          
        };

      } else if (roleAdm === 'admin_leader' || roleAdm === 'admin_tu') {
        whereCondition = {
          ...whereCondition,
          [Sequelize.Op.or]: [
            {'$Room.type$': 'lab'},
            {'$Tool.type$': 'lab'},
            {'$Tool.type$': 'multimedia'},
            {'$Room.type$': 'class'},
            {'$Room.type$': 'meeting'},
          ]
        };
      }

      const bookings = await Booking.findAll({
        where: whereCondition,
        include: [Room, Tool]
      });

      res.status(200).json({
        message: "Get All Filtered Data Booking",
        data: bookings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
  },

  getAllTrackingBookings: async (req, res) => {
    try {
      const roleAdm = req.adminData.role;

      if (roleAdm === 'admin_staff') {
        whereCondition = {
          [Sequelize.Op.or]: [
            { '$Room.type$': 'lab' },
             
          ]
        };

      } else if (roleAdm === 'admin') {
        whereCondition = {
          [Sequelize.Op.or]: [
            {'$Room.type$': 'class'},
            {'$Room.type$': 'meeting'},
          ],
          
        };

      } else if (roleAdm === 'admin_leader' || roleAdm === 'admin_tu') {
        whereCondition = {
          [Sequelize.Op.or]: [
            {'$Room.type$': 'lab'},
            {'$Room.type$': 'class'},
            {'$Room.type$': 'meeting'},
          ]
        };
      }
      
      const bookings = await Booking.findAll({
        where: whereCondition,
        include: [Room]
      });
  
      const bookingsWithTracking = bookings.map((booking) => {
        const tracking = [];

        // Format createdAt dan updatedAt dengan locale Indonesia
        const formattedCreatedAt = format(new Date(booking.createdAt), 'dd MMMM yyyy HH:mm', { locale: id });
        const formattedUpdatedAt = format(new Date(booking.updatedAt), 'dd MMMM yyyy HH:mm', { locale: id });

        if (booking.is_admin === true) {
          tracking.push(`Booking dibuat pada tanggal: ${formattedCreatedAt}`);
          tracking.push('Booking dibuat oleh admin');
        }  else if (
          booking.verified_admin_lab === null &&
          booking.verified_admin_room === null &&
          booking.verified_admin_leader === null &&
          booking.verified_admin_tu === null
        ) {
          tracking.push(`Booking dibuat pada tanggal: ${formattedCreatedAt}`);
          tracking.push('Menunggu verifikasi');
        }
  
        if (booking.verified_admin_lab !== null) {
          tracking.push(`Booking dibuat pada tanggal: ${formattedCreatedAt}`);
          tracking.push(
            booking.verified_admin_lab
              ? 'Booking telah diverifikasi oleh Admin Lab.'
              : 'Booking ditolak oleh Admin Lab dengan alasan: ' + (booking.note || 'Tidak ada catatan.')
          );
        }
  
        if (booking.verified_admin_room !== null) {
          tracking.push(`Booking dibuat pada tanggal: ${formattedCreatedAt}`);
          tracking.push(
            booking.verified_admin_room
              ? 'Booking telah diverifikasi oleh Admin Room.'
              : 'Booking ditolak oleh Admin Room dengan alasan: ' + (booking.note || 'Tidak ada catatan.')
          );
        }
  
        if (booking.verified_admin_leader !== null) {
          tracking.push(
            booking.verified_admin_leader
              ? 'Booking telah diverifikasi oleh Admin Leader.'
              : 'Booking ditolak oleh Admin Leader dengan alasan: ' + (booking.note || 'Tidak ada catatan.')
          );
        }
  
        if (booking.verified_admin_tu !== null) {
          tracking.push(
            booking.verified_admin_tu
              ? 'Booking telah diverifikasi oleh Admin TU.'
              : 'Booking ditolak oleh Admin TU dengan alasan: ' + (booking.note || 'Tidak ada catatan.')
          );
        }

        if (booking.booking_status === 'approved') {
          tracking.push('Booking telah disetujui oleh semua admin dengan status approved.');
        }

        if (booking.booking_status === 'returned' && booking.is_admin === true) {
          tracking.push('Booking telah diselesaikan oleh Admin.');
        }
  
        // Logika untuk Booking Status "returned"
        if (booking.booking_status === 'returned') {
          tracking.push('Booking telah disetujui oleh semua admin dengan status approved.');
          tracking.push('Booking telah diselesaikan oleh peminjam.');
        }
  
        // Logika untuk Booking Status "moved"
        if (booking.booking_status === 'moved') {
          tracking.push('Booking telah disetujui oleh semua admin dengan status approved.');
          tracking.push(`Booking dipindahkan oleh pengelola pada: ${formattedUpdatedAt}`);
        }
  
        return {
          ...booking.toJSON(),
          tracking,
        };
      });
  
      res.json(bookingsWithTracking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan.' });
    }
  },

  getAllTrackingBookingsTool: async (req, res) => {
    try {
      const roleAdm = req.adminData.role;

      if (roleAdm === 'admin_staff') {
        whereCondition = {
          [Sequelize.Op.or]: [
            { '$Tool.type$': 'lab' },  
          ]
        };

      } else if (roleAdm === 'admin_mm') {
        whereCondition = {
          '$Tool.type$': 'multimedia',
        };

      } else if (roleAdm === 'admin_leader' || roleAdm === 'admin_tu') {
        whereCondition = {
          [Sequelize.Op.or]: [
            {'$Tool.type$': 'lab'},
            {'$Tool.type$': 'multimedia'},
          ]
        };
      }
      
      const bookings = await Booking.findAll({
        where: whereCondition,
        include: [Tool]
      });
  
      const bookingsWithTracking = bookings.map((booking) => {
        const tracking = [];

        // Format createdAt dan updatedAt dengan locale Indonesia
        const formattedCreatedAt = format(new Date(booking.createdAt), 'dd MMMM yyyy HH:mm', { locale: id });
        const formattedUpdatedAt = format(new Date(booking.updatedAt), 'dd MMMM yyyy HH:mm', { locale: id });
        
        if (
          booking.verified_admin_lab === null &&
          booking.verified_admin_room === null &&
          booking.verified_admin_leader === null &&
          booking.verified_admin_tu === null
        ) {
          tracking.push(`Booking dibuat pada tanggal: ${formattedCreatedAt}`);
          tracking.push('Menunggu verifikasi');
        }
  
        if (booking.verified_admin_lab !== null) {
          tracking.push(`Booking dibuat pada tanggal: ${formattedCreatedAt}`);
          tracking.push(
            booking.verified_admin_lab
              ? 'Booking telah diverifikasi oleh Admin Lab.'
              : 'Booking ditolak oleh Admin Lab dengan alasan: ' + (booking.note || 'Tidak ada catatan.')
          );
        }
  
        if (booking.verified_admin_room !== null) {
          tracking.push(`Booking dibuat pada tanggal: ${formattedCreatedAt}`);
          tracking.push(
            booking.verified_admin_room
              ? 'Booking telah diverifikasi oleh Admin Room.'
              : 'Booking ditolak oleh Admin Room dengan alasan: ' + (booking.note || 'Tidak ada catatan.')
          );
        }
  
        if (booking.verified_admin_leader !== null) {
          tracking.push(
            booking.verified_admin_leader
              ? 'Booking telah diverifikasi oleh Admin Leader.'
              : 'Booking ditolak oleh Admin Leader dengan alasan: ' + (booking.note || 'Tidak ada catatan.')
          );
        }
  
        if (booking.verified_admin_tu !== null) {
          tracking.push(
            booking.verified_admin_tu
              ? 'Booking telah diverifikasi oleh Admin TU.'
              : 'Booking ditolak oleh Admin TU dengan alasan: ' + (booking.note || 'Tidak ada catatan.')
          );
        }

        if (booking.booking_status === 'approved') {
          tracking.push('Booking telah disetujui oleh semua admin dengan status approved.');
        }
  
        // Logika untuk Booking Status "returned"
        if (booking.booking_status === 'returned') {
          tracking.push('Booking telah disetujui oleh semua admin dengan status approved.');
          tracking.push('Booking telah diselesaikan oleh peminjam.');
        }
  
        // Logika untuk Booking Status "moved"
        if (booking.booking_status === 'moved') {
          tracking.push('Booking telah disetujui oleh semua admin dengan status approved.');
          tracking.push(`Booking dipindahkan oleh pengelola pada: ${formattedUpdatedAt}`);
        }
  
        return {
          ...booking.toJSON(),
          tracking,
        };
      });
  
      res.json(bookingsWithTracking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan.' });
    }
  },

  createBookingRoom: async (req, res) => {
    try {
      const userId = req.userData.id;
      const { 
        room_id,
        peminjam,
        kontak,
        desk_activity,
        dept,
        bookings,
        jenis_pengguna,
        jenis_kegiatan 
      } = req.body; 
      const statusBooking = 'pending';
      const quantity = 1;

      const pengguna = await User.findOne({
        where: {
          id: userId,
        },
        attributes: [ 'email' ]
      })
      
      const createdBookings = []
      // Buat Booking baru di database
      for (const session of bookings) {
        const { booking_date, start_time, end_time } = session;

        const startTime = combineDateTime(booking_date, start_time);
        const endTime = combineDateTime(booking_date, end_time);	
        const now = new Date();

        if (startTime < now) {
          return res.status(400).json({message: 'Tidak dapat memesan pada waktu yang telah lampau'})
        }

        if (startTime >= endTime) {
          return res.status(400).json({ message: 'Waktu mulai harus sebelum waktu selesai.' });
        }

        const conflict = await Booking.findOne({
          where: {
            room_id: room_id,
            [Sequelize.Op.or]: [
              {
                start_time: {[Sequelize.Op.lt]: endTime,},
                end_time: {[Sequelize.Op.gt]: startTime,},
              },
              {
                start_time: {[Sequelize.Op.gte]: startTime, [Sequelize.Op.lt]: endTime},  
              },
              {
                end_time: {[Sequelize.Op.gt]: startTime, [Sequelize.Op.lte]: endTime},
              },
            ],
          },
        });
    
        if (conflict) {
          return res.status(400).json({ message: 'Waktu sudah direservasi, silakan pilih waktu lain.' });
        }
        
        const newBooking = await Booking.create({
          user_id: userId,
          room_id: room_id,
          peminjam: peminjam,
          kontak: kontak,
          desk_activity: desk_activity,
          dept: dept,
          booking_status: statusBooking,
          jenis_pengguna: jenis_pengguna,
          jenis_kegiatan: jenis_kegiatan,
          quantity: quantity,
          booking_date: session.booking_date,
          start_time: session.start_time,
          end_time: session.end_time,
        });
        createdBookings.push(newBooking);
      }

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
          from: email, // Ganti dengan email Anda
          to: pengguna, // Ganti dengan email admin
          subject: 'Notifikasi Booking Baru',
          text: `
            Halo Admin,

            Ada booking baru yang telah dibuat dengan rincian sebagai berikut:

            - Pemesan: ${peminjam}
            - Ruangan: ${room_id}
            - Tanggal: ${moment(bookings.booking_date).format('DD MMM YYYY')}
            - Waktu Mulai: ${bookings.start_time}
            - Waktu Selesai: ${bookings.end_time}
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
            data: createdBookings,
            userID: userId,
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
        }
  },

  createBookingSpecialAdmin: async (req, res) => {
    try {
      const userId = req.adminData.id;
      const { 
        room_id,
        peminjam,
        kontak,
        desk_activity,
        dept,
        bookings,
        jenis_pengguna,
        jenis_kegiatan 
      } = req.body; 
      const statusBooking = 'approved';
      const quantity = 1;
          
      const createdBookings = []
      // Buat Booking baru di database
      for (const session of bookings) {
        const { booking_date, start_time, end_time } = session;

        const startTime = combineDateTime(booking_date, start_time);
        const endTime = combineDateTime(booking_date, end_time);	
        const now = new Date();

        if (startTime < now) {
          return res.status(400).json({message: 'Tidak dapat memesan pada waktu yang telah lampau'})
        }

        if (startTime >= endTime) {
          return res.status(400).json({ message: 'Waktu mulai harus sebelum waktu selesai.' });
        }

        const conflict = await Booking.findOne({
          where: {
            room_id: room_id,
            [Sequelize.Op.or]: [
              {
                start_time: {[Sequelize.Op.lt]: endTime,},
                end_time: {[Sequelize.Op.gt]: startTime,},
              },
              {
                start_time: {[Sequelize.Op.gte]: startTime, [Sequelize.Op.lt]: endTime},  
              },
              {
                end_time: {[Sequelize.Op.gt]: startTime, [Sequelize.Op.lte]: endTime},
              },
            ],
          },
        });
    
        if (conflict) {
          return res.status(400).json({ message: 'Waktu sudah direservasi, silakan pilih waktu lain.' });
        }
        
        const newBooking = await Booking.create({
          user_id: userId,
          room_id: room_id,
          peminjam: peminjam,
          kontak: kontak,
          desk_activity: desk_activity,
          dept: dept,
          booking_status: statusBooking,
          jenis_pengguna: jenis_pengguna,
          jenis_kegiatan: jenis_kegiatan,
          quantity: quantity,
          booking_date: session.booking_date,
          start_time: session.start_time,
          end_time: session.end_time,
          is_admin: true,
        });
        createdBookings.push(newBooking);
      }

      res.status(201).json({
          message: "Booking created successfully by Admin",
          data: createdBookings
      });
      } catch (error) {
      console.error(error);
      res.status(500).json({
          message: "Internal server error",
      });
      }
  },

  createBookingToolSpecialAdmin: async (req, res) => {
    try {
      const userId = req.adminData.id;
      const { 
        tool_id,
        peminjam,
        kontak,
        bookings,
        desk_activity,
        dept,
        quantity,
        jenis_pengguna,
        jenis_kegiatan 
      } = req.body;
      const statusBooking = 'approved';
          
      const createdBookings = []
      // Buat Booking baru di database
      for (const session of bookings) {
        const { booking_date, start_time, end_time } = session;

        const startTime = combineDateTime(booking_date, start_time);
        const endTime = combineDateTime(booking_date, end_time);	
        const now = new Date();

        console.log("waktu mulai:", startTime);
        console.log("waktu selesai:", endTime);

        if (startTime < now) {
          return res.status(400).json({message: 'Tidak dapat memesan pada waktu yang telah lampau'})
        }

        if (startTime >= endTime) {
          return res.status(400).json({ message: 'Waktu mulai harus sebelum waktu selesai.' });
        }

        const conflict = await Booking.findOne({
          where: {
            tool_id: tool_id,
            [Sequelize.Op.or]: [
              {
                start_time: {[Sequelize.Op.lt]: endTime,},
                end_time: {[Sequelize.Op.gt]: startTime,},
              },
              {
                start_time: {[Sequelize.Op.gte]: startTime, [Sequelize.Op.lt]: endTime},  
              },
              {
                end_time: {[Sequelize.Op.gt]: startTime, [Sequelize.Op.lte]: endTime},
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
        console.log("datatool:",quantity);
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

        const newBooking = await Booking.create({
          user_id: userId,
          tool_id: tool_id,
          peminjam: peminjam,
          kontak: kontak,
          booking_date: session.booking_date,
          start_time: session.start_time,
          end_time: session.end_time,
          desk_activity: desk_activity,
          dept: dept,
          jenis_pengguna: jenis_pengguna,
          jenis_kegiatan: jenis_kegiatan,
          booking_status: statusBooking,
          quantity: quantity,
          is_admin: true,
        });
        createdBookings.push(newBooking);
      }

      res.status(201).json({
          message: "Booking created successfully by Admin",
          data: createdBookings
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
        bookings,
        desk_activity,
        dept,
        quantity,
        jenis_pengguna,
        jenis_kegiatan 
      } = req.body; // Ambil data dari body permintaan
      const statusBooking = 'pending';

      const pengguna = await User.findOne({
        where: {
          id: usersId,
        },
        attributes: [ 'email' ]
      })
      
      const createdBookings = [];
      for (const session of bookings){
        const { booking_date, start_time, end_time} = session;
      
        const startTime = new combineDateTime(booking_date, start_time);
        const endTime = new combineDateTime(booking_date, end_time);
        const now = new Date()

        console.log("waktu mulai:", startTime);
        console.log("waktu selesai:", endTime);	

        if (startTime < now) {
          return res.status(400).json({ message: 'Tidak dapat memesan pada waktu yang telah lampau'})
        }

        if (startTime >= endTime) {
          return res.status(400).json({ message: 'Waktu mulai harus sebelum waktu selesai.' });
        }

        const conflict = await Booking.findOne({
          where: {
            tool_id: tool_id,
            [Sequelize.Op.or]: [
              {
                start_time: {[Sequelize.Op.lt]: endTime,},
                end_time: {[Sequelize.Op.gt]: startTime,},
              },
              {
                start_time: {[Sequelize.Op.gte]: startTime, [Sequelize.Op.lt]: endTime},  
              },
              {
                end_time: {[Sequelize.Op.gt]: startTime, [Sequelize.Op.lte]: endTime},
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
            booking_date: session.booking_date,
            start_time: session.start_time,
            end_time: session.end_time,
            desk_activity: desk_activity,
            dept: dept,
            jenis_pengguna: jenis_pengguna,
            jenis_kegiatan: jenis_kegiatan,
            booking_status: statusBooking,
            quantity: quantity,
        });
        createdBookings.push(newBooking);
      }
        
            

            // Kirim notifikasi email setelah booking berhasil dibuat
            const userMailOptions = {
             from: email, // Ganti dengan email Anda
             to: pengguna, // Email peminjam yang dikirim melalui req.body
            subject: 'Booking Alat Berhasil',
             text: `
              Halo ${peminjam},

               Booking Anda telah berhasil dibuat dengan rincian sebagai berikut:

               - Alat: ${tool_id}
               - Jumlah alat yang dipinjam ${bookings.quantity}
               - Tanggal: ${moment(bookings.booking_date).format('DD MMM YYYY')}
               - Waktu Mulai: ${bookings.start_time}
               - Waktu Selesai: ${bookings.end_time}
               - Aktivitas: ${desk_activity}
               - Status: ${statusBooking}

               Terima kasih telah menggunakan layanan kami.

                Salam,
                Admin
              `,
            };

            // Kirim email untuk admin
            const adminMailOptions = {
              from: email, // Ganti dengan email Anda
              to: 'spenseev9@gmail.com', // Ganti dengan email admin
              subject: 'Notifikasi Booking Baru',
              text: `
                Halo Admin,

                Ada booking baru yang telah dibuat dengan rincian sebagai berikut:

                - Pemesan: ${peminjam}
                - Alat: ${tool_id}
                - Tanggal: ${moment(bookings.booking_date).format('DD MMM YYYY')}
                - Waktu Mulai: ${bookings.start_time}
                - Waktu Selesai: ${bookings.end_time}
                - Aktivitas: ${desk_activity}
                - Status: ${statusBooking}

                Mohon untuk memeriksa detail booking ini di sistem.

                Terima kasih.
              `,
            };

            try {
              await req.transporter.sendMail(userMailOptions);
              await req.transporter.sendMail(adminMailOptions);
              console.log('Email sent successfully');
            } catch (error) {
              console.error('Error sending email:', error);
            }
        
            res.status(201).json({
                message: "Booking created successfully",
                data: createdBookings,
            });
            } catch (error) {
            console.error(error);
            res.status(500).json({
                message: `Internal server error ${error.message}`,
            });
            }
  },

  findAllBookingWithApproved: async (req, res) => {
    try {
      const result = await Booking.findAll({ 
        where: { 
          booking_status: "approved", 
        }
      });
      res.status(200).json({ data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error: error.message  });
    }
  },

  findAlternativeRooms: async (req, res) => {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id);
      
      const booking_date = booking.booking_date.toISOString();
      const start_time = booking.start_time;
      const end_time = booking.end_time;
      
      console.log("tanggal:", booking_date);
      console.log("waktu mulai:", start_time);
      console.log("waktu selesai:", end_time);

      const availableRoooms = await Room.findAll({
        where: {
          room_id: {
            [Sequelize.Op.notIn]: Sequelize.literal(`(
              SELECT room_id FROM "Bookings"
              WHERE room_id IS NOT NULL
              AND booking_date = '${booking_date}'
              AND (
                (start_time < '${end_time}')
                AND (end_time > '${start_time}')
              )
              )`),
          },
        },
        attributes:['room_id', 'name_room']
      });

      if (availableRoooms.length === 0) {
        return res.status(404).json({ message: "Tidak ada ruangan alternatif yang tersedia."});
      }
      console.log("apa isi rooms:", availableRoooms.length)
      res.status(200).json({ rooms: availableRoooms});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error: error.message  })
    }
  },

  moveReservation: async (req, res) => {
    try {
      const { id } = req.params;
      const { newRoomId, note} = req.body;

      // Validasi input
      if (!newRoomId || !note) {
        return res.status(400).json({ message: "New room ID and note are required" });
      }

      const booking = await Booking.findByPk(id);
      if(!booking) {
        return res.status(404).json({message: "Booking not found"});
      }

      const previousRoomId = booking.room_id; // room_id sebelum dipindahkan
      const updatedNote = `Reservasi dipindahkan ke ruangan ${newRoomId} dari sebelumnya ruangan ${previousRoomId}. Catatan tambahan: ${note}`;

      booking.room_id = newRoomId;
      booking.booking_status = 'moved';
      booking.note = updatedNote;
      await booking.save();

      res.status(200).json({
        message: "Reservation moved successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Internal Server Error"})
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

      const book = await Booking.findByPk(id)

      if(book.tool_id) {
        const tool = await Tool.findOne({
          where: { tool_id: book.tool_id}
        });
        if (!tool) {
          return res.status(404).json({ message: "Tool not found"});
        }
  
        const updatedJumlah = tool.jumlah + book.quantity;
        await Tool.update(
          { jumlah: updatedJumlah},
          {where: {tool_id: book.tool_id}}
        );
      }

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