import { EmailGenerator } from "@/data/mailer";
import { generalEmail } from "./general";

interface RegistrationProps {
  email: string;
  code: string;
}

export const registrationEmail: EmailGenerator<RegistrationProps> = async ({
  code,
  email,
}) => {
  return generalEmail({
    title: "Verify your email",
    name: email,
    content: `Thanks for registering for Brainwaves! Please enter the following code to verify your account.
<h1>${code}</h1>`,
    senderName: "BrainWaveBuilder",
  });
};
