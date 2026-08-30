const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBirthdayEmail = async (student) => {

    try {

        console.log("📧 Email sending started...");
        console.log("📧 To:", student.email);

        const { data, error } = await resend.emails.send({
            from: "Birthday Management <onboarding@resend.dev>",
            to: [student.email],
            subject: `🎂 Happy Birthday ${student.name}!`,

            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>🎉 Happy Birthday, ${student.name}! 🎂</h2>

                    <p>
                        Student Portal ki taraf se aapko
                        <strong>Happy Birthday</strong>!
                    </p>

                    <p>
                        Aapka aaj ka din khushiyon aur safalta se bhara rahe.
                    </p>

                    <br>

                    <p>Best Wishes ❤️</p>
                    <p><strong>Student Portal Team</strong></p>
                </div>
            `
        });

        if (error) {
            console.error("❌ Resend Error:", error);
            return false;
        }

        console.log(
            `✅ Birthday email sent to ${student.email}`,
            data
        );

        return true;

    } catch (error) {

        console.error("❌ EMAIL ERROR:", error.message);
        return false;

    }
};

module.exports = {
    sendBirthdayEmail
};
