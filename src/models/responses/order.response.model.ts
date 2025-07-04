import { OrderStatus } from '~constants/orderstatus.constant';

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
	trackingNumber?: string | null;
	hasFeedback!: boolean;
}

export class OrderDetailResponse {
	id!: string;
	address!: string;
	phone!: string;
	fullname!: string;
	orderItems!: OrderItemResponse[];
	status!: OrderStatus;
	orderDate!: Date;
	deliveryPrice!: number;
	totalPrice!: number;
	trackingNumber!: string;
	hasFeedback!: boolean;
	payment!: {
		id: string;
		icon: string;
		name: string;
	};
}
