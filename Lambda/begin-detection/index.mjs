import {
  DetectFacesCommand,
  RekognitionClient,
  SearchFacesByImageCommand,
  StartFaceSearchCommand,
} from "@aws-sdk/client-rekognition";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"; // ES Modules import
import axios from "axios";
import child_process from "child_process";
import fs from "fs";

const imageExtensions = ["JPEG", "JPG", "PNG", "HEIC"];
const videoExtensions = ["MP4", "WMV", "AVI", "WEBM", "M4V", "CMFV"];
const movExtensions = ["MOV"];

const re = /(?:\.([^.]+))?$/;

function getCredentialObject() {
  return {
    region: process.env.AWS_REGION_LAMBDA,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_LAMBDA,
      secretAccessKey: process.env.AWS_SECRET_KEY_LAMBDA,
    },
  };
}

async function searchFaceSearchImage(key, profileKey) {
  const params = {
    CollectionId: key,
    Image: {
      S3Object: {
        Bucket: process.env.AWS_BUCKET,
        Name: profileKey,
      },
    },
    FaceMatchThreshold: 90,
    NotificationChannel: {
      SNSTopicArn: "",
      RoleArn: "",
    },
  };
  const command = new SearchFacesByImageCommand(params);
  const rekognitionClient = new RekognitionClient(getCredentialObject());
  return rekognitionClient.send(command);
}

async function detectFacesInImage(key) {
  const params = {
    Image: {
      S3Object: {
        Bucket: process.env.AWS_BUCKET,
        Name: key,
      },
    },
    Attributes: ["ALL"],
  };
  const command = new DetectFacesCommand(params);
  const rekognitionClient = new RekognitionClient(getCredentialObject());
  return rekognitionClient.send(command);
}

async function searchFaceSearchVideo(collectionId, key) {
  const params = {
    CollectionId: collectionId,
    Video: {
      S3Object: {
        Bucket: process.env.AWS_BUCKET,
        Name: key,
      },
    },
    FaceMatchThreshold: 90,
    NotificationChannel: {
      SNSTopicArn: "",
      RoleArn: "",
    },
  };
  const command = new StartFaceSearchCommand(params);
  const rekognitionClient = new RekognitionClient(getCredentialObject());
  return rekognitionClient.send(command);
}

function calculateScore(searchData, detectData) {
  const matchedFace = searchData.FaceMatches.find((face) => {
    return face.Similarity > 90;
  });
  if (!matchedFace) {
    return 0;
  }

  const data = detectData.FaceDetails.find((face) => {
    return (
      face.BoundingBox.Height == searchData.SearchedFaceBoundingBox.Height &&
      face.BoundingBox.Left == searchData.SearchedFaceBoundingBox.Left &&
      face.BoundingBox.Top == searchData.SearchedFaceBoundingBox.Top &&
      face.BoundingBox.Width == searchData.SearchedFaceBoundingBox.Width
    );
  });
  let score = 0;
  if (data.Smile.Value) {
    score += data.Smile.Confidence * 3;
  }
  if (data.EyesOpen.Value) {
    score += data.EyesOpen.Confidence;
  }
  if (data.MouthOpen.Value) {
    score += data.MouthOpen.Confidence;
  }
  for (const emotion of data.Emotions) {
    if (emotion.Confidence >= 50) {
      if (["HAPPY"].includes(emotion.Type)) {
        score += emotion.Confidence * 3;
      } else if (["SURPRISED", "ANGRY"].includes(emotion.Type)) {
        score += emotion.Confidence * 2;
      } else {
        score += emotion.Confidence;
      }
    }
  }
  return parseInt(score, 10);
}

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.Records[0].body);
    console.log("*************** BODY ******************");
    console.log(body);
    console.log("*************** BODY ******************");
    for (const element of body) {
      const { key, childId } = element;
      const fileExtension = re.exec(key)[1];
      const collectionId = childId;
      if (imageExtensions.indexOf(fileExtension.toUpperCase()) !== -1) {
        let score = 0;
        console.log("*************** IMAGE ******************", key);
        try {
          const similarity = await searchFaceSearchImage(collectionId, key);
          const faces = await detectFacesInImage(key);
          console.log("************* SCORE *******************");
          score = calculateScore(similarity, faces);
        } catch (error) {
          console.log("************* ERROR *******************");
          console.log(error);
        }
        await updateScore(score, key);
      } else if (videoExtensions.indexOf(fileExtension.toUpperCase()) !== -1) {
        console.log("*************** VIDEO ******************", key);
        const res = await searchFaceSearchVideo(collectionId, key);
        console.log(res);
      } else if (movExtensions.indexOf(fileExtension.toUpperCase()) !== -1) {
        console.log("*************** MOV FILE ******************", key);
        await convertVideo(key, process.env.AWS_BUCKET);
        const res = await searchFaceSearchVideo(collectionId, key);
      }
    }
  } catch (error) {
    console.log("************* ERROR *******************");
    console.log(error);
  }
};

async function updateScore(score, key) {
  try {
    await axios.post(process.env.SCORE_URL, {
      score: score,
      key: key,
    });
  } catch (error) {
    console.log(error);
  }
}

async function convertVideo(key, bucket) {
  try {
    const client = new S3Client(getCredentialObject());
    const outputFilePath = `/tmp/${key.replace(/\.[^.]+$/, "")}.mp4`;
    const inputFilePath = await downloadFile(key, bucket);

    //CONVERT CODEC
    const ffmpegCommand = `/opt/python/ffmpeg -i ${inputFilePath} -c:v libx264 ${outputFilePath}`;
    child_process.execSync(ffmpegCommand);
    const outputData = fs.readFileSync(outputFilePath);

    //WRITE FILE
    const input = {
      // PutObjectRequest
      Body: outputData,
      Bucket: bucket, // required
      Key: key, // required
    };
    const command = new PutObjectCommand(input);
    const response = await client.send(command);
    await fs.promises.unlink(outputFilePath);
    return {
      statusCode: 200,
      body: "File converted to H.264 and stored back to S3",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Error converting file to H.264",
    };
  }
}

function downloadFile(key, bucket) {
  return new Promise(async (resolve, reject) => {
    try {
      const folder = `/tmp/${key.substring(0, key.lastIndexOf("/"))}`;
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      const inputFilePath = `/tmp/${key}`;
      const client = new S3Client(getCredentialObject());
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      const data = await client.send(getCommand);
      const inputStream = data.Body;
      const outputStream = fs.createWriteStream(inputFilePath);
      inputStream.pipe(outputStream);
      outputStream.on("finish", () => {
        resolve(inputFilePath);
      });
    } catch (err) {
      reject(err);
    }
  });
}
