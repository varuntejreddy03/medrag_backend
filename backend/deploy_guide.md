# AWS Deployment Guide for MedRAG Backend

## Option 1: EC2 + S3 (Recommended for 4.4GB files)

### Step 1: Upload Files to S3
```bash
# Install AWS CLI
pip install awscli boto3

# Configure credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# Create bucket
aws s3 mb s3://medrag-data-bucket

# Upload large files
cd models
aws s3 cp chunked_ehr_index.faiss s3://medrag-data-bucket/
aws s3 cp patient_chunks.json s3://medrag-data-bucket/
aws s3 cp release_evidences.json s3://medrag-data-bucket/
```

### Step 2: Launch EC2 Instance
```bash
# 1. Go to EC2 Console → Launch Instance
# 2. Choose: Ubuntu 22.04 LTS
# 3. Instance type: t3.large (2 vCPU, 8GB RAM) or larger
# 4. Storage: 30GB minimum
# 5. Security Group: Allow ports 22 (SSH), 8000 (API)
# 6. Create/select key pair for SSH access
# 7. Launch instance
```

### Step 3: Connect and Setup EC2
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3-pip python3-venv git -y

# Install Docker (optional)
sudo apt install docker.io -y
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

### Step 4: Deploy Application
```bash
# Clone/upload your code
git clone your-repo-url
# OR use scp to upload
# scp -i your-key.pem -r backend ubuntu@your-ec2-ip:~/

cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt boto3

# Configure environment
nano .env
# Add:
# DATABASE_URL=postgresql://... (your RDS URL)
# S3_BUCKET_NAME=medrag-data-bucket
# GEMINI_API_KEY=your-key
# GMAIL_USER=your-email
# GMAIL_APP_PASSWORD=your-password

# Download models from S3
python3 -c "from s3_loader import download_from_s3; download_from_s3()"

# Run with nohup (background)
nohup uvicorn main:app --host 0.0.0.0 --port 8000 &

# OR use systemd service (recommended)
sudo nano /etc/systemd/system/medrag.service
```

### Step 5: Create Systemd Service
```ini
[Unit]
Description=MedRAG API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/backend
Environment="PATH=/home/ubuntu/backend/venv/bin"
ExecStart=/home/ubuntu/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable medrag
sudo systemctl start medrag
sudo systemctl status medrag
```

### Step 6: Setup Nginx (Optional - for HTTPS)
```bash
sudo apt install nginx certbot python3-certbot-nginx -y

sudo nano /etc/nginx/sites-available/medrag
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/medrag /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## Option 2: AWS Lambda + S3 (Serverless - NOT recommended for 4.4GB)
Lambda has 10GB storage limit and cold start issues with large models.

---

## Option 3: AWS ECS Fargate (Docker Container)

### Step 1: Build and Push Docker Image
```bash
# Install AWS CLI and configure
aws configure

# Create ECR repository
aws ecr create-repository --repository-name medrag-backend

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build image
cd backend
docker build -t medrag-backend .

# Tag and push
docker tag medrag-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/medrag-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/medrag-backend:latest
```

### Step 2: Create ECS Cluster
```bash
# 1. Go to ECS Console → Create Cluster
# 2. Choose: AWS Fargate
# 3. Name: medrag-cluster
# 4. Create
```

### Step 3: Create Task Definition
```json
{
  "family": "medrag-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "8192",
  "containerDefinitions": [{
    "name": "medrag-backend",
    "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/medrag-backend:latest",
    "portMappings": [{"containerPort": 8000}],
    "environment": [
      {"name": "DATABASE_URL", "value": "your-db-url"},
      {"name": "S3_BUCKET_NAME", "value": "medrag-data-bucket"},
      {"name": "GEMINI_API_KEY", "value": "your-key"}
    ]
  }]
}
```

### Step 4: Create Service
```bash
# 1. Go to Cluster → Create Service
# 2. Launch type: Fargate
# 3. Task Definition: medrag-task
# 4. Service name: medrag-service
# 5. Number of tasks: 1
# 6. Configure Load Balancer (Application Load Balancer)
# 7. Create
```

---

## Cost Estimates (Monthly)

### EC2 Option:
- t3.large: ~$60/month
- 30GB EBS: ~$3/month
- S3 storage (5GB): ~$0.12/month
- Data transfer: ~$5-10/month
**Total: ~$70-75/month**

### ECS Fargate:
- 2 vCPU, 8GB RAM: ~$100/month (running 24/7)
- S3 storage: ~$0.12/month
**Total: ~$100/month**

---

## Recommended: EC2 + S3
- Most cost-effective
- Full control
- Easy to debug
- Handles large files well
- Can scale vertically easily

## Quick Start Commands
```bash
# 1. Upload to S3
aws s3 sync models/ s3://medrag-data-bucket/

# 2. Launch EC2 and SSH
ssh -i key.pem ubuntu@ec2-ip

# 3. Setup
git clone repo && cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt boto3
python3 -c "from s3_loader import download_from_s3; download_from_s3()"

# 4. Run
uvicorn main:app --host 0.0.0.0 --port 8000
```
