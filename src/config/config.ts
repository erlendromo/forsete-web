import dotenv from 'dotenv';
dotenv.config();

/**
 * Application runtime configuration.
 * Reads from environment variables (via dotenv) and falls back to sane defaults.
 * @type {Config}
 */
export const config = {
    port: parseInt(process.env.PORT || "3000"),
    useMock: process.env.USE_MOCK === 'true'
}

export default config;