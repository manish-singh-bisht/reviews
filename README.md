# Reviews
**Reviews** is a tool designed to automate and streamline the review collection process.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Local Setup](#local-setup)
- [Contributing](#contributing)

## Demo

https://github.com/user-attachments/assets/74f1ea2b-cc5d-4fff-a2b1-4ccb0ed11c09


## Features

- **Spaces**: Easily create, edit, and delete spaces.
- **Reviews**: Create and like reviews.
- **Embedding**: Seamlessly embed the review collection form into your platform.
- **API**: Retrieve reviews for a specific space via a robust API.

## Local Setup

Follow these steps to set up the app locally:

### 1. Fork and Clone the Repository

- Fork the repository on GitHub to your own account.
- Clone the forked repository to your local machine:

    ```
    git clone https://github.com/your-username/reviews.git
    ```

  Replace `your-username` with your actual GitHub username.

### 2. Navigate to the Project Directory

Change to the server directory:
 ```
 cd reviews/server
```

### 3. Install Dependencies


Install the required dependencies

- Backend

    ```
    npm install
    ```
- Frontend
    ```
    cd client
    npm install
    ```
 

### 4. Set Up Environment Variables

Create a `.env` file in the server and the client folder. Refer to the `.env.example` file for guidance on required variables.

### 5. Run the Application

Start the backend,run the following in the server folder:
 ```
 npm run start
```
### 6. Build the frontend

Run the following
 ```
 cd client
npm run build
```

### 7. Access the Application

Open your web browser and navigate to  the port specified in your environment variables to see the application in action.

## Contributing

We welcome your contributions! Feel free to submit pull requests and provide feedback.
