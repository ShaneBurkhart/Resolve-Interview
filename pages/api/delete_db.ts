import { checkForDB, downloadDBAsync, deleteDBSync } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const dbExists = await checkForDB();
  if (dbExists) await deleteDBSync();
	return res.status(200).json({ status: 'deleted' });
}
