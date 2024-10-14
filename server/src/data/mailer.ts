import { APIError } from "@/apis";
import { SK_MAILGUN_API_KEY } from "@/globals";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const sendEmail = async (
  address: string,
  subject: string,
  html: string,
): Promise<void> => {
  if (!emailRegex.test(address)) {
    throw new APIError(`${address} is not a valid email address`);
  }

  const form = new FormData();
  form.append("from", "BrainWaveBuilder <noreplay@brainwave.quick.to>");
  form.append("to", address);
  form.append("subject", subject);
  form.append("html", html);

  const domain_name = "brainwave.quick.to";

  try {
    const resp = await fetch(
      `https://api.mailgun.net/v3/${domain_name}/messages`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Basic ` + Buffer.from(SK_MAILGUN_API_KEY).toString("base64"),
        },
        body: form,
      },
    );

    if (!resp.ok) {
      throw new APIError("Failed to send email");
    }
  } catch (e) {
    if (e instanceof APIError) {
      throw e;
    } else {
      throw new APIError(
        `Error sending email: ${e instanceof Error ? e.message : e}`,
      );
    }
  }
};

// An EmailGenerator returns the subject and html content of an email.
export type EmailGenerator<T extends Record<string, any>> = (
  params: T,
) => Promise<[string, string]>;

export const sendEmailFromTemplate = async <T extends Record<string, any>>(
  address: string,
  generator: EmailGenerator<T>,
  params: T,
): Promise<void> => {
  const [subject, html] = await generator(params);
  await sendEmail(address, subject, html);
};
