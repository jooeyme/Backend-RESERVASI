const { Document, Pegawai } = require('../../models');
const path = require("path");
const fs = require("fs");
const { create } = require('domain');

module.exports = {
    //GET Ambil Semua Dokumen
    getAllDocuments: async (req, res) => {
        try {
            const result = await Document.findAll();

            
            res.status(200).json({
                message: "Get All Documents",
                data: result,
              });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                message: "Internal server error", 
                error: error.message
            });
        }
    },

    getDocumentsByEmployeeId: async (req, res) => {
        try {
            const { nip } = req.params;
            const result = await Document.findAll({
                where: {
                    employee_id: nip
                },
                include: [Pegawai]
            });
            
            if(!result) {
                return res.status(404).json({
                    message: `Document with employee id ${nip} not found`,
                })
            };

            res.status(200).json({
                message: `Success get Document with employee id ${nip}`,
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "internal server error",
                error: error.message
            });
        }
    },

    createDocument: async (req, res) => {
        try {
            const { 
                employee_id, 
                document_type } = req.body;
            const file_path = req.file.filename;

            const document_name = req.file.originalname

            const result = await Document.create({
                employee_id: employee_id,
                document_name: document_name,
                document_type: document_type,
                file_path: `/documents/${file_path}`
            })

            res.status(200).json({
                message: 'Document created successfully',
                data: result
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error creating document', 
                error: error.message
            });
        }
    },

    updateDocument: async (req, res) => {
        try {
            const { id } = req.params;
            const { document_type } = req.body;
            const document_name = req.file.originalname;

            const result = await Document.findOne({
                where: {
                    id: id,
                }
            });

            if(!result){
                return res.status(404).json({
                    message: 'Document not found'
                });
            }

            let newPath_file;
            if (req.file) {
                newPath_file = req.file.path;

                if (result.file_path) {
                    const previousPath = path.join('public/documents/', result.file_path);
                    try {
                        await fs.promise.unlink(previousPath);
                        console.log(`Previous file: ${result.file_path} deleted`);
                    } catch (error) {
                        console.log(`Error deleting previous file: ${error}`);
                    }
                } 
            } else {
                newPath_file = result.file_path;
            }

            const updateDocument = await Document.update({
                document_name: document_name,
                document_type: document_type,
                file_path: newPath_file
            },
            {
                where: { id: id},
            }
        );
        res.status(200).json({
            message: `Successfully updated document with id ${id}`,
            data: updateDocument,
        })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error', 
                error: error.message
            });
        }
    },

    deleteDocument: async (req, res) => {
        try {
            const { id } = req.params;

            const document = await Document.findOne({
                where: { id: id },
            });

            if(document) {
                const docPath = path.join('public/',document.file_path)
                try {
                    await fs.promises.unlink(docPath);
                    await Document.destroy({
                        where: { id: id },
                    })
                    res.status(200).json({
                        message: `Document with id ${id} deleted successfully`
                    });
                } catch (error) {
                    console.error("Error deleting file:", error.message);
                    return res.status(500).json({
                        message: "Error deleting file",
                        error: error.message,
                    });
                }
            } else {
                return res.status(404).json({
                    message: `Document with id ${id} not found` 
                });
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error', 
                error: error.message
            });	
            
        }
    }

}
