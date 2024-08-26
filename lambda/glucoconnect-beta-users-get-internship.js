const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
    body: JSON.stringify({ message: "" }),
  };

  // Authorization ヘッダのバリデーション
  if (event.headers.authorization !== "mtitoken") {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "認証されていません。HeaderにTokenを指定してください",
    });
    return response;
  }

  try {
    // DynamoDBのテーブルからすべての患者を取得する
    const params = {
      TableName: "GlucoConnectPatient",
    };

    const command = new ScanCommand(params);
    const result = await client.send(command);

    // DynamoDBから取得したアイテムをJSONオブジェクトに変換し、不要なフィールドを削除
    const patients = result.Items.map((item) => {
      const patient = unmarshall(item);

      // 不要なフィールドを削除
      delete patient.password;
      delete patient.doctor_map;

      return patient;
    });

    // レスポンスに患者データを設定
    response.body = JSON.stringify({ patients });
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "患者リストの取得中にエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};