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

    // const apiRecord = new route53.ARecord(this, 'api-record', {
    //   zone: zone,
    //   recordName: 'api.timeuntilthething.com',
    //   target: route53.RecordTarget.fromValues(
    //     '4nk3msa5v0.execute-api.us-east-1.amazonaws.com'
    //   )
    // })

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
          protocol: s3.RedirectProtocol.HTTPS
        }
      ]
    })

    new route53.ARecord(this, 'AliasRecord', {
      zone,
      recordName: 'timeuntilthething.com',
      target: route53.RecordTarget.fromAlias(
        new targets.BucketWebsiteTarget(siteBucket)
      )
    })
  }
}
