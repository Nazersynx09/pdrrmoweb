/**
 * Cloudflare R2 Client for File Uploads
 * 
 * Environment Variables Required:
 * - R2_ACCESS_KEY_ID
 * - R2_SECRET_ACCESS_KEY
 * - R2_BUCKET_NAME
 * - R2_ACCOUNT_ID
 * - R2_PUBLIC_URL
 */

export interface R2Config {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  accountId: string;
  publicUrl: string;
}

export function getR2Config(): R2Config {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const accountId = process.env.R2_ACCOUNT_ID;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accessKeyId || !secretAccessKey || !bucketName || !accountId || !publicUrl) {
    throw new Error('Missing R2 configuration. Please set environment variables.');
  }

  return {
    accessKeyId,
    secretAccessKey,
    bucketName,
    accountId,
    publicUrl
  };
}

/**
 * Generate a unique file key for storage
 */
export function generateFileKey(
  category: 'images' | 'documents' | 'maps' | 'resources',
  filename: string
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${category}/${timestamp}-${sanitizedFilename}`;
}

/**
 * Get public URL for a stored file
 */
export function getFileUrl(key: string): string {
  const config = getR2Config();
  return `${config.publicUrl}/${key}`;
}

/**
 * Parse content type from filename
 */
export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const contentTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Text
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    xml: 'application/xml',
    
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
  };

  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Validate file size (max 50MB default)
 */
export function validateFileSize(size: number, maxSizeBytes: number = 50 * 1024 * 1024): boolean {
  return size <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function validateFileType(filename: string, allowedTypes: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return allowedTypes.includes(ext);
}

// Allowed file types by category
export const ALLOWED_FILE_TYPES = {
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
  maps: ['tif', 'tiff', 'png', 'jpg', 'jpeg', 'pdf'],
  resources: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', '7z']
};

/**
 * Generate a presigned URL for upload (client-side upload)
 * Note: For server-side uploads, we'd use @aws-sdk/client-s3
 */
export function getUploadFormData(
  key: string,
  contentType: string
): { url: string; fields: Record<string, string> } {
  const config = getR2Config();
  const uploadUrl = `https://${config.bucketName}.${config.accountId}.r2.cloudflarestorage.com`;
  
  return {
    url: uploadUrl,
    fields: {
      key,
      'Content-Type': contentType
    }
  };
}