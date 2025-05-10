export interface Model {
  id: number;
  name: string;
  model_type: string;
}

export interface AllModels {
  lineModels: Model[];
  textModels: Model[];
}