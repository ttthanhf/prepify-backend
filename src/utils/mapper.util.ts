import { ObjectLiteral } from 'typeorm';

function mapEntityToClass<Entity extends ObjectLiteral>(
	entity: Entity,
	ClassDTO: any
) {
	const classDTO = new ClassDTO();
	Object.keys(classDTO).forEach((key) => {
		if (entity.hasOwnProperty(key)) {
			classDTO[key] = entity[key];
		}
	});
	return classDTO;
}

function mapObjToEntity<Entity extends ObjectLiteral>(
	entity: Entity,
	obj: Object
) {
	return Object.assign(entity, obj);
}

export default {
	mapEntityToClass,
	mapObjToEntity
};
