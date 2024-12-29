const express = require("express");
const router = express.Router();
const pegawaiController = require("../controllers/HumanResource/pegawaiController")

router.get('/all', pegawaiController.findAllPegawai),
router.get(`/:id`, pegawaiController.findPegawaibyId),
router.post('/baru', pegawaiController.createPegawai),
router.patch(`/idn/:id`, pegawaiController.editIdentitas)
router.patch(`/jb/:id`, pegawaiController.editJabatan),
router.patch(`/pns/:id`, pegawaiController.editPNS),
router.patch(`/pk/:id`, pegawaiController.editPangkat),
router.delete(`/:id`, pegawaiController.deletePegawai),


module.exports = router;