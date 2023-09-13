// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { openDB, query } from '@/lib/db'
import { Database }from 'sqlite';

type Data = {
  name: string
}

// TODO: add a param for pagination
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const db: Database = await openDB();
  const result = await query(db, 'SELECT * FROM _objects_attr LIMIT 2', []);
  console.log(result.length);

  res.status(200).json({ name: 'John Doe' })

}
