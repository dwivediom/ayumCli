/**
 * Image compression utility using browser-image-compression library
 * Compresses images larger than 5MB to make them under 5MB
 */

import imageCompression from 'browser-image-compression';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Generates a timestamped filename while preserving the original name
 * @param {string} originalName - The original filename
 * @param {string} suffix - Optional suffix to add before extension
 * @returns {string} - Timestamped filename
 */
export const generateTimestampedFileName = (originalName, suffix = '') => {
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .replace('Z', '');
  
  const lastDotIndex = originalName.lastIndexOf('.');
  const nameWithoutExt = originalName.substring(0, lastDotIndex);
  const extension = originalName.substring(lastDotIndex);
  
  const suffixPart = suffix ? `_${suffix}` : '';
  return `${nameWithoutExt}_${timestamp}${suffixPart}${extension}`;
};

/**
 * Compresses an image file using browser-image-compression library
 * @param {File} file - The image file to compress
 * @param {number} maxSize - Maximum file size in bytes (default: 5MB)
 * @param {Function} onProgress - Optional progress callback function
 * @param {boolean} addTimestamp - Whether to add timestamp to filename (default: true)
 * @returns {Promise<File>} - Compressed file
 */
export const compressImage = async (file, maxSize = MAX_FILE_SIZE, onProgress = null, addTimestamp = true) => {
  // If file is already under max size, return as is
  if (file.size <= maxSize) {
    return file;
  }

  const maxSizeMB = maxSize / (1024 * 1024); // Convert to MB for the library

  const options = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    onProgress: onProgress,
    preserveExif: false,
    fileType: file.type,
    initialQuality: 0.8,
    alwaysKeepResolution: false
  };

  try {
    const compressedFile = await imageCompression(file, options);
    
    // Add timestamp to filename if requested
    if (addTimestamp) {
      const timestampedName = generateTimestampedFileName(file.name, 'compressed');
      return new File([compressedFile], timestampedName, {
        type: compressedFile.type,
        lastModified: Date.now(),
      });
    }
    
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error(`Failed to compress image: ${error.message}`);
  }
};

/**
 * Checks if a file is an image
 * @param {File} file - The file to check
 * @returns {boolean} - True if file is an image
 */
export const isImageFile = (file) => {
  return file.type.startsWith('image/');
};

/**
 * Gets file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validates and compresses image if needed
 * @param {File} file - The file to validate and compress
 * @param {number} maxSize - Maximum file size in bytes (default: 5MB)
 * @param {Function} onProgress - Optional progress callback function
 * @param {boolean} addTimestamp - Whether to add timestamp to filename (default: true)
 * @returns {Promise<{file: File, wasCompressed: boolean, originalSize: string, compressedSize: string, originalName: string}>}
 */
export const validateAndCompressImage = async (file, maxSize = MAX_FILE_SIZE, onProgress = null, addTimestamp = true) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!isImageFile(file)) {
    throw new Error('File is not an image');
  }

  const originalSize = file.size;
  const originalSizeFormatted = formatFileSize(originalSize);
  const originalName = file.name;

  if (originalSize <= maxSize) {
    return {
      file,
      wasCompressed: false,
      originalSize: originalSizeFormatted,
      compressedSize: originalSizeFormatted,
      originalName: originalName,
    };
  }

  try {
    const compressedFile = await compressImage(file, maxSize, onProgress, addTimestamp);
    const compressedSizeFormatted = formatFileSize(compressedFile.size);

    return {
      file: compressedFile,
      wasCompressed: true,
      originalSize: originalSizeFormatted,
      compressedSize: compressedSizeFormatted,
      originalName: originalName,
    };
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error(`Failed to compress image: ${error.message}`);
  }
};

/**
 * Advanced compression with custom options
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {boolean} addTimestamp - Whether to add timestamp to filename (default: true)
 * @returns {Promise<File>} - Compressed file
 */
export const compressImageWithOptions = async (file, options = {}, addTimestamp = true) => {
  const defaultOptions = {
    maxSizeMB: 5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    preserveExif: false,
    fileType: file.type,
    initialQuality: 0.8,
    alwaysKeepResolution: false
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const compressedFile = await imageCompression(file, finalOptions);
    
    // Add timestamp to filename if requested
    if (addTimestamp) {
      const timestampedName = generateTimestampedFileName(file.name, 'compressed');
      return new File([compressedFile], timestampedName, {
        type: compressedFile.type,
        lastModified: Date.now(),
      });
    }
    
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error(`Failed to compress image: ${error.message}`);
  }
};

/**
 * Get compression progress callback function
 * @param {Function} onProgressUpdate - Function to call with progress updates
 * @returns {Function} - Progress callback function
 */
export const createProgressCallback = (onProgressUpdate) => {
  return (progress) => {
    if (onProgressUpdate && typeof onProgressUpdate === 'function') {
      onProgressUpdate(progress);
    }
  };
}; 