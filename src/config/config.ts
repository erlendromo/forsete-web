import dotenv from 'dotenv';
dotenv.config();

const config = {
    urlBackend: process.env.URL_BACKEND || 'http://10.212.172.171:8080/forsete-atr/v1/',
    port: parseInt(process.env.PORT || "3000"),
    useMock: process.env.USE_MOCK === 'true'
}

export default config