const {
  DynamoDBClient,
  DeleteItemCommand,
  ScanCommand,
  BatchWriteItemCommand,
  UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const userId = event.queryStringParameters?.user_id;
  const accountType = event.queryStringParameters?.account_type;

  if (!userId || !accountType) {
    response.statusCode = 400;
    response.body = JSON.stringify({ message: "user_id または account_type が指定されていません。" });
    return response;
  }

  // テーブル名を指定
  const TableName = accountType === 'doctor' ? 'GlucoConnectDoctor' : 'GlucoConnectPatient';

  // DynamoDBの削除パラメータ
  const deleteParam = {
    TableName,
    Key: marshall({
      user_id: userId,
    }),
  };

  try {
    // 医師または患者のレコードを削除
    const deleteCommand = new DeleteItemCommand(deleteParam);
    await client.send(deleteCommand);

    // 連携データの削除
    await deleteRelatedData(userId, accountType);

    response.body = JSON.stringify({ message: `${accountType} アカウントが正常に削除されました。` });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};

// 連携データ削除関数
async function deleteRelatedData(userId, accountType) {
  const relatedTables = {
    patient: ['GlucoConnectArticles', 'GlucoConnectHba1c_Records'],
    doctor: []
  };

  for (const tableName of relatedTables[accountType]) {
    const queryParam = {
      TableName: tableName,
      FilterExpression: "user_id = :uid",
      ExpressionAttributeValues: marshall({
        ":uid": userId,
      }),
    };

    const scanCommand = new ScanCommand(queryParam);
    const scanResult = await client.send(scanCommand);

    if (scanResult.Items.length > 0) {
      const deleteRequests = scanResult.Items.map(item => {
        const key = {
          user_id: item.user_id,
        };
        if (tableName === 'GlucoConnectArticles') {
          key.created_at = item.created_at;
        } else if (tableName === 'GlucoConnectHba1c_Records') {
          key.recorded_at = item.recorded_at;
        }
        return {
          DeleteRequest: {
            Key: marshall(key)
          }
        };
      });

      const batchDeleteParam = {
        RequestItems: {
          [tableName]: deleteRequests
        }
      };

      const batchDeleteCommand = new BatchWriteItemCommand(batchDeleteParam);
      await client.send(batchDeleteCommand);
    }
  }

  // 医師テーブルの場合、患者のdoctor_mapから医師情報を削除
  if (accountType === 'doctor') {
    await removeDoctorFromPatients(userId);
  }

  // 患者テーブルの場合、担当医師のpatient_mapから患者情報を削除
  if (accountType === 'patient') {
    await removePatientFromDoctors(userId);
  }
}

// 医師情報を患者の doctor_map から削除
async function removeDoctorFromPatients(doctorId) {
  const scanParam = {
    TableName: 'GlucoConnectPatient',
    FilterExpression: "contains(doctor_map, :docId)",
    ExpressionAttributeValues: marshall({
      ":docId": doctorId,
    }),
  };

  const scanCommand = new ScanCommand(scanParam);
  const scanResult = await client.send(scanCommand);

  for (const item of scanResult.Items) {
    const patient = unmarshall(item);
    delete patient.doctor_map[doctorId];

    const updateParam = {
      TableName: 'GlucoConnectPatient',
      Key: marshall({ user_id: patient.user_id }),
      UpdateExpression: "SET doctor_map = :updatedMap",
      ExpressionAttributeValues: marshall({
        ":updatedMap": patient.doctor_map,
      }),
    };

    await client.send(new UpdateItemCommand(updateParam));
  }
}

// 患者情報を医師の patient_map から削除
async function removePatientFromDoctors(patientId) {
  const scanParam = {
    TableName: 'GlucoConnectDoctor',
    FilterExpression: "contains(patient_map, :patId)",
    ExpressionAttributeValues: marshall({
      ":patId": patientId,
    }),
  };

  const scanCommand = new ScanCommand(scanParam);
  const scanResult = await client.send(scanCommand);

  for (const item of scanResult.Items) {
    const doctor = unmarshall(item);
    delete doctor.patient_map[patientId];

    const updateParam = {
      TableName: 'GlucoConnectDoctor',
      Key: marshall({ user_id: doctor.user_id }),
      UpdateExpression: "SET patient_map = :updatedMap",
      ExpressionAttributeValues: marshall({
        ":updatedMap": doctor.patient_map,
      }),
    };

    await client.send(new UpdateItemCommand(updateParam));
  }
}