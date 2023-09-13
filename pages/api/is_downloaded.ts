import { checkForDB, downloadDBAsync } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const dbExists = await checkForDB();
  if (!dbExists) {
    return res.status(200).json({ status: 'downloading' });
  } else {
    return res.status(200).json({ status: 'downloaded' });
  }
}