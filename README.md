# Reviews

**Reviews** is a tool designed to automate and streamline the review collection process.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Contributing](#contributing)

## Demo

https://github.com/user-attachments/assets/a76027a8-6f2c-40e3-b5f8-605b30860ad6




## Features
- **Spaces**: Easily create, edit, and delete spaces.
- **Reviews**: Create and like reviews.
- **Embedding**: Seamlessly embed the review collection form into your platform.
- **API**: Retrieve reviews for a specific space via a robust API.

## Project Structure
The project is organized into two main folders:
- `client`: Contains the frontend code
- `server`: Contains the backend code

## Local Setup
Follow these steps to set up the app locally:

### 1. Fork and Clone the Repository
- Fork the repository on GitHub to your own account.
- Clone the forked repository to your local machine:
  ```
  git clone https://github.com/your-username/reviews.git
  ```
Replace `your-username` with your actual GitHub username.

### 2. Set Up the Server
- `cd reviews/server`
- `npm install`

### 3. Set Up the Client
- `cd ../client`
- `npm install`

### 4. Configure Environment Variables
Create a `.env` file in both the `server` and `client` folders. Refer to the `.env.example` files in each directory for guidance on required variables.

### 5. Start the Server
In the `server` directory:
`npm run start`

### 6. Start the Client
In the `client` directory: `npm run dev`

### 7. Access the Application
Open your web browser and navigate to the port specified in your environment variables to see the application in action.

## Contributing
We welcome your contributions! Please follow these steps:
1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request with a clear description of your improvements

Feel free to open issues for bug reports or feature requests.
