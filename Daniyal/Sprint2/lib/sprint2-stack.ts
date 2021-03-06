import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as c from '../resources/constant';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as cw_actions from 'aws-cdk-lib/aws-cloudwatch-actions'; 


export class Sprint2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    //Making S3_Bucket To Store Constant File
    const daniyal_bucket = new s3.Bucket(this, 'DaniyalFirstBucket',{
      autoDeleteObjects:true,
      publicReadAccess:true,
      removalPolicy:RemovalPolicy.DESTROY,

    });
    const deploy=new s3deploy.BucketDeployment(this, 'Daniyal_S3', {
      sources: [s3deploy.Source.asset('./resources',{
        exclude:['cloud_watch.ts','cloud_watch.js','cloud_watch.d.ts','web_health.ts','web_health.js','web_health.d.ts','constant.js','constant.d.ts'

      ]},)],
      destinationBucket: daniyal_bucket,
      retainOnDelete:false,
    });    


    //Making Layers To Perform Axios
    const layer = new lambda.LayerVersion(this, 'MyLayer', {
      removalPolicy: RemovalPolicy.RETAIN,
      code: lambda.Code.fromAsset("layer"),
    });

    //Calling Lambda Role
    let role = this.create_lambda_role();

    //Calling Lambda Function
    const web_Health = this.create_lambda("DaniyalWebHealthLambda", "web_health.handler", "./resources", layer, role);

    //Lambda RemovalPolicy
    web_Health.applyRemovalPolicy(RemovalPolicy.DESTROY)
    //Giving Read Write Access Of S3 Bucket To Our Lambda function
    daniyal_bucket.grantReadWrite(web_Health);

    //Making Rule For Cron Job
    const rule = new Rule(this, 'ScheduleRule', {
      schedule: Schedule.cron({ minute: '1', hour: '0' }),
      targets: [new targets.LambdaFunction(web_Health)],
    });

    //Making SNS Topic
    const daniyalSNS=new sns.Topic(this,'DaniyalSNSTopic');

    daniyalSNS.addSubscription(new subscriptions.EmailSubscription('daniyal.farman.skipq@gmail.com'));

    //Initializing loops to generate alarms on metrics
    for (let url = 0; url < c.URL_TO_MONITOR.length; url++) {
      let dimensions = {'URL': c.URL_TO_MONITOR[url]};

      let availability_metric = new cloudwatch.Metric({
        metricName: c.METRIC_NAME_AVAILABILITY + c.URL_TO_MONITOR[url],
        namespace: c.NAMESPACE,
        dimensionsMap: dimensions,
        period: Duration.minutes(5),
      });

      let latency_metric = new cloudwatch.Metric({
        metricName: c.METRIC_NAME_LATENCY + c.URL_TO_MONITOR[url],
        namespace: c.NAMESPACE,
        dimensionsMap: dimensions,
        period: Duration.minutes(5),
      });

      let availability_alarm = new cloudwatch.Alarm(this, id = 'DaniyalAvailabilityAlarm' + c.URL_TO_MONITOR[url], {
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        threshold: 1,
        evaluationPeriods: 1,
        metric: availability_metric,
      });

      //Adding alarm on availability metircs
       availability_alarm.addAlarmAction(new cw_actions.SnsAction(daniyalSNS));

      let latency_alarm = new cloudwatch.Alarm(this, id = "DaniyalLatency_Alarm" + c.URL_TO_MONITOR[url], {
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        threshold: 1,
        evaluationPeriods: 1,
        metric: latency_metric,
      });

      // Adding alarms on latency metrics
      latency_alarm.addAlarmAction(new cw_actions.SnsAction(daniyalSNS));

    }//Loop Ends Here


  }//Constructor Ends Here

  create_lambda_role(this: any) {
    let lambda_role = new iam.Role(this, "DaniRole", {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'),]
    });
    return lambda_role;

  }


  create_lambda(this: any, id: string, handler: string, asset: string, layer: any, role: any) {
    return new lambda.Function(this, "DaniyalWebHealthLambda", {
      code: lambda.Code.fromAsset(asset),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: handler,
      layers: [layer],
      role: role,
    }
    );


  }//Lambda Fucntion Ends Here

}//Class Ends Here

