// Upload image into azure dev studio
const { BlobServiceClient } = require('@azure/storage-blob');

const { AZURE_STORAGE_CONNECTION_STRING, AZURE_STORAGE_CONTAINER_NAME } =
  process.env;

const BlobServiceClientInstance = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = BlobServiceClientInstance.getContainerClient(
  AZURE_STORAGE_CONTAINER_NAME
);

// Create the container if it doesn't exist
const createContainer = async (containerName) => {
  try {
    const exists = await containerClient.exists();
    if (!exists) {
      await containerClient.create();
      console.log(`Container '${containerName}' created successfully.`);
    } else {
      console.log(`Container '${containerName}' already exists.`);
    }
   } catch(error) {
    console.log('error', error)
    throw error;
  }
};

// Upload image into azure dev studio
const uploadImage = async (fileBuffer, blobName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    // Upload data to the blob
    return await blockBlobClient.upload(
      fileBuffer,
      fileBuffer.length
    );
  } catch (error) {
    console.log('error upload image utils', error);
    throw new Error(error.message);
  }
};

// Download file from azure dev studio
const downloadImage = async (blobName) => {
  try {
    // Get a block blob client
    const blobClient = containerClient.getBlobClient(blobName);
    // Download blob content
    const downloadBlockBlobResponse = await blobClient.download();
    // Convert body stream to a buffer
    const content = await streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody
    );
    // return data
    return {
      blobName: blobName,
      contentType: downloadBlockBlobResponse.contentType,
      content,
    };
  } catch (error) {
    console.error(`Error downloading file: ${error.message}`);
    throw new Error(error.message);
  }
};

// Helper function to convert a readable stream to a buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}

module.exports = {
  createContainer,
  uploadImage,
  downloadImage,
};
