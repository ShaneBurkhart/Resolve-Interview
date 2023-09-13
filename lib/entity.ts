import { Database } from 'sqlite';
import { query } from '@/lib/db'


/// TABLES
// _objects_eav - eav = entity attribute value - this links everything
// _objects_ercv - ercv = entity row column value - this is might be for formatting
// _objects_attr - attr = attribute - this is the attribute metadata w/ category
// _objects_val - val = value - this is the value for the attribute, types are on attr


function buildEntity(attrRows: Array<any>) {
	if (attrRows.length === 0) throw new Error('No attributes found for entity');

	const entity = {
		entityId: attrRows[0].entity_id,
		name: null,
		properties: {},
	}

	for (const row of attrRows) {
		const category = row.category;

		// save the name if we see it
		if (category === '__name__') {
			entity.name = row.value;
			continue;
		}

		if (!entity.properties[category]) entity.properties[category] = {};
		console.log(row);

		entity.properties[category][row.display_name] = row.value || " "
	}

	return entity
}

export async function getEntityProperties(db: Database, entityId: number) {
	const q = `
		SELECT *
		FROM _objects_eav
		JOIN _objects_attr ON _objects_eav.attribute_id = _objects_attr.id
		JOIN _objects_val ON _objects_eav.value_id = _objects_val.id
		WHERE _objects_eav.entity_id = ?
		AND (
			_objects_attr.category NOT LIKE '\\_\\_%' ESCAPE '\\'
			OR _objects_attr.category = '__name__'
		)
	`;
	const result = await query(db, q, [entityId]);
	// todo: handle the no values case

	return buildEntity(result);
}