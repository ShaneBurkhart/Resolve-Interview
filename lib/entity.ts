import { Database } from 'sqlite';
import { query } from '@/lib/db'


/// TABLES
// _objects_eav - eav = entity attribute value - this links everything
// _objects_ercv - ercv = entity row column value - this is might be for formatting
// _objects_attr - attr = attribute - this is the attribute metadata w/ category
// _objects_val - val = value - this is the value for the attribute, types are on attr


function buildEntity(attrRows: Array<any>, entityId: number) {
	if (attrRows.length === 0) throw new Error('No attributes found for entity');

	const entity: any = {
		entityId,
		name: null,
		parent: null,
		children: [],
		properties: {},
	}

	for (const row of attrRows) {
		const category = row.category;

		// save the name if we see it
		if (category === '__name__') {
			if (row.entity_id === entityId) entity.name = row.value;
			continue;
		}

		if (category === '__parent__') {
			if (row.entity_id === entityId) entity.parent = row.value;
			continue;
		}

		if (category === '__child__') {
			if (row.entity_id === entityId) entity.children.push(row.value);
			continue;
		}

		if (!entity.properties[category]) entity.properties[category] = {};

		const key = row.display_name || row.name


		let value = row.value

		if (row.data_type === 1) {
			// boolean
			value = value === 1 ? "Yes" : "No";
		} else if (row.data_type === 2) {
			// integer
			value = parseInt(value);
		} else if (row.data_type === 3) {
			// decimal with/without units
			value = parseFloat((parseFloat(value) || 0).toFixed(row.display_precision || 12)).toString();
			value = `${value} ${row.data_type_context}`;
		} else if (row.data_type === 11) {
			// referenced entityId
			throw new Error('TODO: referenced entityId');
		} else if (row.data_type === 20) {
			value = value.trim();
		} else {
			value = " "
		}

		entity.properties[category][key] = value
	}

	return entity
}

export async function getEntityProperties(db: Database, entityId: number) {
	const parents = await getEntityParentIDs(db, entityId);
	const instanceOf = await getEntityInstancesOf(db, entityId);
	const q = `
		SELECT *
		FROM _objects_eav
		JOIN _objects_attr ON _objects_eav.attribute_id = _objects_attr.id
		JOIN _objects_val ON _objects_eav.value_id = _objects_val.id
		WHERE (
			_objects_eav.entity_id = ?
			OR _objects_eav.entity_id IN (${parents.join(',')})
			OR _objects_eav.entity_id IN (${instanceOf.join(',')})
		) AND (
			_objects_attr.category NOT LIKE '\\_\\_%' ESCAPE '\\'
			OR _objects_attr.category = '__name__'
			OR _objects_attr.category = '__child__'
			OR _objects_attr.category = '__parent__'
		)
	`;
	const result = await query(db, q, [entityId]);
	return buildEntity(result, entityId);
}

export async function getEntityParentIDs(db: Database, entityId: number) {
	const parents: Array<number> = [];
	const q = `
		SELECT *
		FROM _objects_eav
		JOIN _objects_attr ON _objects_eav.attribute_id = _objects_attr.id
		JOIN _objects_val ON _objects_eav.value_id = _objects_val.id
		WHERE _objects_eav.entity_id = ?
		AND _objects_attr.category = '__parent__'
	`;
	let eid = entityId;
	let result = await query(db, q, [eid]);
	while (result.length > 0) {
		parents.push(result[0].value);
		eid = result[0].value;

		result = await query(db, q, [eid]);
	}

	return parents
}

export async function getEntityInstancesOf(db: Database, entityId: number) {
	const instancesOf: Array<number> = [];
	const q = `
		SELECT *
		FROM _objects_eav
		JOIN _objects_attr ON _objects_eav.attribute_id = _objects_attr.id
		JOIN _objects_val ON _objects_eav.value_id = _objects_val.id
		WHERE _objects_eav.entity_id = ?
		AND _objects_attr.category = '__instanceof__'
	`;

	let eid = entityId;
	let result = await query(db, q, [entityId]);
	while (result.length > 0) {
		instancesOf.push(result[0].value);
		eid = result[0].value;

		result = await query(db, q, [eid]);
	}

	return instancesOf
}