variable "aws_region" {
  description = "AWS region for resources"
  type        = string
}

variable "sagemaker_endpoint_name" {
  description = "Name of the SageMaker endpoint from Part 2"
  type        = string
}

variable "vector_bucket_name" {
  description = "Name of the S3 Vectors bucket (manually created)"
  type        = string
}
