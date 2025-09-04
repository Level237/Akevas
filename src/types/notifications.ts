export interface NotificationData {
    id: number;
    order_id?: number;
    customer_name?: string;
    total_amount?: string;
    data: {
        message?: string;
        feedback?: string;
    };
    type: string;
    read_at: string | null;
    created_at: string;
}
