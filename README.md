# File Upload System

## Overview

This project is a file upload system that allows users to upload, update, download, and delete files. The system uses Multer for handling file uploads, MongoDB for storing file metadata, and AWS S3 for storing the actual files. It also includes endpoints for retrieving file information and downloading files securely using signed URLs.

## Features

- **File Upload**: Upload files to the server and store metadata in MongoDB.
- **File Download**: Securely download files using signed URLs from AWS S3.
- **File Metadata**: Retrieve and update file metadata stored in MongoDB.
- **File Deletion**: Delete files from AWS S3 and remove corresponding metadata from MongoDB.
- **Authentication**: Basic authentication system to manage user sessions and secure file operations.

## Technologies Used

- **Express**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool.
- **Multer**: Middleware for handling file uploads.
- **AWS SDK v3**: For interacting with AWS S3.
- **dotenv**: For loading environment variables.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- AWS account

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following variables:

    ```env
    MONGO_URI=your_mongo_connection_string
    AWS_ACCESS_KEY_ID=your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
    AWS_REGION=your_aws_region
    S3_BUCKET_NAME=your_s3_bucket_name
    PORT=5000
    ```

4. Start the server:

    ```bash
    npm start
    ```

### Usage

1. **Upload a file**:
    - Endpoint: `POST /upload`
    - Form Data: `file`, `description`

2. **Get file information**:
    - Endpoint: `GET /file/:id`

3. **Update file metadata**:
    - Endpoint: `PUT /file/:id`
    - Body: `{ "description": "new description" }`

4. **Download a file**:
    - Endpoint: `GET /file/download/:id`

5. **Delete a file**:
    - Endpoint: `DELETE /file/:id`

### Example

To upload a file using Postman:
1. Select `POST` method and enter `http://localhost:5000/upload`.
2. In the `Body` tab, select `form-data`.
3. Add a key named `file`, set type to `File`, and choose the file to upload.
4. Add another key named `description`, set type to `Text`, and enter a description for the file.
5. Send the request. 
