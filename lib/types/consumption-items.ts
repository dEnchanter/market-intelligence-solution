export interface ConsumptionItem {
  class: string;
  description: string;
  durability: string;
  group: string;
  id: string;
  item: string;
  subclass: string;
  unit_of_measure: string;
}

export interface ImportConsumptionItemsRequest {
  items: ConsumptionItem[];
}

export interface ImportConsumptionItemsResponse {
  data: string;
  message: string;
  success: boolean;
}

export interface ConsumptionItemsFilters {
  group?: string;
  class?: string;
  subclass?: string;
  item?: string;
  durability?: string;
}

export interface GetConsumptionItemsResponse {
  data: ConsumptionItem[];
  message: string;
  success: boolean;
}

export interface UpdateConsumptionItemRequest {
  description?: string;
  item?: string;
  unit_of_measure?: string;
}

export interface UpdateConsumptionItemResponse {
  data: ConsumptionItem;
  message: string;
  success: boolean;
}
