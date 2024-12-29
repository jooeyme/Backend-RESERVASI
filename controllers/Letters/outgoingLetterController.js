const { OutgoingLetter } = require('../../models')
const path = require("path");
const fs = require("fs");

module.exports = {
    getAllOutgoingLetter: async (req, res) => {
        try {
            const result = await OutgoingLetter.findAll();

            if (result.length === 0) {
                return res.status(204).json({
                    message: 'No OutgoingLetter found',
                })
            }
            res.status(200).json({
                message: 'get all OutgoingLetter successfully',
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },

    getOutgoingLetterById: async (req, res) => {
        try {
            const { id } = req.params;

            const result = await OutgoingLetter.findOne({
                where: { id: id },
            })

            if (!result) {
                return res.status(404).json({
                    message: 'Outgoing Letter Not Found'
                })
            }

            res.status(200).json({
                message: `get Outgoing Letter with id ${id} Successfully`,
                data: result
            })

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },

    createOutgoingLetter: async (req, res) => {
        try {
            const {
                typeOfLetter,
                numberOfLetter,
                dateOfLetter,
                dateSend,
                addressee,
                subject,
                summary,
                priority,
                status,
            } = req.body;
            const attachments = req.file.path;

            const result = await OutgoingLetter.create({
                typeOfLetter: typeOfLetter,
                numberOfLetter: numberOfLetter,
                dateOfLetter: dateOfLetter,
                dateSend: dateSend,
                addressee: addressee,
                subject: subject,
                summary: summary,
                priority: priority,
                status: status,
                attachments: attachments
            });

            res.status(200).json({
                message: 'created Outgoing letter successfully',
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },

    updateOutgoingLetter: async (req, res) => {
        try {
            const { id } = req.params
            const {
                typeOfLetter,
                numberOfLetter,
                dateOfLetter,
                dateSend,
                addressee,
                subject,
                summary,
                priority,
                status
            } = req.body;

            const letter = await OutgoingLetter.findOne({
                where: { id: id },
            });

            if(!letter) {
                return res.status(404).json({
                    message: `OutgoingLetter with id ${id} not found`
                })
            }

            let newAttachments;
            if(req.files) {
                newAttachments = req.files;

                if(letter.attachments) {
                    const previousAttachment = path.join('public/letter/outgoing', letter.attachments);
                    try {
                        await fs.promise.unlink(previousAttachment);
                        console.log(`Previous file: ${letter.attachments} deleted`);
                    } catch (error) {
                        console.log(`Error deleting previous file: ${error}`);
                    }
                }
            } else {
                newAttachments = letter.attachments;
            }

            const result = await OutgoingLetter.update({
                typeOfLetter: typeOfLetter,
                numberOfLetter: numberOfLetter,
                dateOfLetter: dateOfLetter,
                dateSend: dateSend,
                addressee: addressee,
                subject: subject,
                summary: summary,
                priority: priority,
                status: status,
                attachments: newAttachments
            });

            res.status(200).json({
                message: `Outgoing letter with id ${id} successfully updated`,
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },

    deleteOutgoingLetter: async (req, res) => {
        try {
            const { id } = req.params;

            const letter = await OutgoingLetter.findOne({
                where: { id: id },
            });

            if (letter) {
                const path = letter.attachments;
                try {
                    await fs.promises.unlink(path);
                    await OutgoingLetter.destroy({
                        where: { id: id },
                    });
                    res.status(200).json({
                        message: `OutgoingLetter with id ${id} deleted successfully`
                    });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({
                        message: `error deleting file`
                    })
                }  
            } else {
                return res.status(404).json({
                    message: `OutgoingLetter with id ${id} not found`
            })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    }
}