import os 
import rasterio as rio
from rasterio.session import AWSSession
from rasterio.windows import Window
import matplotlib
import matplotlib.pyplot as plt 
import json
import boto3
import io

#file = open('sample-sqs-payload.json')
  
# returns JSON object as 
# a dictionary
#responseJson = json.load(file)
  
# Closing file
#file.close()

def lambda_handler(event, context):
    print('ak 09/24 - 1' + str(event))
    print('access key id - '+ os.environ['aws_access_key_id'])
    print('aws_secret_access_key - '+ os.environ['aws_secret_access_key'])
    botosession1 = boto3.Session(aws_access_key_id=os.environ['aws_access_key_id'], aws_secret_access_key=os.environ['aws_secret_access_key'])
    s3 = botosession1.resource('s3')
    for record in event["Records"]:
    #for record in responseJson["Records"]:
        print('record json load is ' + str(record))
        print(str(record["body"]))
        eventBody = json.loads(record["body"])

        s3Location = eventBody['s3Location']
        asdi_url = eventBody['asdi_url']

        #bucketpathsplit = record["body"]["s3Location"].split("//")[1].split("/")
        bucketpathsplit = s3Location.split("//")[1].split("/")
        BUCKET_NAME = bucketpathsplit[0]
        KEY = "/".join(bucketpathsplit[1:])
        print(BUCKET_NAME)
        print(KEY)
        #asdi_url = record["body"]["asdi_url"]
        asdisplittedpath = asdi_url.split("/")
        asdiS3bucket = asdisplittedpath[2]
        print(asdiS3bucket)
        asdiS3key = "/".join(asdisplittedpath[3:])
        print(asdiS3key)
        imagename = asdisplittedpath[-4]+"-"+asdisplittedpath[-3]+"-"+asdisplittedpath[-2]+'.png'
        print(imagename)

        urlB04 = asdiS3bucket + asdiS3key + "/B04.jp2"
        urlB08 = asdiS3bucket + asdiS3key + "/B08.jp2"
        print('urlB04 = ' + urlB04)
        print('urlB08 = ' + urlB08)
        s3.meta.client.download_file(asdiS3bucket, asdiS3key+"/B04.jp2", '/tmp/B04.jp2', {'RequestPayer':'requester'})
        print('B04 file download  done')
        s3.meta.client.download_file(asdiS3bucket, asdiS3key+"/B08.jp2", '/tmp/B08.jp2', {'RequestPayer':'requester'})
        print('B08 file download  done')
        with rio.open("/tmp/B04.jp2") as src1:
            redfloat = src1.read().astype(float)
        with rio.open("/tmp/B08.jp2") as src2:
            nirfloat = src2.read().astype(float)
        print('complete reading')
        ndvi = (nirfloat-redfloat)/(nirfloat+redfloat)

        print('before plt.figure')
        fig = plt.figure(figsize=(10,10),num=1, clear=True)
        ax = ax = fig.add_subplot(111)
        cbar_plot = ax.imshow(ndvi.squeeze(), cmap=plt.cm.RdYlGn , vmin=-1, vmax=1)
        ax.axis('off')
        img_data = io.BytesIO()
        fig.savefig(img_data, dpi=50, bbox_inches='tight', pad_inches=0, format='png')
        img_data.seek(0)
        print('before plt.figure')
        
        s3obj = boto3.client('s3')
        print('after the bucket')
        s3obj.put_object(Body=img_data, Bucket=BUCKET_NAME, Key=KEY+"/"+imagename)
        print('all done')

test = {
  "Records": [
    {
      "messageId": "8d4cd6c0-3f89-48bb-b871-69c5de0605fb",
      "receiptHandle": "AQEBRmu6vqdwGWy3/96OqjmmEF9ptxC6f0Xjzwc8Ff/VeEZSAKa7vr7YhT1LYo1Xkt0+TYHSFyqvdvK4pzy/iMAT/EthxxwGfRIeGWlLEc+QYINm81/AcRtakVZNTSPayBvOH8Wqxuuh3DwXaSUP/4OruIHl54NwyTfbnH2ch665dds5Rn5HoV+R/ai9YGzPQG3vZj9p69Jp0gMQCGp+9dzfNvlzLqGWEhpVS4lB8cIAN/HmSnpVh4j4OvrBZfamLFB1OOAbtbKw+UmgDWLwuP/rm9IMwNBvtIRAFpmbnCyljf/XGm7DA/aMQtXG7YpeD+5GRUoW8YfNQROBLRHuPom3e2jnfRySvPHu806bS6bo0vYytDgvJ8nhasVqCuz+uK2y",
      "body": {
        "s3Location": "s3://reinventworkshopsus201/output/--121.64-39.68--121.68-39.72",
        "asdi_url": "s3://sentinel-s2-l1c/tiles/10/S/FJ/2019/11/1/0"
      },
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1663715366287",
        "SenderId": "AROA45AWVOSIT4UL6MED6:sustainability",
        "ApproximateFirstReceiveTimestamp": "1663715366298"
      },
      "messageAttributes": {},
      "md5OfBody": "fd56fb4eaa13cbf799eff7fa1e6dcdfa",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-west-2:886958290065:susty",
      "awsRegion": "us-west-2"
    },
    {
      "messageId": "726c9144-7547-4331-b3fc-c8b3345a94ca",
      "receiptHandle": "AQEBJLs3Pqi9ybU7cf5Ts/vr79/elsEdjZqWR0p8zAXoBbMl+MlxZqCH8hvgeY2TZ5dOKcVKJMyKgMjjHng7CaelYg2yasJ7TlPQUExBAiqJMGimZZXFqykHsBk2TrU0MMdTeSTUdG5USL0+l27kZm1/WjxGH9Db9fOhw2UGIswjSEipoN47oZzvanlvJRah6i9gYgkk4GJEb+G5KCLWOTUbXOveUebmKTefHZWe3Uwa9ZIoWT2PyaTkfmomf1Ts1w7KZ3GMbvsM4xkWALNUoCpiFcAVi8dfWqDmnmYzvTYEfwr0c3OL1ZcZbpXrYPMgpcJ/iCYKNgv8Zp2hI2ltxiTbwZcZ54uxuOwGw0JbIgXco4NI1pFwTlK+e1FBk+YVpjGa",
      "body": {
        "s3Location": "s3://reinventworkshopsus201/output/--121.64-39.68--121.68-39.72",
        "asdi_url": "s3://sentinel-s2-l1c/tiles/10/T/FK/2019/8/23/0"
      },
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1663715366319",
        "SenderId": "AROA45AWVOSIT4UL6MED6:sustainability",
        "ApproximateFirstReceiveTimestamp": "1663715366320"
      },
      "messageAttributes": {},
      "md5OfBody": "25198c1ab5fe4bb3519411b016f39fd7",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-west-2:886958290065:susty",
      "awsRegion": "us-west-2"
    }
  ]
}
#lambda_handler(test,{})