import os 
import rasterio as rio
from rasterio.session import AWSSession
from rasterio.windows import Window
import matplotlib
import matplotlib.pyplot as plt 
import json
import boto3
import io

def lambda_handler(event, context):
    print('Event - ' + str(event))
    botosession = boto3.Session()
    s3 = botosession.resource('s3')
    for record in event["Records"]:
    #for record in responseJson["Records"]:
        print('record json load is ' + str(record))
        print(str(record["body"]))
        #eventBody = json.loads(str(record["body"]))
        eventBody = record["body"]

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
        imagename = asdisplittedpath[-4]+asdisplittedpath[-3]+asdisplittedpath[-2]+'.png'
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
        
        bucket = s3.Bucket(BUCKET_NAME)
        print('after the bucket')
        bucket.put_object(Body=img_data, ContentType='image/png', Key=KEY+"/"+imagename)
        print('all done')

