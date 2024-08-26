const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const crypto = require('crypto');

const client = new DynamoDBClient({ region: "ap-northeast-1" });

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "" }),
    };

    const body = event.body ? JSON.parse(event.body) : null;
    if (!body || !body.user_id || !body.password || !body.username || !body.account_type) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "無効なリクエストです。リクエストボディに必須パラメータが不足しています。",
        });
        return response;
    }

    const userId = body.user_id;
    const username = body.username;
    const password = body.password;
    const accountType = body.account_type;

    // パスワードのハッシュ化
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    let params;

    if (accountType === 'patient') {
        const hba1cValue = body.hba1c_value || null;
        params = {
            TableName: "GlucoConnectPatient",
            Item: marshall({
                user_id: userId,
                username: username,
                password: hashedPassword,
                hba1c_value: hba1cValue,
                doctor_map: {},
            }),
        };
    } else if (accountType === 'doctor') {
        const category = body.category || null;
        params = {
            TableName: "GlucoConnectDoctors",
            Item: marshall({
                user_id: userId,
                username: username,
                password: hashedPassword,
                category: category,
                patient_map: {},
            }),
        };
    } else {
        response.statusCode = 400;
        response.body = JSON.stringify({ message: "アカウントタイプが無効です。" });
        return response;
    }

    try {
        const command = new PutItemCommand(params);
        await client.send(command);
        
        // 正常にユーザーが作成された場合のレスポンス
        response.statusCode = 201;
        response.body = JSON.stringify({
            message: "ユーザーが正常に作成されました。",
            user_id: userId,
            accountType: accountType,
            token: "mtitoken"
        });
    } catch (e) {
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "ユーザー作成中にエラーが発生しました。",
            errorDetail: e.toString(),
        });
    }

    return response;
};