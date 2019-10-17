import cdk = require('@aws-cdk/core')
import dynamodb = require('@aws-cdk/aws-dynamodb')
import apigateway = require('@aws-cdk/aws-apigateway')
import iam = require('@aws-cdk/aws-iam')
import lambda = require('@aws-cdk/aws-lambda')
import path = require('path')
import certManager = require('@aws-cdk/aws-certificatemanager')

export class TuttInfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const certificate = certManager.Certificate.fromCertificateArn(
      this,
      'Certificate',
      process.env.TUTT_CERTIFICATE || ''
    )

    const eventTable = new dynamodb.Table(this, 'tutt-event-table', {
      tableName: 'tutt-event-table',
      partitionKey: { name: 'theThingId', type: dynamodb.AttributeType.STRING },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES
    })

    const tuttLambda = new lambda.Function(this, 'tutt-lambda', {
      functionName: 'tutt-lambda',
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      environment: {
        stackId: id
      }
    })

    tuttLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['dynamodb:GetItem'],
        resources: [eventTable.tableArn]
      })
    )

    const tuttApi = new apigateway.RestApi(this, 'tutt-api')
    const tuttIntegration = new apigateway.LambdaIntegration(tuttLambda)

    tuttApi.root.addMethod('GET', tuttIntegration)

    tuttApi.addDomainName('tutt-api-domain-name', {
      domainName: 'api.timeuntilthething.com',
      certificate: certificate,
      endpointType: apigateway.EndpointType.REGIONAL
    })
  }
}
