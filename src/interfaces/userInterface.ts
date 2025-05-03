/**
 * Credentials interface represents the structure of user credentials
 * required for login.
 * @typedef {Interface} Credentials
 */
export interface Credentials {
    email: string;
    password: string;
}

export interface Registration extends Credentials {
}
/**
 * LoginSuccess interface represents the structure of the response
 * received upon successful login.
 * @typedef {Interface} LoginSuccess
 */
export interface LoginSuccess {
    token: string;
}
