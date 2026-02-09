# Resume Grader Agent

This project is an AI-powered resume grading application. It allows users to upload a resume (PDF or Text) and paste a job description. The backend uses AWS Bedrock (Amazon Nova model) to analyze the resume against the job description and provides a score out of 100 with actionable feedback.

## Features

- **Frontend**: React application for easy user interaction.
- **Backend**: Express.js server handling file uploads and PDF parsing.
- **AI Integration**: Uses AWS Bedrock to invoke the `us.amazon.nova-2-lite-v1:0` model for intelligent grading.
- **Infrastructure**: Dockerized for consistent deployment.

---

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) (Desktop or Engine)
- An AWS Account with access to [Amazon Bedrock](https://aws.amazon.com/bedrock/).

### AWS Configuration

1.  **Enable Model Access**: Go to the AWS Bedrock Console -> Model access -> Request access for **Amazon Nova Lite**.
2.  **AWS CLI**: Configure your AWS CLI with credentials that have permission to invoke Bedrock.
    ```bash
    aws configure
    ```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cicd
```

### 2. Install Dependencies

Install packages for both the backend and frontend.

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Run Locally (Development Mode)

You can run the backend and frontend separately for development.

**Backend (Port 3000):**
```bash
# In the cicd directory
node src/server.js
```
*Note: Ensure your local environment has AWS credentials configured (e.g., via `~/.aws/credentials` or environment variables) so the backend can call Bedrock.*

**Frontend (Port 5173):**
```bash
# In the cicd/frontend directory
npm run dev
```

### 4. Run with Docker

To simulate the production environment locally:

1.  **Build the Image**:
    ```bash
    docker build -t resume-grader .
    ```

2.  **Run the Container**:
    You must mount your AWS credentials into the container so it can authenticate with Bedrock.

    ```bash
    docker run -p 3000:3000 \
      -v ~/.aws:/root/.aws \
      -e AWS_PROFILE=default \
      resume-grader
    ```
    *Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## Deployment (Create Your Own URL)

This project is configured to deploy to AWS ECS (Elastic Container Service) using GitHub Actions.

### 1. AWS Resources Setup

You need to set up the following resources in your AWS account:

-   **Amazon ECR**: Create a repository (e.g., `my-api`) to store your Docker images.
-   **ECS Cluster**: Create a cluster (e.g., `api-cluster`).
-   **ECS Service & Task Definition**: Create a Fargate service.
    -   **Execution Role**: Needs permissions to pull images from ECR and write logs (`AmazonECSTaskExecutionRolePolicy`).
    -   **Task Role**: Needs permissions to invoke Bedrock (`bedrock:InvokeModel`). **Crucial**: Ensure this role has the inline policy for Bedrock.
-   **Load Balancer (ALB)**: (Optional but recommended) Set up an ALB to forward traffic to your ECS service and provide a public URL.

### 2. GitHub Secrets

Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions, and add the following secrets:

-   `AWS_ACCESS_KEY_ID`: Your AWS Access Key.
-   `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Key.
-   `AWS_REGION`: Your region (e.g., `us-east-1`).
-   `AWS_ACCOUNT_ID`: Your 12-digit AWS Account ID.
-   `ECS_EXECUTION_ROLE_ARN`: The ARN of your ECS Task Execution Role.
-   `BEDROCK_SECRET`: (If used) Any additional secrets.

### 3. Deploy

Pushing to the `main` branch will automatically trigger the deployment workflow (`.github/workflows/deploy.yml`).

```bash
git add .
git commit -m "Deploying to production"
git push origin main
```

The workflow will:
1.  Build the Docker image.
2.  Push it to ECR.
3.  Update the ECS Task Definition with the new image.
4.  Deploy the new task to your ECS Service.

Once deployed, your application will be accessible via the Load Balancer's DNS name or your configured domain.
