export class GameController {
    orderItemsId: number;
    quantity: string;
    itemPrice: number;
    order: {
        orderId: number;
        order_date: string;
        orderTotal: string;
    };
    product: {
        productJsonId: number;
        productName: string;
        imgUrl: string;
    };
}