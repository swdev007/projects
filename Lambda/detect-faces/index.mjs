import {
  GetFaceDetectionCommand,
  RekognitionClient,
} from "@aws-sdk/client-rekognition";
import axios from 'axios';

function getCredentialObject() {
  return {
    region: process.env.AWS_REGION_LAMBDA,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_LAMBDA,
      secretAccessKey: process.env.AWS_SECRET_KEY_LAMBDA,
    },
  };
}

function getFaceDetection(jobId) {
  const params = {
    JobId: jobId,
  };
  const command = new GetFaceDetectionCommand(params);
  const rekognitionClient = new RekognitionClient(getCredentialObject());
  return rekognitionClient.send(command);
}


function processVideos(detectData) {
  function calculateScore(data) {
    let score = 0;
    console.log(data);
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
      // score += emotion.Confidence;
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
    return score;
  }
  
  let bestTime = 0;
  let bestScore = 0;

  detectData?.Faces?.forEach((face) => {
    if (calculateScore(face.Face) > bestScore) {
      bestScore = calculateScore(face.Face);
      bestTime =  face.Timestamp;
    }
  });
  return { bestScore, bestTime };
}


export const handler = async (event) => {
    console.log("****************************")
    console.log(event?.Records?.[0]?.Sns);
    console.log("****************************")
  const data = JSON.parse(event?.Records?.[0]?.Sns?.Message);
  if (data.Status != "SUCCEEDED") {
    console.log("********* failed *************")
  } else {
    const res = await getFaceDetection(data.JobId);
    const { bestScore, bestTime } = processVideos(res);
    await updateScore(bestScore, bestTime, data.Video.S3ObjectName)
  }
};



async function updateScore(score, time, key){
  try{
    await axios.post(process.env.SCORE_URL, {
      score: score,
      key: key,
      time: time,
    })
  }catch(error){
    console.log(error);
  }
}


