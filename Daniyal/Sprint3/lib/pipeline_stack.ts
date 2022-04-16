import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as cdk from 'aws-cdk-lib';
import * as actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { DaniyalFarmanStageStack } from "./daniyal_stage";
import { ManualApprovalAction } from "aws-cdk-lib/aws-codepipeline-actions";

export class DaniyalPipeline extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const source = pipelines.CodePipelineSource.gitHub('daniyal2022skipq/Orion_TS', 'main', {
            authentication: cdk.SecretValue.secretsManager('daniyaltoken'),
            trigger: actions.GitHubTrigger.POLL
        });
        //Synth Pipeline Hello
        const synth = new pipelines.ShellStep('Synth', {
            input: source,
            commands: ['cd Daniyal/Sprint3', 'npm ci', 'npm run build', 'npx cdk synth','cd layer/nodejs','npm install axios'],
            primaryOutputDirectory: 'Daniyal/Sprint3/cdk.out',
        });

        const unitTest = new pipelines.ShellStep('UnitTests', {
            commands: ['cd Daniyal/Sprint3', 'npm ci', 'npm run test']
        });

        const daniyalPipeline = new pipelines.CodePipeline(this, 'DaniPipeline', { synth: synth });

        const beta = new DaniyalFarmanStageStack(this, "BETA");
        const prod = new DaniyalFarmanStageStack(this, "Prod");

        daniyalPipeline.addStage(beta, { pre: [unitTest] });
        daniyalPipeline.addStage(prod, { pre: [new pipelines.ManualApprovalStep('PromoteToProd')], });


    }//Constructor Ends Here




}//Class Ends Here
