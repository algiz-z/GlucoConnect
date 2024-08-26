const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "GlucoConnectArticles";

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
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

  // クエリパラメータから DynamoDB Query 用のパラメータを生成
  const { userId, year, month } = event.queryStringParameters || {};

  // userId, year, monthが提供されていない場合はエラーを返す
  if (!userId || !year || !month) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "userId, year, または monthが指定されていません。",
    });
    return response;
  }

  // 指定された月の初日と最終日をタイムスタンプで計算
  const startDate = new Date(year, month - 1, 1); // 月は0始まりのため、-1する
  const endDate = new Date(year, month, 0); // 翌月の0日 = 指定月の最終日

  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime() + 86399999; // 最終日の23:59:59

  const queryParam = {
    TableName,
    KeyConditionExpression: "user_id = :uid AND created_at BETWEEN :start AND :end",
    ExpressionAttributeValues: marshall({
      ":uid": userId,
      ":start": startTimestamp,
      ":end": endTimestamp,
    }),
  };

  try {
    const result = await client.send(new QueryCommand(queryParam));
    const articles = result.Items.map((item) => unmarshall(item));

    response.body = JSON.stringify({ articles });
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};