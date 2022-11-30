# Precise BackEnd
### Setup

- `npm install`
- Add the public/uploads folder in the src folder
- Add the `.env` file
- `npm run start`
### Docker DB run config

`docker run --name psql-custom3d -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:latest`