const { TemplateSurat } = require('../models');
const fs = require('fs');

exports.uploadFileKolo = async (req, res) => {


    try {
        const fileName = 'kolokium.pdf';
        const filePath = `templates/pengajuan/${fileName}`;

        const newFile = await TemplateSurat.create({
            
            nama: fileName,
            path: filePath
        });

        res.json(newFile);
    } catch (error) {
        res.status(500).send(error);
    }
};


exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await TemplateSurat.findOne({
            where: { id: id },
          }); 
          if (!result) {
            return res.status(404).json({ message: `Letter with id ${id} not found.` });
          } 

          const filePath = result.path;

        // Remove the letter from the database
        const delFile = await TemplateSurat.destroy({
            where: { id: id },
        });

        if (delFile > 0) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(200).json({ message: `Letter with id ${id} deleted!` });
        } else {
            return res.status(404).json({ message: `Letter with id ${id} not found.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

