const supabase = require("../config/supabase");


// ================= ADD STUDENT =================

const addStudent = async (req, res) => {

    try {

        const {
            name,
            mobile,
            email,
            dob
        } = req.body;


        // Check required fields

        if (!name || !mobile || !dob) {

            return res.status(400).json({
                success: false,
                message: "Name, mobile aur DOB required hain."
            });

        }


        // Check mobile number

        if (!/^[6-9]\d{9}$/.test(mobile)) {

            return res.status(400).json({
                success: false,
                message: "Valid 10 digit Indian mobile number enter karo."
            });

        }
        if (!email) {
    return res.status(400).json({
        success: false,
        message: "Email required hai."
    });
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
        success: false,
        message: "Valid email enter karo."
    });
}

        // Insert student into Supabase

     const { data, error } = await supabase
    .from("students")
    .insert([
        {
            name: name.trim(),
            mobile: mobile,
            email: email.trim(),
            dob: dob
        }
    ])
    .select()
    .single();

        // Supabase error

        if (error) {
            throw error;
        }


        // Success response

        res.status(201).json({
            success: true,
            message: "Student successfully add ho gaya!",
            student: data
        });


    } catch (error) {

        console.error("Add Student Error:", error);

        res.status(500).json({
            success: false,
            message: "Student add nahi ho paaya.",
            error: error.message
        });

    }

};


// ================= UPDATE STUDENT =================

const updateStudent = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            mobile,
            dob,
            email,
            whatsapp_opt_in
        } = req.body;


        // Check mobile number if provided

        if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {

            return res.status(400).json({
                success: false,
                message: "Valid 10 digit Indian mobile number enter karo."
            });

        }

        if (!email) {
    return res.status(400).json({
        success: false,
        message: "Email required hai."
    });
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
        success: false,
        message: "Valid email enter karo."
    });
}
        // Prepare update data

        const updateData = {};

        if (name !== undefined) {
            updateData.name = name.trim();
        }

        if (mobile !== undefined) {
            updateData.mobile = mobile;
        }

        if (dob !== undefined) {
            updateData.dob = dob;
        }

        if (whatsapp_opt_in !== undefined) {
            updateData.whatsapp_opt_in =
                Boolean(whatsapp_opt_in);
        }


        // Update student in Supabase

        const { data, error } = await supabase
            .from("students")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();


        // Supabase error

        if (error) {
            throw error;
        }


        // Success response

        res.status(200).json({
            success: true,
            message: "Student successfully update ho gaya!",
            student: data
        });


    } catch (error) {

        console.error("Update Student Error:", error);

        res.status(500).json({
            success: false,
            message: "Student update nahi ho paaya.",
            error: error.message
        });

    }

};


// ================= DELETE STUDENT =================

const deleteStudent = async (req, res) => {

    try {

        const { id } = req.params;


        // Delete student from Supabase

        const { data, error } = await supabase
            .from("students")
            .delete()
            .eq("id", id)
            .select()
            .single();


        // Supabase error

        if (error) {
            throw error;
        }


        // Success response

        res.status(200).json({
            success: true,
            message: "Student successfully delete ho gaya!",
            student: data
        });


    } catch (error) {

        console.error("Delete Student Error:", error);

        res.status(500).json({
            success: false,
            message: "Student delete nahi ho paaya.",
            error: error.message
        });

    }

};


// ================= TODAY'S BIRTHDAYS =================

const getTodaysBirthdays = async (req, res) => {

    try {

        const today = new Date();

        const month =
            String(today.getMonth() + 1).padStart(2, "0");

        const day =
            String(today.getDate()).padStart(2, "0");


        const { data, error } = await supabase
            .from("students")
            .select("*");


        if (error) {
            throw error;
        }


        const birthdays = data.filter(student => {

            if (!student.dob) {
                return false;
            }


            const dob = String(student.dob);

            const [, dobMonth, dobDay] =
                dob.split("-");


            return (
                dobMonth === month &&
                dobDay === day
            );

        });


        res.json({
            success: true,
            date: `${month}-${day}`,
            birthday_students: birthdays
        });


    } catch (error) {

        console.error(
            "Birthday Check Error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Birthday check failed.",
            error: error.message
        });

    }

};
// ================= TEST BIRTHDAY EMAIL =================

const testBirthdayEmail = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: student, error } = await supabase
            .from("students")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Student nahi mila",
                error: error.message
            });
        }

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student nahi mila"
            });
        }

        if (!student.email) {
            return res.status(400).json({
                success: false,
                message: "Is student ka email database me nahi hai"
            });
        }

        res.json({
            success: true,
            message: "Student mil gaya",
            student: student
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Test birthday email failed",
            error: error.message
        });
    }
};
// ================= EXPORT =================

module.exports = {
    addStudent,
    updateStudent,
    deleteStudent,
    getTodaysBirthdays,
    testBirthdayEmail
};