#!/usr/bin/env node
import 'source-map-support/register'
import { TuttInfrastructureStack } from '../lib/tutt-infrastructure-stack'
import cdk = require('@aws-cdk/core')

const app = new cdk.App()

const eastStack = new TuttInfrastructureStack(
  app,
  'TuttInfrastructureStackEast',
  {
    env: {
      account: '185124521435',
      region: 'us-east-1'
    }
  }
)

cdk.Tag.add(eastStack, 'project', 'timeuntilthething')

const westStack = new TuttInfrastructureStack(
  app,
  'TuttInfrastructureStackWest',
  {
    env: {
      account: '185124521435',
      region: 'us-west-2'
    }
  }
)

cdk.Tag.add(westStack, 'project', 'timeuntilthething')
