import { EmailGenerator } from "@/data/mailer";
import { generalEmail } from "./general";

interface RegistrationProps {
  email: string;
  code: string;
  firstName: string;
}

export const forgotPasswordEmail: EmailGenerator<RegistrationProps> = async ({
  code,
  email,
  firstName,
}) => {
  return generalEmail({
    title: "Reset your password",
    name: firstName,
    content: `We have received a request to reset your password. Please enter the following code to verify your account:
<h1>${code}</h1>

If that was not you, you can safely ignore this email. If in doubt, contact us and we will be happy to assist you further.`,
    senderName: "BrainWaveBuilder",
  });
};
