// server-only helper for Loops Transactional emails
// Loops API docs: POST https://app.loops.so/api/v1/transactional

export type LoopsSendArgs = {
  transactionalId: string; // Loops template ID
  email: string; // recipient
  dataVariables?: Record<string, any>; // template variables
};

export async function sendLoopsTransactional({
  transactionalId,
  email,
  dataVariables = {},
}: LoopsSendArgs) {
  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) throw new Error('Missing LOOPS_API_KEY');

  const res = await fetch('https://app.loops.so/api/v1/transactional', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactionalId,
      email,
      dataVariables,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Loops send failed (${res.status}): ${text}`);
  }
}
