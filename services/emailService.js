const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBirthdayEmail = async (student) => {
    try {

        console.log("📧 Email sending started...");
        console.log("📧 To:", student.email);

        const mailOptions = {
            from: `"Student Portal" <${process.env.EMAIL_USER}>`,
            to: student.email,
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
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(
            `✅ Birthday email sent to ${student.email}: ${info.messageId}`
        );

        return true;

    } catch (error) {

        console.error(
            `❌ Birthday email failed for ${student.email}:`,
            error.message
        );

        return false;
    }
};

module.exports = {
    sendBirthdayEmail
};
