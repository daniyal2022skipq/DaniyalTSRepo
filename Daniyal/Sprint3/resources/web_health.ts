import { generateArbitraryIntervals } from "aws-cdk-lib/aws-autoscaling-common";
import { constants } from "os";
const axios = require('axios');
import { CloudWatchPublish } from "./cloud_watch";
import * as c from "./constant";

exports.handler = async function (event: any) {
    let values: any = {}

    //instantiating cloudwatchpublish object
    let cw = new CloudWatchPublish()

    //Initiliazing _Loop
    for (let url = 0; url < c.URL_TO_MONITOR.length; url++) {

        let avail = await getAvailability(c.URL_TO_MONITOR[url]);
        let dimensions = [{
            "Name": "URL",
            "Value": c.URL_TO_MONITOR[url]
        }];

        cw.publish_data(dimensions, c.METRIC_NAME_AVAILABILITY, avail, c.NAMESPACE);

        let latency = await getLatency(c.URL_TO_MONITOR[url]);

        cw.publish_data(dimensions, c.METRIC_NAME_LATENCY, latency, c.NAMESPACE);

        values[c.URL_TO_MONITOR[url]] = { "availability": avail, "latency": latency }
    }
    return values;

}
async function getLatency(url: any) {
    let startTime = new Date().getTime()
    const latency = await axios.get(url);
    let endTime = new Date().getTime()
    let delta = endTime - startTime;
    return delta * 0.001;

}
async function getAvailability(url: any) {
    const avail = await axios.get(url);
    if (avail.status == 200) {
        return 1.0;
    }
    else {
        return 0.0;
    }


}