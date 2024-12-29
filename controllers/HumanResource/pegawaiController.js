const { Pegawai } = require("../../models")

module.exports = {
    findAllPegawai: async (req, res) => {
        try {
          const result = await Pegawai.findAll();

          if (result.length === 0) {
            return res.status(204).json({
                message: "No Pegawai found"
            });
          }
          res.status(200).json({
            message: "Get All Data",
            data: result,
          });

        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
    },

    findPegawaibyId: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await Pegawai.findOne({
                where: { 
                    id: id 
                },
            });

            if (!result) {
                return res.status(404).json({ 
                    message: `Pegawai with id ${id} not found`,
                 });
            }

            res.status(200).json({
                message: `Success get Pegawai with id ${id}`,
                data: result,
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Interal Server Error",
            })
        }
    },

    createPegawai: async (req, res) => {
        try {
            const {
                name,
                NIP,
                agama,
                gender,
                umur,
            } = req.body;

            const newPegawai = await Pegawai.create({
                name: name,
                NIP: NIP,
                agama: agama,
                gender: gender,
                umur: umur,
            });
            res.status(201).json({
                message: "Pegawai baru berhasil ditambahkan",
                data: newPegawai,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "internal server error",
            });
        }
    },

    editIdentitas: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                nama,
                NIP,
                KPE,
                NIDN,
                agama,
                gender,
                nokarpeg,
                lahir,
                ttl,
                umur,
                jabatan,
                TMT_jb,
                KUM_jb,
                satyalancana,
                gol_pns,
                TMT_pns,
                gol_pk,
                TMT_pk,
                pendidikan,
                pensiun,
            } = req.body;

            const result = await Pegawai.findOne({
                where: {
                  id: id,
                },
            });

            if (!result) {
                return res.status(404).json({
                  message: `Pegawai with id ${id} not found.`,
                });
            }

            const editIdentitas = await Pegawai.update({
                nama: nama,
                NIP: NIP,
                KPE: KPE,
                NIDN: NIDN,
                agama: agama,
                gender: gender,
                nokarpeg: nokarpeg,
                lahir: lahir,
                ttl: ttl,
                umur: umur,
                jabatan: jabatan,
                TMT_jb: TMT_jb,
                KUM_jb: KUM_jb,
                satyalancana: satyalancana,
                gol_pns: gol_pns,
                TMT_pns: TMT_pns,
                gol_pk: gol_pk,
                TMT_pk: TMT_pk,
                pendidikan: pendidikan,
                pensiun: pensiun,
            },
            {
                where: {
                  id: id,
                },
            });
            res.status(200).json({
                message: `Success Add Jabatan with id ${id}`,
                data: editIdentitas,
              });
        } catch (error) {
            res.status(500).json({
                message: "Internal server error: " + error.message
            })
        }
    },

    editJabatan: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                jabatan,
                TMT_jb,
                KUM_jb,
                satyalancana,
            } = req.body;

            const result = await Pegawai.findOne({
                where: {
                  id: id,
                },
            });

            if (!result) {
                return res.status(404).json({
                  message: `Pegawai with id ${id} not found.`,
                });
            }

            const addJabatan = await Pegawai.update(
                {
                    jabatan: jabatan,
                    TMT_jb: TMT_jb,
                    KUM_jb: KUM_jb,
                    satyalancana: satyalancana,         
                },
                {
                  where: {
                    id: id,
                  },
                }
              );
              res.status(200).json({
                message: `Success Add Jabatan with id ${id}`,
                data: addJabatan,
              });

        } catch (error) {
            res.status(500).json({
                message: "Internal server error: " + error.message
            })
        }
    },

    editPNS: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                gol_pns,
                TMT_pns,
            } = req.body;

            const result = await Pegawai.findOne({
                where: {
                  id: id,
                },
            });

            if (!result) {
                return res.status(404).json({
                  message: `Pegawai with id ${id} not found.`,
                });
            }

            const addPNS = await Pegawai.update({
                gol_pns: gol_pns,
                TMT_pns: TMT_pns,
            },
            {
                where: {
                  id: id,
                },
            });
            res.status(201).json({
                message: `Success Add PNS with id ${id}`,
                data: addPNS,
              });
        } catch (error) {
            res.status(500).json({
                message: "Internal server error: " + error.message
            })
        }
    },

    editPangkat: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                gol_pk,
                TMT_pk,
                pendidikan,
                pensiun,
            } = req.body;

            const result = await Pegawai.findOne({
                where: {
                  id: id,
                },
            });

            if (!result) {
                return res.status(404).json({
                  message: `Pegawai with id ${id} not found.`,
                });
            }

            const addPangkat = await Pegawai.update({
                gol_pk: gol_pk,
                TMT_pk: TMT_pk,
                pendidikan: pendidikan,
                pensiun: pensiun,
            },
            {
                where: {
                  id: id,
                },
            });
            res.status(201).json({
                message: `Success Add Pangkat with id ${id}`,
                data: addPangkat,
              });
        } catch (error) {
            res.status(500).json({
                message: "Internal server error: " + error.message
            })
        }
    },

    deletePegawai: async (req, res) => {
        try {
            const { id } = req.params;
            const deletePegawai = await Pegawai.destroy({
                where: {id: id},
            })
            if (deletePegawai > 0) {
                return res.status(200).json({ message: `Pegawai with id ${id} deleted!` });
              } else {
                return res.status(404).json({ message: `Pegawai with id ${id} not found.` });
              }
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error,
              });
        }
    }
}