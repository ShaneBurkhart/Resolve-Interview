import { Database } from 'sqlite';
import { query } from '@/lib/db'


/// TABLES
// _objects_eav - eav = entity attribute value - this links everything
// _objects_ercv - ercv = entity row column value - this is might be for formatting
// _objects_attr - attr = attribute - this is the attribute metadata w/ category
// _objects_val - val = value - this is the value for the attribute, types are on attr


function buildEntity(attrRows: Array<any>) {
	const entity = {
		properties: {},
	}

	for (const row of attrRows) {
		const category = row.category;
		if (!entity.properties[category]) entity.properties[category] = {};

		entity.properties[category][row.display_name] = row.value || " "
	}

	console.log(entity)

	return entity
}

export async function getEntityProperties(db: Database, entityId: number) {
	const q = `
		SELECT *
		FROM _objects_eav
		JOIN _objects_attr ON _objects_eav.attribute_id = _objects_attr.id
		JOIN _objects_val ON _objects_eav.value_id = _objects_val.id
		WHERE _objects_eav.entity_id = ?
		AND _objects_attr.category NOT LIKE '\\_\\_%' ESCAPE '\\'
	`;
	const result = await query(db, q, [entityId]);
	console.log(result);

	return buildEntity(result);
}