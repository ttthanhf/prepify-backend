function setProperty<T, K extends keyof T>(obj: T, prop: K, value: T[K]): void {
	obj[prop] = value;
}

export default {
	setProperty
};
