import targets = require('@aws-cdk/aws-route53-targets')
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from '@aws-cdk/aws-cloudfront'
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53'
import { HttpsRedirect } from '@aws-cdk/aws-route53-patterns'
import { Bucket } from '@aws-cdk/aws-s3'
import { Construct, Stack, StackProps } from '@aws-cdk/core'

export class TuttSharedStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const zone = HostedZone.fromLookup(this, 'tutt-hosted-zone', {
      domainName: 'timeuntilthething.com',
    })

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      'tutt-origin-access-identity'
    )

    const siteBucket = new Bucket(this, 'timeuntilthething.com', {
      bucketName: 'timeuntilthething.com',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'app.html',
    })

    siteBucket.grantRead(originAccessIdentity)

    const siteDistribution = new CloudFrontWebDistribution(
      this,
      'tutt-cloudfront-distribution',
      {
        originConfigs: [
          {
            behaviors: [{ isDefaultBehavior: true }],
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity,
            },
          },
        ],
        aliasConfiguration: {
          names: ['timeuntilthething.com'],
          acmCertRef:
            'arn:aws:acm:us-east-1:185124521435:certificate/cd6946bc-cf42-42f1-b771-c1513fe37bcd',
        },
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: '/app.html',
          },
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/app.html',
          },
        ],
      }
    )

    new ARecord(this, 'non-www-tutt', {
      zone,
      recordName: 'timeuntilthething.com',
      target: RecordTarget.fromAlias(
        new targets.CloudFrontTarget(siteDistribution)
      ),
    })

    new HttpsRedirect(this, 'www-tutt-redirect', {
      recordNames: ['www.timeuntilthething.com'],
      targetDomain: 'timeuntilthething.com',
      zone,
    })
  }
}
