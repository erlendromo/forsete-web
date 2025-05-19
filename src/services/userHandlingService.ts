import { config } from "../config/config.js";
import { setAuthCookie } from "../utils/cookieUtil.js";
import { HTTP_STATUS, ApiEndpoints } from "../config/constants.js";
import {User,LoginSuccess,Registration,} from "../interfaces/userInterface.types.js";
import { Response as ExpressResponse } from "express";

const url = config.urlBackend;

/**
 * This module provides functions for user authentication, including login,
 * token storage, and checking login status.
 *
 * @module loginService
 */

/**
 * LoginError class extends the built-in Error class to represent errors
 * that occur during the login process. It includes an HTTP status code
 * to provide more context about the error.
 * @typedef {Error} LoginError
 */
export class LoginError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    // Call the parent constructor with the error message
    super(message);
    this.status = status;
  }
}

/**
 * login function sends a POST request to the server with user credentials
 * and returns the login success response.
 * @param {Credentials} creds - The user credentials for login.
 * @param {string} [endpoint='/login'] - The endpoint for the login request.
 * @returns {Promise<LoginSuccess>} - A promise that resolves to the login success response.
 * @throws {LoginError} - Throws an error if the login fails or if there is a network issue.
 */
export async function login(
  userCred: User,
  endpoint = url + ApiEndpoints.LOGIN_ENDPOINT,
): Promise<LoginSuccess> {
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCred),
    });
  } catch (err) {
    throw new LoginError("Network unreachable");
  }
  if (!res.ok) {
    throw new LoginError("Error during login: ", res.status);
  }
  const data = await res.json();
  return data as LoginSuccess;
}

/**
 * Registers a new user by sending their registration data to the specified endpoint.
 *
 * @param userData - The registration data for the new user.
 * @param endpoint - The API endpoint to send the registration request to. Defaults to the REGISTER_ENDPOINT.
 * @returns A promise that resolves to a {@link LoginSuccess} object on successful registration.
 * @throws {LoginError} If the network is unreachable, the server response cannot be parsed as JSON,
 *         or the server returns an error status code. The error message will reflect the specific failure.
 */
export async function register(
  userData: Registration,
  endpoint = url + ApiEndpoints.REGISTER_ENDPOINT,
): Promise<LoginSuccess> {
  let res: Response

  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
  } catch (networkErr) {
    // failed to even reach the server
    throw new LoginError("Network unreachable")
  }

  // parse the JSON exactly once
  let body: any
  try {
    body = await res.json()
  } catch (parseErr) {
    // server replied with non‐JSON or empty body
    throw new LoginError("Registration failed")
  }

  // now check the status code
  if (!res.ok) {
    // extract server’s “error” field (falling back to a generic message)
    const serverMessage = body.error ?? "Registration failed"
    throw new LoginError(serverMessage)
  }

  // success path
  return body as LoginSuccess
}

/**
 * Route handler for processing user login.
 *
 * This function receives user credentials (email and password) from the request body,
 * sends them to the external authentication API using the `login` service,
 * and stores the returned token in a secure HttpOnly cookie.
 *
 * On success, it returns a JSON response with a success message.
 * On failure (e.g., wrong credentials or API error), it returns a 401 Unauthorized status.
 *
 * @param {Request} req - Express request object containing the login credentials in the body.
 * @param {Response} res - Express response object used to send the result and set the auth cookie.
 *
 * @returns {Promise<void>} Responds with 200 on success, 401 on failure.
 */
export async function handleLogin(
  username: string,
  password: string,
  res: ExpressResponse,
) {
  const userData: User = {
    email: username,
    password: password,
  };
  try {
    const { token } = await login(userData);
    setAuthCookie(res, token);
    res
      .status(HTTP_STATUS.SUCCESS)
      .json({ success: true, message: "Login successful" });
  } catch (err) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ success: false, message: "Login failed: Please check you email and password." });
  }
}

/**
 * Handles user registration by creating a new user with the provided username and password.
 * Sends an appropriate HTTP response based on the registration outcome.
 *
 * @param username - The email or username of the user to register.
 * @param password - The password for the new user.
 * @param res - The Express response object used to send HTTP responses.
 * @returns A promise that resolves when the registration process is complete.
 */
export async function handleRegister(
  username: string,
  password: string,
  res: ExpressResponse,
): Promise<void> {
  const userData: Registration = { email: username, password };
  try {
    await register(userData);
    res
      .status(HTTP_STATUS.CREATED)
      .json({message: "Registration successful" });
  } catch (err) {
    const msg = err instanceof Error
      ? err.message
      : "Registration failed";
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({error: msg });
  }
}
