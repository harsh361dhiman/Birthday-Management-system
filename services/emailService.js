const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendBirthdayEmail = async (student) => {
    try {

        console.log("📧 Email sending started...");
        console.log("📧 To:", student.email);

        const sendSmtpEmail = {
            sender: {
                name: "Student Portal",
                email: process.env.EMAIL_USER
            },
            to: [{ email: student.email, name: student.name }],
            subject: `🎂 Happy Birthday ${student.name}!`,
            htmlContent: `
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

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log(
            `✅ Birthday email sent to ${student.email}:`,
            data.messageId
        );

        return true;

    } catch (error) {

        console.error(
            `❌ Birthday email failed for ${student.email}:`,
            error.message
        );

        // 🆕 Poora error detail print karo
        if (error.response && error.response.body) {
            console.error("🔍 Full Brevo Error:", JSON.stringify(error.response.body));
        } else {
            console.error("🔍 Full Error Object:", JSON.stringify(error));
        }

        return false;
    }
};

module.exports = {
    sendBirthdayEmail
};
