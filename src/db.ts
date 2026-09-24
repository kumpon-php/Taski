import { db } from './prisma/db';
import { URL } from './schemas/env.schema';

export { db };
export const runtime = await db.connect({ url: URL });