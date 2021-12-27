'use strict'

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const { name } = event.Records[0].s3.bucket;
    const { key } = event.Records[0].s3.object;

    const params = {
        Bucket : name,
        Key : key
    }

    try {
        const data = await s3.getObject(params).promise();
        const usersStr = data.Body.toString(); // The data coming from the file will be in a buffer object. That's why we stringify
        const usersJSON = JSON.parse(usersStr);
        console.log(`Users ::: ${usersStr}`);    
    } catch (error) {
        console.log(error);
    }
       
}

/////////////////////////////////////////////////////////////////////////

'use strict'

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const documentClient = new AWS.DynamoDB.DocumentClient; // Document Client is basically a service or interface object that lets us talk with DynamoDB

exports.handler = async (event) => {
    let statusCode = 0;
    let responseBody = '';
    const { name } = event.Records[0].s3.bucket;
    const { key } = event.Records[0].s3.object;

    const getObjectParams = {
        Bucket : name,
        Key : key
    }

    try {
        const s3Data = await s3.getObject(getObjectParams).promise();
        const usersStr = s3Data.Body.toString(); // The data coming from the file will be in a buffer object. That's why we stringify
        const usersJSON = JSON.parse(usersStr);
        console.log(`Users ::: ${usersStr}`);
        
        const { id, firstname, lastname } = usersJSON[0];

        const putParams = {
            TableName: "ExampleUsers",
            Item: {
                id: id,
                firstname: firstname,
                lastname: lastname
            }
        };

        const putItemData = await documentClient.put(putParams).promise();
        console.log(putItemData);

        responseBody = 'Succeeded adding users';
        statusCode = 201;
    } catch (error) {
        responseBody = 'Error adding users';
        statusCode = 403;
    }
    
    const response = {
        statusCode: statusCode,
        body: responseBody
    };

    return response;
}

////////////////////////////////////////////////////////////////
'use strict'

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const documentClient = new AWS.DynamoDB.DocumentClient; // Document Client is basically a service or interface object that lets us talk with DynamoDB

exports.handler = async (event) => {
    let statusCode = 0;
    let responseBody = '';
    const { name } = event.Records[0].s3.bucket;
    const { key } = event.Records[0].s3.object;

    const getObjectParams = {
        Bucket : name,
        Key : key
    }

    try {
        const s3Data = await s3.getObject(getObjectParams).promise();
        const usersStr = s3Data.Body.toString(); // The data coming from the file will be in a buffer object. That's why we stringify
        const usersJSON = JSON.parse(usersStr);
        console.log(`Users ::: ${usersStr}`);
        
        await Promise.all(usersJSON.map(async user => {
            const { id, firstname, lastname } = user;
            const putParams = {
                TableName: "Database-Name",
                Item: {
                    id: id,
                    firstname: firstname,
                    lastname: lastname
                }
            };

            await documentClient.put(putParams).promise();
        }));

        responseBody = 'Succeeded adding users';
        statusCode = 201;
    } catch (error) {
        responseBody = 'Error adding users';
        statusCode = 403;
    }
    
    const response = {
        statusCode: statusCode,
        body: responseBody
    };

    return response;
}