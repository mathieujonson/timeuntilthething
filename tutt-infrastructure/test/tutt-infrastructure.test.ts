import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import TuttInfrastructure = require('../lib/tutt-infrastructure-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TuttInfrastructure.TuttInfrastructureStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});