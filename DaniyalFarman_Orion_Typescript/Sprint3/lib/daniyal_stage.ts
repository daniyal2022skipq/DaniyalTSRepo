import { Stack, StackProps, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Sprint3Stack } from "./sprint3-stack";

export class DaniyalFarmanStageStack extends Stage {
    stage: Sprint3Stack;
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);
       //Stages
      this.stage=new Sprint3Stack(this, 'DaniyalFarmanStage')
      
    }//Constructor

}//Class
  