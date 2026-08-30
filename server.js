const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const supabase = require("./config/supabase");
const studentRoutes = require("./routes/studentRoutes");
const { sendBirthdayEmail } = require("./services/emailService");

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());


// ================= HOME ROUTE =================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Birthday Wishes API is running!"
    });

});


// ================= STUDENT ROUTES =================

app.use("/api/students", studentRoutes);

// ================= TEST BIRTHDAY EMAIL =================

app.post("/api/test-birthday-email/:id", async (req, res) => {

    try {

        const { id } = req.params;

        // Student find karo
        const { data: student, error } = await supabase
            .from("students")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !student) {

            return res.status(404).json({
                success: false,
                message: "Student nahi mila.",
                error: error?.message
            });

        }

        // Email check
        if (!student.email) {

            return res.status(400).json({
                success: false,
                message: "Is student ka email saved nahi hai."
            });

        }

        // Email send
        const emailSent = await sendBirthdayEmail(student);

        if (!emailSent) {

            return res.status(500).json({
                success: false,
                message: "Email send nahi ho payi."
            });

        }

        res.json({
            success: true,
            message: `Birthday email successfully ${student.email} par bhej di gayi!`
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Test email failed.",
            error: error.message
        });

    }

});

// ================= DATABASE TEST =================

app.get("/api/test-db", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("students")
            .select("*")
            .limit(5);

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            message: "Supabase connected successfully!",
            students: data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed.",
            error: error.message
        });

    }

});


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});


// ================= AUTOMATIC BIRTHDAY EMAIL =================

cron.schedule("0 9 * * *", async () => {

    try {

        const today = new Date();

        const month =
            String(today.getMonth() + 1).padStart(2, "0");

        const day =
            String(today.getDate()).padStart(2, "0");

        const todayDate =
            `${today.getFullYear()}-${month}-${day}`;


        console.log(
            `🎂 Birthday check started: ${todayDate}`
        );


        // ================= GET STUDENTS =================

        const { data: students, error } = await supabase
            .from("students")
            .select("*");

        if (error) {
            throw error;
        }


        // ================= FIND TODAY'S BIRTHDAYS =================

        const birthdays = students.filter(student => {

            if (!student.dob) {
                return false;
            }

            const [, dobMonth, dobDay] =
                String(student.dob).split("-");

            return (
                dobMonth === month &&
                dobDay === day
            );

        });


        if (birthdays.length === 0) {

            console.log("🎂 No birthdays today.");

            return;
        }


        // ================= SEND EMAIL =================

        for (const student of birthdays) {

            console.log(
                `🎉 Birthday found: ${student.name}`
            );


            // Email available hai ya nahi
            if (!student.email) {

                console.log(
                    `⚠️ ${student.name} ka email nahi hai.`
                );

                continue;
            }


            // ================= DUPLICATE CHECK =================

            if (student.last_wish_sent === todayDate) {

                console.log(
                    `⏭️ Email already sent today to ${student.email}`
                );

                continue;
            }


            // ================= SEND EMAIL =================

            const emailSent =
                await sendBirthdayEmail(student);


            if (!emailSent) {

                console.log(
                    `❌ Email failed: ${student.email}`
                );

                continue;
            }


            // ================= UPDATE LAST WISH =================

            const { error: updateError } = await supabase
                .from("students")
                .update({
                    last_wish_sent: todayDate
                })
                .eq("id", student.id);


            if (updateError) {

                console.error(
                    `⚠️ Email sent but last_wish_sent update failed for ${student.name}:`,
                    updateError.message
                );

            } else {

                console.log(
                    `✅ Birthday email sent successfully to ${student.email}`
                );

            }

        }

    } catch (error) {

        console.error(
            "❌ Automatic Birthday Email Error:",
            error.message
        );

    }

}, {
    timezone: "Asia/Kolkata"
});
