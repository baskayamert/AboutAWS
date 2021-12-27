'use strict'

const AWS = require('aws-sdk');

AWS.config.update({region : "us-east-2"});

exports.handler = function (event, context, callback) {
    const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08"});
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    const params = {
        TableName: "ExampleUsers",
        Key: {
            id: "12345"  //get rid of "S" => id : "12345"
        }
    }
    
    documentClient.get(params, (err, data) => {
        if(err) {
            console.log(err);
        }
        console.log(data);
    });
 
}
