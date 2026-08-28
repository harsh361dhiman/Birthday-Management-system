const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();


const {
    addStudent,
    updateStudent,
    deleteStudent,
    getTodaysBirthdays,
    testBirthdayEmail
} = require("../controllers/studentController");


// ================= ADD STUDENT =================

router.post("/", addStudent);
router.put("/:id", updateStudent);
router.get("/birthdays/today", getTodaysBirthdays);
router.get("/test-birthday-email/:id", testBirthdayEmail);
// ================= DELETE STUDENT =================

router.delete("/:id", deleteStudent);

// ================= GET ALL STUDENTS =================

router.get("/", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("students")
            .select("*")
            .order("id", { ascending: false });


        if (error) {

            console.log("Get Students Error:", error);

            return res.status(500).json({
                success: false,
                message: "Students fetch nahi ho paaye",
                error: error.message
            });

        }


        res.json({
            success: true,
            students: data
        });


    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// ================= UPDATE STUDENT =================

// PUT /students/:id

router.put("/:id", updateStudent);


// ================= EXPORT =================

module.exports = router;
