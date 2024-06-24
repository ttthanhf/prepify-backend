import { ObjectLiteral } from 'typeorm';

function mapEntityToClass<Entity extends ObjectLiteral, T extends object>(
	entity: Entity,
	ClassDTO: new () => T
): T {
	const classDTO = new ClassDTO();
	Object.keys(classDTO).forEach((key) => {
		if (entity.hasOwnProperty(key)) {
			(classDTO as any)[key] = entity[key];
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
