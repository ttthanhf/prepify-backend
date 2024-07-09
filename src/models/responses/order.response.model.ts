export class OrderItemResponse {
	id!: string;
	name!: string;
	slug!: string;
	image!: string;
	price!: number;
	quantity!: number;
	serving!: number;
	extraSpice?: {
		id: string;
		name: string;
		image: string;
		price: number;
	};
}

export class OrderResponse {
	id!: string;
	orderItems!: OrderItemResponse[];
	status!: string;
	orderDate!: Date;
	totalPrice!: number;
}
