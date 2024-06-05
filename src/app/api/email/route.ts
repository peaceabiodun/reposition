import { emailService } from './email-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await emailService(body);
  } catch (err: any) {
    console.log(err);
  }
}
