---
author: Catherine
slug: pepnotes
title: Setting Up a GKE Cluster
date: 2021-07-15
---

# Setting Up a GKE Cluster

Setting up the cluster itself isn't really the hard part; the hard part is enabling connectivity to other services, such as CloudSQL databases.

## Sign Up for GCP

## Create a Project

## Set up Billing Account

## Create Cluster

Create a public cluster
Enable workload identity for cluster
Enable metadata server for node pool

# Setting Up Services

## CloudSQL Databases

In order to keep database secure from prying eyes, it will be kept private within the project's VPC.
Connections will be authorized using the Cloud SQL Auth proxy, and authenticated using IAM DB auth. While it's totally possible to add our cluster's primary subnet to the list of authorized networks, in the long-term, it's less complicated to run the proxy as a service in the cluster and let it figure out how to stay connected to the DB.

### Network

Public IP: 34.132.247.155
Private IP: 172.24.144.3
Connection name: mta-music-318515:us-central1:production

### Set up Cloud SQL Auth Proxy

In a cluster hosting multiple database loads, it's most efficient to set up the proxy as its own service.
This allows you to deploy the proxy as a service called, for example, `db`, allowing database clients to
connect to the db by using that service as their database host.

To do so, deploy gcr.io/cloudsql-docker/gce-proxy:1.17, being sure to tell the proxy to listen to all
incoming connections instead of just loopback connections:
`-instances=<CONNECTION_NAME>=tcp:0.0.0.0:<PORT>`

#### Create & Bind GCP Service Account

1. Call it `cloudsql-client-proxy`, hit `Create`
2. Assign role 'Cloud SQL Client'
3. Add policy binding to corresponding Kube Service Account

```
gcloud iam service-accounts add-iam-policy-binding \
  --role roles/iam.workloadIdentityUser \
  --member "serviceAccount:<YOUR-GCP-PROJECT>.svc.id.goog[<YOUR-K8S-NAMESPACE>/<YOUR-KSA-NAME>]" \
  <YOUR-GSA-NAME>@<YOUR-GCP-PROJECT>.iam.gserviceaccount.com
```

4. Add annotation to Kube service account

```
kubectl annotate serviceaccount \
   <YOUR-KSA-NAME> \
   iam.gke.io/gcp-service-account=<YOUR-GSA-NAME>@<YOUR-GCP-PROJECT>.iam.gserviceaccount.com
```

## TLS / HTTPS Certs

Services to be backends for load balancers should be type NodePort.

https://kosyfrances.com/ingress-gce-letsencrypt/
https://kosyfrances.com/letsencrypt-dns01/
