#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Sprint2Stack } from '../lib/sprint2-stack';

const app = new cdk.App();
new Sprint2Stack(app, 'Sprint2Stack', {

});