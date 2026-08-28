const supabase = require("../config/supabase");
const { sendBirthdayEmail } = require("./emailService");

const checkBirthdays = async () => {

    try {

        const today = new Date();

        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        console.log(`Checking birthdays for: ${month}-${day}`);

        const { data: students, error } = await supabase
            .from("students")
            .select("*")
            .not("email", "is", null);

        if (error) {
            console.error("Students fetch error:", error.message);
            return;
        }

        for (const student of students) {

            if (!student.dob || !student.email) {
                continue;
            }

            const dob = new Date(student.dob);

            const dobMonth = String(dob.getUTCMonth() + 1).padStart(2, "0");
            const dobDay = String(dob.getUTCDate()).padStart(2, "0");

            if (
                dobMonth === month &&
                dobDay === day
            ) {

                console.log(
                    `🎂 Birthday found: ${student.name}`
                );

                await sendBirthdayEmail(student);
            }
        }

    } catch (error) {

        console.error(
            "Birthday checker error:",
            error.message
        );
    }
};

module.exports = {
    checkBirthdays
};