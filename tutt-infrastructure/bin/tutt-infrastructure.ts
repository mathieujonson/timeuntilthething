#!/usr/bin/env node
import { App, Tags } from '@aws-cdk/core'
import 'source-map-support/register'
import { TuttInfrastructureStack } from '../lib/tutt-infrastructure-stack'
import { TuttSharedStack } from '../lib/tutt-shared-stack'

const app = new App()

const eastStack = new TuttInfrastructureStack(
  app,
  'TuttInfrastructureStackEast',
  {
    env: {
      account: '185124521435',
      region: 'us-east-1',
    },
  }
)

Tags.of(eastStack).add('project', 'timeuntilthething')

const westStack = new TuttInfrastructureStack(
  app,
  'TuttInfrastructureStackWest',
  {
    env: {
      account: '185124521435',
      region: 'us-west-2',
    },
  }
)

Tags.of(westStack).add('project', 'timeuntilthething')

const sharedStack = new TuttSharedStack(app, 'TuttSharedStack', {
  env: {
    account: '185124521435',
    region: 'us-east-1',
  },
})

Tags.of(sharedStack).add('project', 'timeuntilthething')
