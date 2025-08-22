import { sendLoopsTransactional } from '@/lib/loops';

export type EmailServiceArgs = {
  recipient_email: string;
  transactionalId: string; // Loops template id
  dataVariables?: Record<string, any>;
};

export async function emailService({
  recipient_email,
  transactionalId,
  dataVariables,
}: EmailServiceArgs) {
  await sendLoopsTransactional({
    transactionalId,
    email: recipient_email,
    dataVariables,
  });
}
