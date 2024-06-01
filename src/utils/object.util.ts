function setProperty<T, K extends keyof T>(obj: T, prop: K, value: T[K]): void {
	obj[prop] = value;
}

function mapObjToEntity(entity: any, obj: Object) {
	return Object.assign(entity, obj);
}

export default {
	setProperty,
	mapObjToEntity
};
