function setProperty<T, K extends keyof T>(obj: T, prop: K, value: T[K]): void {
	obj[prop] = value;
}

type NestedOmit<T, K extends string[]> = T extends object
	? {
			[P in keyof T]: P extends K[number]
				? never
				: T[P] extends object
					? NestedOmit<T[P], K>
					: T[P];
		}
	: T;

function hideProperties<T extends object, K extends string>(
	obj: T,
	...keys: K[]
): NestedOmit<T, K[]> {
	const result = JSON.parse(JSON.stringify(obj));

	keys.forEach((key) => {
		const parts = key.split('.');
		let current: any = result;

		for (let i = 0; i < parts.length - 1; i++) {
			if (current[parts[i]] === undefined) return;
			current = current[parts[i]];
		}

		delete current[parts[parts.length - 1]];
	});

	return result;
}

function objectToQueryString(obj: { [key: string]: any }): string {
	return Object.keys(obj)
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
		.join('&');
}

function sortObject<T extends Record<string, any>>(obj: T): T {
	const sorted: Partial<T> = {};
	const keys = Object.keys(obj).sort();

	for (const key of keys) {
		const value = obj[key];
		sorted[key as keyof T] = value;
	}

	return sorted as T;
}

export default {
	setProperty,
	hideProperties,
	objectToQueryString,
	sortObject
};
