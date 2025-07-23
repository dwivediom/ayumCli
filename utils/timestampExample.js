/**
 * Example demonstrating timestamp functionality for image compression
 */

import { generateTimestampedFileName, validateAndCompressImage } from './imageCompression';

// Example usage of timestamp generation
export const demonstrateTimestamping = () => {
  console.log('=== Timestamp Generation Examples ===');
  
  // Basic timestamp
  console.log('Basic:', generateTimestampedFileName('photo.jpg'));
  // Output: photo_2024-01-15_10-30-45-123Z.jpg
  
  // With suffix
  console.log('With suffix:', generateTimestampedFileName('document.pdf', 'compressed'));
  // Output: document_2024-01-15_10-30-45-123Z_compressed.pdf
  
  // Complex filename
  console.log('Complex:', generateTimestampedFileName('my-vacation-photo-2023.jpg', 'optimized'));
  // Output: my-vacation-photo-2023_2024-01-15_10-30-45-123Z_optimized.jpg
};

// Example of compression with timestamping
export const demonstrateCompressionWithTimestamp = async (file) => {
  console.log('=== Compression with Timestamping ===');
  console.log('Original file:', file.name);
  console.log('Original size:', file.size, 'bytes');
  
  try {
    const result = await validateAndCompressImage(file, undefined, null, true);
    
    console.log('Compression result:');
    console.log('- Was compressed:', result.wasCompressed);
    console.log('- Original name:', result.originalName);
    console.log('- New name:', result.file.name);
    console.log('- Original size:', result.originalSize);
    console.log('- Compressed size:', result.compressedSize);
    
    return result;
  } catch (error) {
    console.error('Compression failed:', error);
    throw error;
  }
};

// Example of different timestamp formats
export const showTimestampFormats = () => {
  const now = new Date();
  
  console.log('=== Timestamp Format Examples ===');
  console.log('ISO String:', now.toISOString());
  console.log('Formatted for filename:', now.toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .replace('Z', ''));
};

// Example filename patterns
export const filenamePatterns = {
  original: 'vacation_photo.jpg',
  timestamped: generateTimestampedFileName('vacation_photo.jpg'),
  withSuffix: generateTimestampedFileName('vacation_photo.jpg', 'compressed'),
  withCustomSuffix: generateTimestampedFileName('vacation_photo.jpg', 'optimized_web')
};

export default {
  demonstrateTimestamping,
  demonstrateCompressionWithTimestamp,
  showTimestampFormats,
  filenamePatterns
}; 