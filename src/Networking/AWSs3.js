import AWS from 'aws-sdk';

const identityPoolId = { IdentityPoolId: 'us-east-1:63b7c5c5-dd01-4ccd-9183-dc1284e1eb32' };
const region = 'us-east-1';
const imagesBucket = { Bucket: 'wordcraft-images' };

AWS.config.region = region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolId);

const s3 = new AWS.S3();

const queryBucket = (bucket) => {
  return s3.listObjects(bucket, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }
  })
};

const query = (params) => {
  return s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }
  })
};

const AWSs3 = {
  imageObjects: () => {
    return queryBucket(imagesBucket);
  },

  object: (params) => {
    return query(params);
  }
};

export default AWSs3;
