import cdk = require('@aws-cdk/core')
import route53 = require('@aws-cdk/aws-route53')
import s3 = require('@aws-cdk/aws-s3')
import targets = require('@aws-cdk/aws-route53-targets')
import apigateway = require('@aws-cdk/aws-apigateway')

export class TuttSharedStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const zone = route53.HostedZone.fromLookup(this, 'tutt-hosted-zone', {
      domainName: 'timeuntilthething.com'
    })

    const siteBucket = new s3.Bucket(this, 'timeuntilthething.com', {
      bucketName: 'timeuntilthething.com',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true
    })

    const wwwBucket = new s3.Bucket(this, 'www.timeuntilthething.com', {
      bucketName: 'www.timeuntilthething.com',
      websiteIndexDocument: 'index.html',
      websiteRoutingRules: [
        {
          hostName: 'timeuntilthething.com',
          httpRedirectCode: '302',
          protocol: s3.RedirectProtocol.HTTP
        }
      ]
    })

    new route53.ARecord(this, 'non-www-tutt', {
      zone,
      recordName: 'timeuntilthething.com',
      target: route53.RecordTarget.fromAlias(
        new targets.BucketWebsiteTarget(siteBucket)
      )
    })

    new route53.ARecord(this, 'www-tutt', {
      zone,
      recordName: 'www.timeuntilthething.com',
      target: route53.RecordTarget.fromAlias(
        new targets.BucketWebsiteTarget(wwwBucket)
      )
    })
  }
}
