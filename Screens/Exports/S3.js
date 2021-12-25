import {S3} from 'aws-sdk'
import {decode} from 'base64-arraybuffer'
import * as fs from 'expo-file-system';

const bucketname = "taiq-images"

// https://taiq-images.s3.ap-south-1.amazonaws.com/test/eggy-nontransparent.png

export const s3URL = "https://"+ bucketname+ ".s3.ap-south-1.amazonaws.com/"
export const s3BucketName = bucketname

export const s3bucket = new S3({
  accessKeyId: "AKIAUJDNJ6GZAE7PEMC4",
  secretAccessKey: "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",
  Bucket: bucketname,
  signatureVersion: 'v4',
});


export const uploadImageOnS3 = async (name,uri) => {
       console.log("Reached S3 function")
       let contentType = 'image/jpeg';
       let contentDeposition = 'inline;filename="' + name + '"';
       const base641 = await fs.readAsStringAsync(uri, {encoding : fs.EncodingType.Base64});
       const arrayBuffer = decode(base641)
       s3bucket.createBucket(() => {
           console.log("Reached create bucket S3 function")
           const params = {
               Bucket: s3BucketName,
               Key: name,
               Body: arrayBuffer,
               ContentDisposition: contentDeposition,
               ContentType: contentType,
       };
       s3bucket.upload(params, (err, data) => {
           if (err) {
               console.log(err);
           }
           });
       });
   };
   
