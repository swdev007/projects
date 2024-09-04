
import json
import os
import uuid
from urllib.parse import unquote,unquote_plus
import boto3

VALID_VIDEO_EXT = ["mp4", "MOV", "flv", "ogv", "mov", 'mkv']
VALID_PHOTO_EXT = ["png", "jpeg", "jpg", "heic"]


def lambda_handler(event, context):
    event = event['Records']
    for event_obj in event:
        bucket_name = event_obj['s3']['bucket']['name']
        file_obj =event_obj['s3']['object']['key']
        obj_ext = file_obj.split(".")[-1]
        obj_name = unquote(file_obj[:len(file_obj) - (len(obj_ext) + 1)].replace("+", " "))
        aws_file_path = "thumbnails/" + obj_name + ".jpeg"
        tmp_video_path = "/tmp/" + str(uuid.uuid1()) + ".{}".format(obj_ext)
        thumbnail_file = "/tmp/" + str(uuid.uuid1()) + ".jpeg"
        s3 = boto3.client('s3')
        s3.download_file(bucket_name, obj_name + "." + obj_ext, tmp_video_path)

        if obj_ext in VALID_VIDEO_EXT:
            os.system(
                "yes | /opt/python/ffmpeg -i " + tmp_video_path + " -ss 00:00:01.000 -vframes 1 " + thumbnail_file)
            try:
                s3.upload_file(thumbnail_file, bucket_name, aws_file_path)
                print("Thumbnail created successfully")
            except Exception as e:
                print("error while uploading thumbnail to bucket")
                print("error:-----",e)
            os.remove(tmp_video_path)
            os.remove(thumbnail_file)
        else if obj_ext in VALID_PHOTO_EXT:
            os.system(
                "yes | /opt/python/ffmpeg -i " + tmp_video_path + " -vf scale=320:240 " + thumbnail_file)
            try:
                s3.upload_file(thumbnail_file, bucket_name, aws_file_path)
                print("Thumbnail created successfully")
            except Exception as e:
                print("error while uploading thumbnail to bucket")
                print("error:-----",e)

            os.remove(tmp_video_path)
            os.remove(thumbnail_file)
        
    return {
        'statusCode': 200,
        'body': "Ok."
    }