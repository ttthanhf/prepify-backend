export class ShippingDate {
	day!: number;
	month!: number;
	year!: number;
}

export class AreaResponse {
	id!: string;
	name!: string;
	instantPrice!: number;
	standardPrice!: number;
}

export class ItemResponse {
	id!: string;
	name!: string;
	image!: string;
	price!: number;
	quantity!: number;
	serving!: number;
}

export class PaymentResponse {
	id!: string;
	name!: string;
	icon!: string;
}

export class CheckoutResponse {
	items!: Array<ItemResponse>;
	area!: Array<AreaResponse>;
	payments!: Array<PaymentResponse>;
	instantDate!: ShippingDate;
	standardDate!: ShippingDate;
}
