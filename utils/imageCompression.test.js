/**
 * Simple test for image compression utility using browser-image-compression library
 * This can be run in the browser console to test the compression functionality
 */

import { validateAndCompressImage, formatFileSize, isImageFile, compressImageWithOptions, generateTimestampedFileName } from './imageCompression';

// Test function that can be called from browser console
window.testImageCompression = async () => {
  console.log('Testing image compression utility...');
  
  // Test formatFileSize function
  console.log('Testing formatFileSize:');
  console.log('1 byte:', formatFileSize(1));
  console.log('1024 bytes:', formatFileSize(1024));
  console.log('1048576 bytes:', formatFileSize(1048576));
  console.log('5242880 bytes (5MB):', formatFileSize(5242880));
  
  // Test isImageFile function
  console.log('\nTesting isImageFile:');
  const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  console.log('Is image file:', isImageFile(testFile));
  
  const testPdfFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
  console.log('Is PDF file:', isImageFile(testPdfFile));
  
  console.log('\nImage compression utility is ready to use!');
  console.log('To test with a real image, create a file input and call validateAndCompressImage(file)');
  console.log('For advanced compression with custom options, use compressImageWithOptions(file, options)');
  
  // Test timestamp generation
  console.log('\nTesting timestamp generation:');
  console.log('Original: photo.jpg');
  console.log('Timestamped:', generateTimestampedFileName('photo.jpg', 'compressed'));
};

// Example usage for browser console:
/*
// Create a file input
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await validateAndCompressImage(file);
      console.log('Compression result:', result);
    } catch (error) {
      console.error('Compression error:', error);
    }
  }
};
input.click();
*/ 