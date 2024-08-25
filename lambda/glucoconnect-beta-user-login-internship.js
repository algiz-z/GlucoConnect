const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
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
    if (!body || !body.user_id || !body.password || !body.account_type) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "無効なリクエストです。リクエストボディに必須パラメータが不足しています。",
        });
        return response;
    }

    const userId = body.user_id;
    const inputPassword = body.password;
    const accountType = body.account_type;

    let tableName = null;

    if (accountType === "patient") {
        tableName = "GlucoConnectPatient";
    } else if (accountType === "doctor") {
        tableName = "GlucoConnectDoctor";
    } else {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "無効なアカウントタイプです。",
        });
        return response;
    }

    try {
        const params = {
            TableName: tableName,
            Key: marshall({ user_id: userId }),
        };

        const command = new GetItemCommand(params);
        const result = await client.send(command);

        if (!result.Item) {
            response.statusCode = 401;
            response.body = JSON.stringify({
                message: "ユーザーが見つかりません。"
            });
            return response;
        }

        const user = unmarshall(result.Item);
        const hashedPassword = crypto.createHash('sha256').update(inputPassword).digest('hex');
        
        if (hashedPassword !== user.password) {
            response.statusCode = 401;
            response.body = JSON.stringify({
                message: "パスワードが一致しません。",
            });
            return response;
        }

        response.statusCode = 200;
        response.body = JSON.stringify({
            message: "ログインに成功しました。",
            user_id: userId,
            accountType: accountType,
            token: "mtitoken"
        });
    } catch (e) {
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "ログイン処理中にエラーが発生しました。",
            errorDetail: e.toString(),
        });
    }

    return response;
};