const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient({ region: 'ap-northeast-1' });
const TableName = 'GlucoConnectArticles';

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: "" }),
  };

  // Authorization ヘッダのバリデーション
  if (event.headers.authorization !== 'mtitoken') {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: '認証されていません。HeaderにTokenを指定してください',
    });
    return response;
  }

  try {
    // イベントからリクエストボディを取得し、JSONとしてパース
    const body = JSON.parse(event.body);

    // DynamoDBに保存するためのパラメータを準備
    const articleItem = {
      user_id: body.user_id,
      created_at: body.created_at, // ミリ秒単位のタイムスタンプ
      post_type: body.post_type,
      content: body.content,
      medicine_score: body.medicine_score || 0,
      picture: body.imageSrc || '',
      special: body.medicine_name || '',
    };

    const command = new PutItemCommand({
      TableName,
      Item: marshall(articleItem),
    });

    await client.send(command);

    response.body = JSON.stringify({ message: '記事が正常に保存されました', article: articleItem });
  } catch (error) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: '記事の保存中にエラーが発生しました',
      errorDetail: error.toString(),
    });
  }

  return response;
};