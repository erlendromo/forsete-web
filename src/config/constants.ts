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

export function outputEndpointConstructor(imageID: string): string {
  return  ApiEndpoints.VERSION_ATR + 'Images/' + imageID + '/outputs/';
}

export function outputDataEndpointConstructor(imageID: string, outputID: string): string {
  return  outputEndpointConstructor(imageID) + outputID + '/data/';
}

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
  Upload = '/upload',
  Transcribe = '/transcribe',
  Update = '/update'
}

export enum AppPages {
  Home = 'index',
  Results = 'results',
  Login = 'login',
  Register = 'register',
}