import AWS from 'aws-sdk';

// Create S3 service object
const s3 = new AWS.S3({
  endpoint: 'instax-bucket.eu-central-1.linodeobjects.com', 
  accessKeyId: process.env.LINODE_ACCESS_KEY,     
  secretAccessKey: process.env.LINODE_SECRET_KEY, 
  region: 'eu-central-1',                            
  s3ForcePathStyle: true,                         
});

const bucketName = 'instax-bucket'; 
export { s3, bucketName };