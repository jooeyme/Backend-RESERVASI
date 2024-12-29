const { Tool } = require("../../models");
const path = require("path");
const fs = require("fs");

module.exports = {
  findAllTool: async (req, res) => {
    try {
      if (!Tool || !Tool.findAll) {
        throw new Error("Tools not found");
      }
      const result = await Tool.findAll();
      res.status(200).json({
        message: "Get All Data",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  showToolById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Tool.findOne({
        where: {
          id: id,
        },
      });

      if (!Tool) {
        return res.status(404).json({
          message: `Tool with id ${id} not found.`,
        });
      }

      res.status(200).json({
        message: `Success get Tool with id ${id}`,
        data: result,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server Error" });
    }
  },

  editTool: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
            tool_id,
            name_tool,
            alamat_tool,
            kondisi,
            jumlah,
            deskripsi,
          } = req.body;

      const result = await Tool.findOne({
        where: {
          id: id,
        },
      });

      if (!result) {
        return res.status(404).json({
          message: `Tool with id ${id} not found.`,
        });
      }

      let newGambarTool;
      if (req.file) { // Image upload detected
        newGambarTool = req.file.filename;

        // Delete previous image (if applicable)
        if (result.gambar_tool) {
          const previousImagePath = path.join('public/images/', result.gambar_tool); // Adjust path as needed
          try {
            await fs.promises.unlink(previousImagePath); // Use fs.promises for async/await
            console.log(`Previous image ${result.gambar_tool} deleted.`);
          } catch (error) {
            console.error(`Error deleting previous image: ${error}`);
            // Consider returning an appropriate error response if deletion is critical
          }
        }
      } else { // No image upload, keep existing image
        newGambarTool = result.gambar_tool;
      }

      const updateTool = await Tool.update(
        {
            tool_id: tool_id,
            name_tool: name_tool,
            alamat_tool: alamat_tool,
            kondisi: kondisi,
            jumlah: jumlah,
            deskripsi: deskripsi,
            gambar_tool: newGambarTool, 
        },
        {
          where: {
            id: id,
          },
        }
      );

      res.status(200).json({
        message: `Success update Tool with id ${id}`,
        data: updateTool,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server Error" });
    }
  },

  createTool: async (req, res) => {
    try {
        const { 
            tool_id,
            name_tool,
            alamat_tool,
            kondisi,
            jumlah,
            deskripsi } = req.body;
        
        const gambar_tool = req.file.filename; 

      // Buat job baru di database
      const newTool = await Tool.create({
        tool_id: tool_id,
        name_tool: name_tool,
        alamat_tool: alamat_tool,
        kondisi: kondisi,
        jumlah: jumlah,
        deskripsi: deskripsi,
        gambar_tool: gambar_tool, 
      });

      res.status(201).json({
        message: "Tool created successfully",
        data: newTool,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

 
  deleteTool: async (req, res) => {
    try {
      const { id } = req.params;
      const tool = await Tool.findOne({
        where: { id: id },
      });

      if (tool) {
        const path = path.join('public/images/', tool.gambar_tool);
        try {
          await fs.promises.unlink(path);
          await Tool.destroy({
            where: { id: id },
          });
          res.status(200).json({
            message: `Tool with id ${id} was successfully deleted`
          });
        } catch (error) {
          console.error("Error deleting image",error.message);
          return res.status(500).json({
            message: 'Error deleting image',
            error: error.message
          })
        }
      } else {
        return res.status(404).json({ 
          message: `Tool with id ${id} not found.` 
        });
      }

    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  },
};