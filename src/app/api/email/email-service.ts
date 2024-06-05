const { MailtrapClient } = require('mailtrap');

type EmailServiceType = {
  recipient_email: string;
  template_uuid: string;
  customer_name: string;
  template_variables: object;
};
const TOKEN = process.env.NEXT_MAIL_TRAP_TOKEN;
const ENDPOINT = 'https://send.api.mailtrap.io/';

export const emailService = async ({
  customer_name,
  recipient_email,
  template_uuid,
  template_variables,
}: EmailServiceType) => {
  const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

  const sender = {
    email: 'welcome@re-position.co',
    name: 'Reposition',
  };
  const recipients = [
    {
      email: recipient_email,
    },
  ];

  await client
    .send({
      from: sender,
      to: recipients,
      template_uuid: template_uuid,
      template_variables: {
        customer_name: customer_name,
        ...template_variables,
      },
    })
    .then(console.log, console.error);
};
