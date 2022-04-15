import { Aws } from "aws-cdk-lib";

const AWS = require('aws-sdk');

export class CloudWatchPublish {
    //Publishing Metric
    publish_data(dimension:any, metric_name: string, metric_value: Number, namespace: string) {

        var cloudWatch = new AWS.CloudWatch();

        let param = {
            MetricData:
                [
                    {
                        'MetricName': metric_name,
                        'Dimensions':dimension,
                        'Value': metric_value,
                    }
                ],
            Namespace: namespace,
        }

        cloudWatch.putMetricData(param, function (err: any, data: any) {
            if (err) console.log(err, err.stack,);
            else console.log("Published metrics", data);
        }
        )
    }

}