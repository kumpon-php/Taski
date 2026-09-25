import { db } from './prisma/db.js';
import { URL } from './schemas/env.schema.js';

export { db };
export const runtime = await db.connect({ url: URL });