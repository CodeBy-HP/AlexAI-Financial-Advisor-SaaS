output "sagemaker_endpoint_name" {
  description = "The name of the SageMaker endpoint"
  value       = aws_sagemaker_endpoint.embedding_endpoint.name
}

output "sagemaker_endpoint_arn" {
  description = "The ARN of the SageMaker endpoint"
  value       = aws_sagemaker_endpoint.embedding_endpoint.arn
}

output "sagemaker_execution_role_arn" {
  description = "The ARN of the SageMaker execution IAM role"
  value       = aws_iam_role.sagemaker_role.arn
}

output "sagemaker_model_name" {
  description = "The name of the SageMaker model"
  value       = aws_sagemaker_model.embedding_model.name
}
