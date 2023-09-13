// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { openDB, query, checkForDB, downloadDBAsync } from '@/lib/db'
import { Database }from 'sqlite';
import { getEntityProperties } from '@/lib/entity';

// TODO: add a param for pagination, if needed
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
	// check for the database
	// if it doesn't exist, return a status saying we are downloading

	const dbExists = await checkForDB();
	if (!dbExists) {
		downloadDBAsync();
		return res.status(200).json({ status: 'downloading' });
	}


	const entityId: string = req.query.entityId as string;

  const db: Database = await openDB();
	const entity = await getEntityProperties(db, entityId);

	res.status(200).json({ entity })
}
