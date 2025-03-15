import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}",
                verificationToken
            ),
            category: "Email Verification",
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);

        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "848ca40c-7066-4c2b-b166-187548d3c622",
            template_variables: {
                name: name,
            },
        });
        console.log(response);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
                "{resetURL}",
                resetUrl
            ),
            category: "reset password",
        });
        console.log(response);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const sendResetSuccessfulEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "reset password successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "password reset successful",
        });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};
