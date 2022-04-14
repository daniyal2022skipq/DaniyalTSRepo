import * as cdk from 'aws-cdk-lib';
import { DaniyalPipeline } from '../lib/pipeline_stack';

//Change
const app = new cdk.App();
new DaniyalPipeline(app, 'DaniyalSprint3Stack', {
    //Environment
    env: { account: '315997497220', region: 'us-east-2' },

});
