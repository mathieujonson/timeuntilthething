import cdk = require('@aws-cdk/core')
import dynamodb = require('@aws-cdk/aws-dynamodb')

export class TuttInfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const eventTable = new dynamodb.Table(this, 'tutt-event-table', {
      tableName: 'tutt-event-table',
      partitionKey: { name: 'theThingId', type: dynamodb.AttributeType.STRING },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES
    })
  }
}
