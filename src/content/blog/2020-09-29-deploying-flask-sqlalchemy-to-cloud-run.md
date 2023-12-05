---
title: "Connecting Google Cloud Run to Cloud SQL"
publishedDate: 2020-09-29
category: notes
description: Cloud Run is a new GCP service for quickly serving HTTP traffic with containers. This is a guide to connecting your Cloud Run service to Cloud SQL.
---

Cloud Run is a relatively new GCP service that means you can get a container up and serving traffic very quickly. This is just a quick guide to connecting your Cloud Run service to Cloud SQL.

> This post is part of a Practical GCP for Software Engineers tutorial series I've written. If you'd like access to the rest of the content drop me an email on <a href="mailto:me@matthewbrown.io">me@matthewbrown.io</a> :)

Before you start you will need a couple of things before you get started:

- A running Cloud Run service (`$SERVICE_NAME`)
- The service account email you're using for the Cloud Run Service (`$CLOUD_RUN_SERVICE_ACCOUNT_EMAIL`)
- Your project ID (`$GOOGLE_PROJECT_ID`)


<br />

### 1. Create a CloudSQL instance

This a pretty simple step. For this example I'm using a db-f1-micro instance running PostgreSQL 12 in GCP's London region (europe-west2).

```shell
gcloud sql instances create cloud-run-example \
  --tier=db-f1-micro \
  --region=europe-west2 \
  --database-version=POSTGRES_12 \
  --root-password=correcthorsebatterystaple \
  --storage-auto-increase
```

This will take a couple of minutes to run.

### 2. Give your Cloud Run service account the needed role/permissions.

Allow your Cloud Run service account access to Cloud SQL.

```
gcloud projects add-iam-policy-binding $GOOGLE_PROJECT_ID \
  --role roles/cloudsql.client \
  --member serviceAccount:$CLOUD_RUN_SERVICE_ACCOUNT_EMAIL
```

By default Cloud Run uses the default compute service account so in that case `$CLOUD_RUN_SERVICE_ACCOUNT_EMAIL` would be `$GOOGLE_PROJECT_ID-compute@developer.gserviceaccount.com`

### 3. Configure the connection from Cloud Run to CloudSQL.

```
gcloud run services update $SERVICE_NAME \
  --add-cloudsql-instances $GOOGLE_PROJECT_ID:europe-west2:cloud-run-example \
  --update-env-vars DATABASE_URL='postgres://postgres:correcthorsebatterystaple@/postgres?host=/cloudsql/$GOOGLE_PROJECT_ID:europe-west2:cloud-run-example'
```

This will make a socket available in the Cloud Run container at `/cloudsql/$GOOGLE_PROJECT_ID:europe-west2:cloud-run-example/.s.PGSQL.5432`. You can then configure your container to connect via that socket (the example above sets a environment variable called DATABASE_URL)

### 4. (Optional) Connect SQLAlchemy and connection limit gotchas.

If you're using SQLAlchemy you can then configure it like follows:

```python
import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine(os.getenv("DATABASE_URL"))
session = scoped_session(sessionmaker(bind=engine))

Base = declarative_base()
```

_But be careful_ - behind the scenes Cloud Run is just containers. By default it will allow 80 concurrent requests to a container before spinning up a 2nd. SQLAlchemy's connection pool [defaults](https://docs.sqlalchemy.org/en/13/core/pooling.html#sqlalchemy.pool.QueuePool.__init__) to a min of 5 and max of 10 connections. If you're using a small db instance (like the one in this example) and expecting some load you can quickly exhaust connection limits.
