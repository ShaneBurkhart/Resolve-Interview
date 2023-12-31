import { openDB, query } from './db';
import { getEntityProperties, getEntityParentIDs, getEntityInstancesOf } from './entity';

const ENTITY_ID = 7600;

test('entity query returns the correct properties', async () => {
	const db = await openDB();

	const result = await getEntityProperties(db, ENTITY_ID);

	expect(result.entityId).toBe(ENTITY_ID);
	expect(result.name).toBe('Transformer1 [338678]')
	expect(result.properties).toBeDefined();
	expect(Object.keys(result.properties).length).toBeGreaterThan(0);
})

test('get parent IDs of entity', async () => {
	const db = await openDB();

	const parents = await getEntityParentIDs(db, ENTITY_ID);

	expect(parents).toBeDefined();
	expect(parents.length).toBe(4);
})

test('get intance of IDs of entity', async () => {
	const db = await openDB();

	const instancesOf = await getEntityInstancesOf(db, ENTITY_ID);

	expect(instancesOf).toBeDefined();
	expect(instancesOf.length).toBe(1);
})

test('what are the value types?', async () => {
	const db = await openDB();

	// THESE ARE ALL DATA_TYPES
	// [
	// 	{ data_type: 20 }, 		// string
	// 	{ data_type: 11 }, 		// refernced entityId
	// 	{ data_type: 1 }, 		// boolean
	// 	{ data_type: 2 },			// integer
	// 	{ data_type: 3 } .   	// decimal with/without units
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