import os
import json
import boto3
import datetime
from sentinelhub import (
        CRS,
        BBox,
        WebFeatureService,
        DataCollection,
        SHConfig
    )

def lambda_handler(event, context):

    print("Start date and time: " + str(datetime.datetime.now()))

    print(str(event))
    coordA=event['a']
    coordB=event['b']
    coordC=event['c']
    coordD=event['d']
    startDate=event['startDate']
    endDate=event['endDate']
    
    config = SHConfig()
    
    '''
    Instance ID from from your Sentinel Hub account 
    '''
    config.instance_id = os.environ['instance_id']

    config.aws_access_key_id = os.environ['aws_access_key_id']
    config.aws_secret_access_key = os.environ['aws_secret_access_key']

    if config.instance_id == '':
        print("Warning! To use WFS functionality, please configure the `instance_id`.")
    
    search_bbox = BBox(bbox=[coordA,coordB,coordC,coordD],crs=CRS.WGS84)
    search_time_interval = (startDate, endDate)
    
    wfs_iterator = WebFeatureService(
        search_bbox,
        search_time_interval,
        data_collection=DataCollection.SENTINEL2_L1C,
        maxcc=0.2,
        #maxcc=1.0,
        config=config
    )

    #bands = ['B04.jp2','B08.jp2']
    totalCountToReturn = 4
    tiles = []
    s3_urls = []
    filtered_urls = []

    for tile_info in wfs_iterator:
        tiles.append(tile_info['properties']['path'])

    totalUrlCount = len(tiles)
    if(totalUrlCount < totalCountToReturn):
        filtered_urls = s3_urls
    else:
        breakpoint = int (totalUrlCount/totalCountToReturn)
        for count in range(0,totalUrlCount,breakpoint):
            filtered_urls.append(tiles[count])
            #for band in bands:
                #s3_urls.append(tile_info['properties']['path'] + '/' + band)
                #filtered_urls.append(tiles[count]+ '/' + band)

    sqs = boto3.client('sqs')
    s3Folder = os.environ['s3Bucket'] + '-' + coordA + '-' + coordB + '-' + coordC + '-' + coordD 
    message = {}
    
    for url in filtered_urls:
        message["s3Location"] = s3Folder
        message["asdi_url"] = url
        sqs.send_message(QueueUrl=os.environ['sqs_url'], MessageBody=json.dumps(message))
        print("sent message to sqs" + json.dumps(message) )

    '''
    wr.s3.copy_objects(
        filtered_urls,
        source_path="s3://sentinel-s2-l1c/",
        target_path= "s3://reinvent-susty/source" + '-' + coordA + '-' + coordB + '-' + coordC + '-' + coordD,
        use_threads= True,
        #boto3_session = boto3session,
        #replace_filenames={"tiles/10/T/FK/2018/11/1/0/B04.jp2": "11/1/0/B04.jp2"},
        s3_additional_kwargs={
            "RequestPayer": "requester"
        }
    )
    '''        

    print("End date and time: " + str(datetime.datetime.now()))
    print(filtered_urls)

    return {
        'statusCode': 200,
        'body': json.dumps('Complete')
    }

response=lambda_handler({"a": "-121.64","b": "39.68","c": "-121.68","d": "39.72","startDate": "2018-11-01T00:00:00","endDate": "2019-11-01T23:59:59"},[])
print('response is ' + str(response))
