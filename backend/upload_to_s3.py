import boto3
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

def upload_to_s3():
    """Upload large model files to S3"""
    s3 = boto3.client(
        's3',
        region_name=os.getenv('AWS_REGION', 'us-east-1'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
    bucket = os.getenv('S3_BUCKET_NAME', 'medrag-data-bucket')
    
    # Create bucket if doesn't exist
    try:
        s3.create_bucket(Bucket=bucket)
        print(f"✅ Created bucket: {bucket}")
    except s3.exceptions.BucketAlreadyOwnedByYou:
        print(f"✅ Bucket already exists: {bucket}")
    except Exception as e:
        print(f"Bucket creation: {e}")
    
    # Upload files
    files = [
        'models/chunked_ehr_index.faiss',
        'models/patient_chunks.json',
        'models/release_evidences.json'
    ]
    
    for file_path in files:
        if Path(file_path).exists():
            file_name = Path(file_path).name
            print(f"Uploading {file_name}...")
            try:
                s3.upload_file(file_path, bucket, file_name)
                print(f"✅ Uploaded {file_name}")
            except Exception as e:
                print(f"❌ Failed to upload {file_name}: {e}")
        else:
            print(f"⚠️ File not found: {file_path}")

if __name__ == "__main__":
    upload_to_s3()
