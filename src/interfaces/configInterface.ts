/**
 * @file configInterface.ts
 * @description This file contains the interface for the application configuration.
 * It defines the structure of the configuration object used throughout the application.
 * @module configInterface
 * @see {@link ../config/config.ts} for the implementation of the configuration.
 */
export interface AppConfig {
    urlBackend: string;
    port:      number;
    useMock:   boolean;
  }