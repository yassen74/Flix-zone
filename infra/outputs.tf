output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = [aws_subnet.public_az1.id, aws_subnet.public_az2.id]
}

output "private_app_subnet_ids" {
  value = [aws_subnet.private_app_az1.id, aws_subnet.private_app_az2.id]
}

output "private_db_subnet_ids" {
  value = [aws_subnet.private_db_az1.id, aws_subnet.private_db_az2.id]
}

output "availability_zones" {
  value = [local.az1, local.az2]
}
