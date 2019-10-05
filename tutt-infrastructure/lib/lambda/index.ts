const AWS = require('aws-sdk')

const DynamoDB = new AWS.DynamoDB.DocumentClient()

exports.handler = async () => {
  const params = {
    TableName: 'tutt-event-table',
    Key: { theThingId: 'thething' }
  }

  return await DynamoDB.get(params)
    .promise()
    .then((data: any, err: any) =>
      err
        ? {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
              success: false,
              message: "Uh oh! Couldn't find the thing!"
            })
          }
        : {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ success: true, date: data.Item.date })
          }
    )
}
