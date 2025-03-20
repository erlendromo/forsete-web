
interface ATRPiplineConfig {
  imagePath: string;
  models: Model[];
  apiEndpoint: string;
  apiKey?: string;
  timeoutMs?: number;
  onProgress?: (progress: number) => void;
}

interface Model{
  modelType: string //Key
  modelName: string //Value
}

