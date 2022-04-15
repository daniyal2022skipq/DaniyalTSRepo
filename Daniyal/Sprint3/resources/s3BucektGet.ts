import AWS = require('aws-sdk');
import { addListener } from 'process';

export class S3GetBucketObJ {

    async s3_getObject(bucket: any, key: any) {
        let s3 = new AWS.S3();
        const params = {
            Bucket: bucket,
            Key: key,
        };
        let variable = await s3.getObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);
        }).promise();



    }//Function Ends Herr
}//Class Ends Here
