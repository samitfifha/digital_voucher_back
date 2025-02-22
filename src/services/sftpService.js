// sftpService.js
import SftpClient from 'ssh2-sftp-client';

const sftp = new SftpClient();

/**
 * Upload a file to a remote server via SFTP
 * @param {string} localFilePath - Path to the local file to upload
 * @param {string} remoteFilePath - Path to the remote file (including filename)
 * @param {object} sftpConfig - SFTP connection configuration
 * @returns {Promise<void>}
 */
export const uploadFileViaSftp = async (localFilePath, remoteFilePath, sftpConfig) => {
  try {
    // Connect to the SFTP server
    await sftp.connect(sftpConfig);

    // Upload the file
    await sftp.put(localFilePath, remoteFilePath);
    console.log(`File uploaded successfully to ${remoteFilePath}`);
  } catch (error) {
    console.error('Error uploading file via SFTP:', error);
    throw new Error(`Failed to upload file via SFTP: ${error.message}`);
  } finally {
    // Close the SFTP connection
    await sftp.end();
  }
};