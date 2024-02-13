# Workable Scraper Job

Create a Cloud Run job to output Workable job board entries into a .json file.


# Clone repo via shell
```sh
git clone https://github.com/account/repo.git
```

# Setup gcloud 
```sh
PROJECT_ID=$PROJECT_ID
REGION=australia-southeast1
gcloud config set core/project $PROJECT_ID
```

# Enable APIs
```sh
gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com
```

# CD into project dir
```sh
cd $PROJECT_ID
```

# Create service account
```sh
gcloud iam service-accounts create workablescraper-sa --display-name="Workable Scraper service account"
```

# Give service account access
```sh
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --role roles/storage.admin \
  --member serviceAccount:workablescraper-sa@$PROJECT_ID.iam.gserviceaccount.com
```

# Create Cloud Run Job
```sh
gcloud beta run jobs deploy workablescraper \
  --source=. \
  --args="https://apply.workable.com/auror" \
  --args="https://apply.workable.com/fergus" \
  --tasks=2 \
  --task-timeout=5m \
  --region=australia-southeast1 \
  --set-env-vars=BUCKET_NAME=workable-scraper \
  --service-account=workablescraper-sa@$PROJECT_ID.iam.gserviceaccount.com
```

# Run Cloud Run Job
```sh
gcloud run jobs execute workablescraper --region=australia-southeast1
```

# Update Job 
```sh
gcloud run jobs update workablescraper \
  --args="https://apply.workable.com/$BOARD_NAME1" \
  --args="https://apply.workable.com/$BOARD_NAME2" \
  --region=australia-southeast1 \
  --tasks=2
```