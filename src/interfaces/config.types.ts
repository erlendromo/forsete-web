/**
 * @file configInterface.ts
 * @description This file contains the interface for the application configuration.
 * It defines the structure of the configuration object used throughout the application.
 * @module configInterface
 * @see {@link src/config/config.ts} for the implementation of the configuration.
 */
export interface AppConfig {
    urlBackend: string;
    port:      number;
    useMock:   boolean;
  }

/**
 * Configuration for the image-processing pipeline.
 *
 * @interface ImageProcessingConfig
 * @property {string[]} image_ids List of image identifiers to be processed.
 * @property {string} line_segmentation_model Name of the line segmentation model.
 * @property {string} text_recognition_model Name of the text recognition model.
 */
export interface ImageProcessingConfig {
    image_ids: string[];          // Array of image IDs (strings)
    line_segmentation_model: string;  // Model for line segmentation
    text_recognition_model: string;   // Model for text recognition
 }