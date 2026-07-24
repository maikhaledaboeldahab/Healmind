const doctorService = require("../services/doctor.service");

const approveDoctor = async (req,res)=>{
    try{

        const doctor = await doctorService.approveDoctor(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success:true,
            message:"Doctor approved successfully.",
            data:doctor,
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }
}
/*
admin.controller.js
│      approveDoctor
│      rejectDoctor
│      getPendingDoctors
│      getApprovedDoctors
│      getAllDoctors
│      getDoctorById
│      activateUser
│      deactivateUser
*/
