
<a name="readme-top"></a>

<div align="center">
  <img src="logo.png" alt="logo" width="140" height="auto" />
  <br/>
  <h3><b>SIL FRONTEND ENGINEER ASSESSMENT</b></h3>
</div>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [🚀 Live Demo](#live-demo)
- [💻 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Install](#install)
  - [Usage](#usage)
  - [Run tests](#run-tests)
  - [Deployment](#deployment)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)
- [🙏 Acknowledgements](#acknowledgements)
- [❓ FAQ](#faq)
- [📝 License](#license)

<!-- PROJECT DESCRIPTION -->

# 📖 SIL Frontend Engineer Assessment <a name="about-project"></a>

This project is part of the SIL Frontend Engineer Assessment. It aims to showcase proficiency in frontend development by building a web application with the specified requirements.
The client is built with React Js plus Vite and TypeScript. The API is built with Express JS with TypeScript. 
The Main features of this application include authentication using Passport Js with Github Strategy, users can view other users in the application, create Albums and change the tile for the photos.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://typescriptlang.org/">TypeScript.</a></li>

  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://typescriptlang.org/">TypeScript.</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

### Key Features <a name="key-features"></a>

- **Responsive Design**
- **Dynamic Data Handling**
- **Interactive UI Components**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE DEMO -->

## 🚀 Live Demo <a name="live-demo"></a>

- [Live Demo Link](https://sil-frontend.vercel.app)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need:
- Node.js installed
- A code editor like VS Code

### Setup

Clone this repository to your desired folder:

```sh
git clone https://github.com/NoelLincoln/SIL-FRONTEND_ASSESSMENT.git
cd SIL-FRONTEND_ASSESSMENT
```

### Install

Install dependencies with:

```sh
yarn install
```

### Create .env files for client and API
Due to security issues, the envs can be shared on request or create your own with this format:
 
 ```sh
client .env
PROD_URL='https://sil-backend-prod.onrender.com/api'
DEV_URL='http://localhost:10000/api'
```

```sh
Backend .env
DATABASE_URL=""
GHUB_CLIENT_ID=''
GHUB_CLIENT_SECRET=''
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=''
GHUB_CALLBACK_URL=''
```


### Usage

To run the project, execute the following command:

```sh
yarn start
```

### Run tests

To run tests, run the following command:

```sh
yarn test
```

### Deployment

The client is deployed on vercel, the API on render and the database on railway

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

## 👥 Authors <a name="authors"></a>

👤 **Noel Bryannt**

- GitHub: [@githubhandle](https://github.com/NoelLincoln)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/noel-bryant/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

- **Dark Mode**
- **Advanced Filtering Options**
- **Multi-language Support**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SUPPORT -->

## ⭐️ Show your support <a name="support"></a>

If you like this project, please give it a star!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGEMENTS -->

## 🙏 Acknowledgments <a name="acknowledgements"></a>

I would like to thank SIL for this opportunity.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FAQ -->

## ❓ FAQ <a name="faq"></a>

- **What is the purpose of this project?**
  - This project demonstrates frontend engineering skills for the SIL assessment.

- **Can I contribute to this project?**
  - Yes, contributions are welcome!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
