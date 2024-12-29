const { IncomingLetter } = require('../../models');
const path = require("path");
const fs = require("fs");

module.exports = {
    getAllIncomingLetter: async (req, res) => {
        try {
            const result = await IncomingLetter.findAll();

            if (result.length === 0) {
                return res.status(204).json({
                    message: "No IncomingLetter found",
                })
            }

            res.status(200).json({
                message: 'Successfully get all incoming letters',
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    },

    getIncomingLetterById: async (req, res) => {
        try {
            const { id } = req.params;
            const letter = await IncomingLetter.findOne({
                where: { id: id },
            });

            if(!letter){
                return res.status(404).json({
                    message: `IncomingLetter with id ${id} not found`,
                });
            }

            res.status(200).json({
                message: `Successfully get incoming letter with id ${id}`,
                data: letter
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message:'Internal Server Error',
            }); 
        }
    },

    createIncomingLetter: async (req, res) => {
        try {
            const {
                typeOfLetter,
                numberOfLetter,
                dateOfLetter,
                dateReceived,
                sender,
                receiver,
                subject,
                summary,
                priority,
                status,
                DispositionId,
            } = req.body;
            const attachments = req.file.path

            const result = await IncomingLetter.create({
                typeOfLetter: typeOfLetter,
                numberOfLetter: numberOfLetter,
                dateOfLetter: dateOfLetter,
                dateReceived: dateReceived,
                sender: sender,
                receiver: receiver,
                subject: subject,
                summary: summary,
                priority: priority,
                status: status,
                DispositionId: DispositionId,
                attachments: attachments,
            });

            res.status(200).json({
                message: 'Incoming Letter created successfully',
                data: result
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },

    updateIncomingLetter: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                typeOfLetter,
                numberOfLetter,
                dateOfLetter,
                dateReceived,
                sender,
                receiver,
                subject,
                summary,
                priority,
                status,
                DispositionId
            } = req.body;
            
            const letter = await IncomingLetter.findOne({
                where: { id: id },
            });

            if(!letter){
                return res.status(404).json({
                    message: 'IncomingLetter not found',
                });
            }

            let newAttachments;
            if(req.files) {
                newAttachments = req.files;

                if(letter.attachments) {
                    const previousAttachment = path.join('public/letter/incoming', letter.attachments);
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

            const result = await IncomingLetter.update({
                typeOfLetter: typeOfLetter,
                numberOfLetter: numberOfLetter,
                dateOfLetter: dateOfLetter,
                dateReceived: dateReceived,
                sender: sender,
                receiver: receiver,
                subject: subject,
                summary: summary,
                priority: priority,
                status: status,
                DispositionId: DispositionId,
                attachments: newAttachments
            }, {
                where: { id : id }
            });

            res.status(200).json({
                message: 'Incoming Letter updated successfully',
                data: result
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to update Incoming Letter',
                error: error.message
            });
        }
    },

    deleteIncomingLetter: async (req, res) => {
        try {
            const { id } = req.params;

            const letter = await IncomingLetter.findOne({
                where: { id: id },
            });

            if (letter) {
                const path = letter.attachments;
                try {
                    await fs.promises.unlink(path);
                    await IncomingLetter.destroy({
                        where: { id: id },
                    })
                    res.status(200).json({
                        message: `Incoming Letter with id ${id} deleted successfully`
                    });
                } catch (error) {
                    return res.status(500).json({
                        message: `Error deleting file` 
                    });
                }
            } else {
                return res.status(404).json({
                    message: `Incoming Letter with id ${id} not found` 
                });
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