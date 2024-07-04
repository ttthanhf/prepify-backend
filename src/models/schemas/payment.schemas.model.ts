import { Static, Type } from '@sinclair/typebox';

export const VNPayGetSchema = Type.Object({
	vnp_Amount: Type.String(),
	vnp_BankCode: Type.String(),
	vnp_BankTranNo: Type.String(),
	vnp_CardType: Type.String(),
	vnp_OrderInfo: Type.String(),
	vnp_PayDate: Type.String(),
	vnp_ResponseCode: Type.String(),
	vnp_TmnCode: Type.String(),
	vnp_TransactionNo: Type.String(),
	vnp_TransactionStatus: Type.String(),
	vnp_TxnRef: Type.String(),
	vnp_SecureHash: Type.String()
});

export type VNPayGet = Static<typeof VNPayGetSchema>;
