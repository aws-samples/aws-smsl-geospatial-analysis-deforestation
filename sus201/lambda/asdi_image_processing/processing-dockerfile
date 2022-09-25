FROM public.ecr.aws/lambda/python:3.8

COPY processing-requirements.txt ./
RUN pip install -r processing-requirements.txt 

COPY processing.py   ./
CMD ["processing.lambda_handler"]

#COPY requirements.txt ./
#RUN pip install -r requirements.txt 
