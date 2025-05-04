/**
 * User interface represents the structure of User User
 * required for login.
 * @typedef {Interface} User
 */
export interface User {
    email: string;
    password: string;
}

/**
 * Registration interface extends User interface and represents
 * the structure of the user required for registration.
 * @typedef {Interface} Registration
 */
export interface Registration extends User {
}
/**
 * LoginSuccess interface represents the structure of the response
 * received upon successful login.
 * @typedef {Interface} LoginSuccess
 */
export interface LoginSuccess {
    token: string;
}
