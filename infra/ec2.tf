# =====================
# EC2 (APP SERVER)
# =====================

resource "aws_instance" "app" {
  ami                    = "ami-0c1ac8a41498c1a9c"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.private_app_az1.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF2
#!/bin/bash
set -eux

apt update -y
apt install -y nginx git nodejs npm

systemctl enable nginx
systemctl start nginx

cd /home/ubuntu
git clone https://github.com/yassen74/Flix-zone.git app
chown -R ubuntu:ubuntu /home/ubuntu/app

cd /home/ubuntu/app/backend
npm install

nohup node src/server.js > app.log 2>&1 &

cat > /etc/nginx/sites-available/flixzone <<EOL
server {
    listen 80;

    root /home/ubuntu/app/Homepage;
    index home.html;

    location / {
        try_files \$uri \$uri/ /home.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
    }
}
EOL

ln -sf /etc/nginx/sites-available/flixzone /etc/nginx/sites-enabled/flixzone
rm -f /etc/nginx/sites-enabled/default || true

systemctl restart nginx
EOF2

  tags = {
    Name = "flixzone-app"
  }
}

resource "aws_lb_target_group_attachment" "attach" {
  target_group_arn = aws_lb_target_group.tg.arn
  target_id        = aws_instance.app.id
  port             = 80
}
