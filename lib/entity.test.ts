import { openDB, query } from './db';
import { getEntityProperties } from './entity';

const ENTITY_ID = 7600;

test('entity query returns the correct properties', async () => {
	const db = await openDB();

	const result = await getEntityProperties(db, ENTITY_ID);

	expect(result.entityId).toBe(ENTITY_ID);
	expect(result.name).toBe('Transformer1 [338678]')
	expect(result.properties).toBeDefined();
	expect(Object.keys(result.properties).length).toBeGreaterThan(0);
})

test('what are the value types?', async () => {
	const db = await openDB();

	// THESE ARE ALL DATA_TYPES
	// [
	// 	{ data_type: 20 }, 		// string, display and value are there
	// 	{ data_type: 11 }, 		// this might have something to do with the rows and cols table (no display_name)
	// 	{ data_type: 1 }, 		// it's a boolean
	// 	{ data_type: 2 },			// this is a large negative number, no display name
	// 	{ data_type: 3 } .   	// this appears to be a number, possibly text, it has a unit
	// ]

	// I'm unsure what flags are, it appears it can have the same data type but different flags.
	// TODO what is a flag?

	const results = await query(db, `
		SELECT DISTINCT data_type, data_type_context, flags, display_precision, value, display_name
		FROM _objects_eav
		JOIN _objects_attr ON _objects_eav.attribute_id = _objects_attr.id
		JOIN _objects_val ON _objects_eav.value_id = _objects_val.id
	`, []);
})