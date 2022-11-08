### Docker DB run config

`docker run --name psql-custom3d -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:latest`

### Localstack configuration

- Define the docker-compose file to create the localstack container
- Run the following command `docker-compose up -d`
- Create the bucket with the following command `awslocal s3api create-bucket --bucket precise-bucket`
- If you want to define the bucket public attach the acl with the command `awslocal s3api put-bucket-acl --bucket precise-bucket --acl public-read`
- If you want to see the list of the bucket: `awslocal s3api list-buckets`
- Create the env file with the environment variables following the *env.example* file

### DEV env

## Setup

To start the server in VM use the following command

```
npm run start:dev
```