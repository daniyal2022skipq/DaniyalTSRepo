import { lambda_layer_awscli, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Sprint1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    const helloWorld= this.create_lambda("HelloWorldLambda","hw_lambda.handler","./resources")
    helloWorld.applyRemovalPolicy(RemovalPolicy.DESTROY)


  }//Contructor Ends Here
  create_lambda(this:any,id:string,handler:string,asset:string)
    {
      return new lambda.Function(this, "DaniyalLambda",{
        code:lambda.Code.fromAsset(asset),
        runtime:lambda.Runtime.NODEJS_12_X,
        handler:handler,
      }
        );


    }
}
