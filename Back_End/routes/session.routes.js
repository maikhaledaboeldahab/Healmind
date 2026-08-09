const express = require("express");
const router = express.Router();
const { protect, restrictTo, requireApprovedDoctor } = require("../middleware/authMiddleware");

const {
    submitVisitReport,
    getMySessions,
    getSessionDetails,
    updateSessionStatus,
    getAllSessions,
    rescheduleSession
} = require("../controllers/session.controller");


router.get('/getallsessions', protect, restrictTo("admin"), getAllSessions);
router.get('/getmysessions', protect, restrictTo("doctor", "patient"), getMySessions);  //tested 
router.get('/getsessiondetails/:sessionid', protect, restrictTo("doctor", "patient"), getSessionDetails); //tested
router.patch('/updatesessionstatus/:id', protect, restrictTo("doctor"), updateSessionStatus); //tested
router.patch('/submitvisitreport/:id', protect, restrictTo("doctor"), submitVisitReport);    //tested
router.patch('/reschedule/:id', protect, restrictTo("patient,doctor"), rescheduleSession); //tested

module.exports = router;