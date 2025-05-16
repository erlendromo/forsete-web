/**
 * Enum representing key API endpoints used in the application.
 *
 * @enum {string}
 */
export enum ApiEndpoints {
  // Base URL for the backend API
  VERSION_ATR = 'forsete-atr/v2/',

  // ATR endpoint
  ATR_ENDPOINT = ApiEndpoints.VERSION_ATR + 'atr/',

  // Auth endpoints
  REGISTER_ENDPOINT = ApiEndpoints.VERSION_ATR + 'auth/register/',
  LOGIN_ENDPOINT = ApiEndpoints.VERSION_ATR + 'auth/login/',
  LOGOUT_ENDPOINT = ApiEndpoints.VERSION_ATR + 'auth/logout/',

  // Image & Output endpoints
  UPLOAD_IMAGE_ENDPOINT = ApiEndpoints.VERSION_ATR + 'images/upload/',
  IMAGE_LIST_ENDPOINT = ApiEndpoints.VERSION_ATR + 'images/',

  // Model endpoints
  MODELS_ENDPOINT = ApiEndpoints.VERSION_ATR + 'models/',
  REGION_MODELS_ENDPOINT = ApiEndpoints.VERSION_ATR + 'models/region-segmentation-models/',
  LINE_MODELS_ENDPOINT = ApiEndpoints.VERSION_ATR + 'models/line-segmentation-models/',
  TEXT_MODELS_ENDPOINT = ApiEndpoints.VERSION_ATR + 'models/text-recognition-models/',

  // Status endpoint
  STATUS_ENDPOINT = ApiEndpoints.VERSION_ATR + 'status/',

}

// Where the cookie is stored
export enum tokenStorage {
  TOKEN_KEY = 'auth.token'
}

export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

export enum AppRoute {
  Home = '/',
  Results = '/results',
  Login = '/login',
  Register = '/register',
}

export enum AppPages {
  Home = 'index',
  Results = 'results',
  Login = 'login',
  Register = 'register',
}
export enum ExportFormat {
  JSON = 'json',
  PLAIN_TXT = 'plain_txt',
  PLAIN_PDF = 'plain_pdf',
}

/**
 * API routes for the application
 */
export enum ApiRoute {
  Login = '/api/login',
  Logout = '/api/logout',
  Images = '/api/images',
  Outputs = '/api/outputs',
  Register = '/api/register',
  PdfToImage = '/api/pdfToImage',
  Transcribe = '/api/transcribe',
  SelectedModels = '/api/selectedModels',
  OutputData = '/api/outputdata',
  Export = '/api/export',
  Save = '/api/save',
}

export enum AllowedMimeType {
  JPG = "image/jpeg",
  PNG = "image/png",
  TIFF = "image/tiff",
  PDF = "application/pdf",
}
// 32 mb
export const MAX_FILE_SIZE =  32 * 1024 ** 2;