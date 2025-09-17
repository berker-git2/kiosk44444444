export interface DemoResponse {
  message: string;
}

export interface VakifInitRequest {
  amount: number;
  orderId: string;
  currency?: string; // ISO code, default EUR
  description?: string;
}

export interface VakifInitResponse {
  gatewayUrl: string;
  fields: Record<string, string>;
}
