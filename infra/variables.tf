variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "project_name" {
  type    = string
  default = "flixzone"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_az1_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "public_subnet_az2_cidr" {
  type    = string
  default = "10.0.2.0/24"
}

variable "private_app_subnet_az1_cidr" {
  type    = string
  default = "10.0.11.0/24"
}

variable "private_app_subnet_az2_cidr" {
  type    = string
  default = "10.0.12.0/24"
}

variable "private_db_subnet_az1_cidr" {
  type    = string
  default = "10.0.21.0/24"
}

variable "private_db_subnet_az2_cidr" {
  type    = string
  default = "10.0.22.0/24"
}
