const { Buffer } = require('buffer');
const { GITHUB_LOGIN } = process.env;

module.exports.basicAuthorizer = async (event, context) => {
    const { headers } = event;
    const authorizationHeader = headers.Authorization || headers.authorization;

    if (!authorizationHeader) {
        return generateUnauthorizedResponse();
    }

    const token = authorizationHeader.split(' ')[1];
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');

    if (decodedToken !== GITHUB_LOGIN) {
        return generateUnauthorizedResponse();
    }

    return generateAuthorizedResponse(decodedToken);
};

function generateUnauthorizedResponse(decodedToken) {
    return {
        statusCode: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Authorization Required"',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(decodedToken === GITHUB_LOGIN),
    };
}

function generateAuthorizedResponse(decodedToken) {
    return {
        statusCode: 200,
        username: decodedToken.split('=')[0],
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Authorization'
        },
    };
}