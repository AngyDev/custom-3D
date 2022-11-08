# Precise

## Table of Contents

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
        <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#tech-stack">Tech stack</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#setup">Setup</a></li>
        <li><a href="#docker">Docker</a></li>
      </ul>
    </li>
  </ol>
</details>

## About the project

## Tech stack
**Frontend**

- Javascript
- React
- Webpack

**Backend**

- Node.JS
- Express
- Knex
- Postgress
## Getting Started

### Setup

[Frontend README](https://github.com/AngyDev/custom-3D/tree/main/client/README.md)

[Backend README](https://github.com/AngyDev/custom-3D/tree/main/server/README.md)

### LocalTunnel

```
// start the client
lt --port 9000 --subdomain my-app --local-host localhost

// start the server
lt --port 3000 --subdomain my-app-server --local-host localhost

// or
npm run start:tunnel // frontend, backend
```

### Docker

1. Clone the repository 
2. Open the terminal in the project folder
3. Create the _.env_ file, one for the client folder and one for the server folder
4. Run the following command:

`docker-compose up --build`
