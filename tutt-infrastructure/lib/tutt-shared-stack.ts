import targets = require('@aws-cdk/aws-route53-targets')
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront'
import {
  ARecord,
  CnameRecord,
  HostedZone,
  RecordTarget,
} from '@aws-cdk/aws-route53'
import { Bucket } from '@aws-cdk/aws-s3'
import { Construct, Stack, StackProps } from '@aws-cdk/core'

export class TuttSharedStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const zone = HostedZone.fromLookup(this, 'tutt-hosted-zone', {
      domainName: 'timeuntilthething.com',
    })

    const siteBucket = new Bucket(this, 'timeuntilthething.com', {
      bucketName: 'timeuntilthething.com',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
    })

    const wwwBucket = new Bucket(this, 'www.timeuntilthething.com', {
      bucketName: 'www.timeuntilthething.com',
      websiteRedirect: {
        hostName: 'timeuntilthething.com',
      },
      publicReadAccess: true,
    })

    const siteDistribution = new CloudFrontWebDistribution(
      this,
      'tutt-cloudfront-distribution',
      {
        originConfigs: [
          {
            behaviors: [{ isDefaultBehavior: true }],
            s3OriginSource: {
              s3BucketSource: siteBucket,
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
            responsePagePath: '/index.html',
          },
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html',
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

    new CnameRecord(this, 'www-tutt', {
      recordName: 'www.timeuntilthething.com',
      domainName: 'timeuntilthething.com',
      zone: zone,
    })
  }
}
