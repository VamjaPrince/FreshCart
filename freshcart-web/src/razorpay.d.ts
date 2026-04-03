declare module "razorpay" {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface OrderOptions {
    amount: number;
    currency: string;
    receipt?: string;
  }

  class Razorpay {
    constructor(options: RazorpayOptions);

    orders: {
      create(options: OrderOptions): Promise<any>;
    };
  }

  export default Razorpay;
}