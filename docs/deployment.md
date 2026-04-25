# PineSap Deployment Guide

Pinesap is designed to be easily deployable using Docker and Docker Compose. This guide will walk you through the steps to set up and run PineSap on your server.

## Server Requirements

To deploy PineSap, you will need a server with the following specifications:

- At least 2 GB of RAM
- At least 20 GB of storage
- Ubuntu 24.04 LTS or later
- The Server Uses aarch64 (ARM64) or AMD64 architecture

## Step 1: Configure GitHub Container Registry (GHCR) Authentication

To pull the PineSap image from GitHub Container Registry (GHCR), you need to authenticate using a Personal Access Token (PAT). Follow these steps:

1. Go to your GitHub account settings and navigate to "Developer settings" > "Personal access tokens (classic)".
2. Generate a new token with the `read:packages`, `write:packages`, and `delete:packages` scopes.
3. Copy the generated token and use it to log in to GHCR from your terminal:

   ```bash
   export GITHUB_PAT=<YOUR_GITHUB_PAT>
   echo $GITHUB_PAT | docker login ghcr.io -u <GITHUB_USERNAME> --password-stdin
   ```

   Replace `<YOUR_GITHUB_PAT>` with your actual token and `<GITHUB_USERNAME>` with your GitHub username.

4. Generate a new token with the `read:packages` scope for the server to pull the image. Save this token securely as it will be used in the next steps.

## Step 2: Setup the Auth Gmail Account

PineSap uses Gmail for authentication. You need to set up a Gmail account and generate an app password for it. Follow these steps:

1. Create a new Gmail account.
2. Enable 2-Step Verification for the account.
3. Generate an app password for "Mail" and "Other (Custom name)".
4. Save the generated app password securely as it will be used in the next steps.

## Step 3: Update Docker Compose Configuration

In the `docker-compose.yaml` file, update the following sections:

1. In the `certbot` service, replace `<DOMAIN_NAME>` and `<EMAIL_ADDRESS>` with your actual domain name and email address:

   ```yaml
   certbot:
     image: certbot/certbot
     volumes:
       - certbot_www:/var/www/certbot
       - certbot_certs:/etc/letsencrypt
     entrypoint: >
       sh -c "certbot certonly --webroot -w /var/www/certbot
       -d <DOMAIN_NAME>
       --email <EMAIL_ADDRESS>
       --agree-tos
       --non-interactive
       && while true; do sleep 12h; certbot renew --quiet; done"
   ```

2. In the `app` service, replace the hardcoded values with environment variables:

   ```
    app:
      image: ghcr.io/<GITHUB_USERNAME>/pinesap:latest
      restart: unless-stopped
      environment:
         DATABASE_URL: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@database:5432/${POSTGRES_DB}"
   ```

   Make sure to replace `<GITHUB_USERNAME>` with your actual GitHub username.

## Step 4: Build Docker Image and Push to GHCR

You need to have docker installed locally to build the image and push it to GHCR. Follow the docker installation guide for your operating system. Follow these steps:

1. Build the Docker image locally:

   ```bash
    docker buildx build \
   --platform linux/arm64 \
   --build-arg DATABASE_URL=${DATABASE_URL} \
   --build-arg NEXT_PUBLIC_BETTER_AUTH_URL=<YOUR_FRONTEND_URL> \
   -t ghcr.io/<GITHUB_USERNAME>/pinesap:latest \
   --push \
   .
   ```

Replace `<GITHUB_USERNAME>` with your actual GitHub username. This command will build the Docker image for both AMD64 and ARM64 architectures and push it to GHCR.

## Step 5: Point DNS to Your Server

Make sure to point your domain's DNS records to the IP address of your server. This is necessary for Certbot to verify domain ownership and for users to access your application.
This will vary depending on your domain registrar, but generally you will need to create an A record that points your domain (e.g., `pinesap.cooperw.tech`) to your server's public IP address.

## Step 6: Install Docker and Docker Compose on Your Server

1. SSH into your server and update the package list:

   ```bash
   sudo apt update
   ```

2. Install Docker following the official Docker installation guide for Ubuntu: [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository).

3. Install Docker Compose following the official Docker Compose installation guide: [Install Docker Compose](https://docs.docker.com/compose/install/linux/#install-using-the-repository).

4. Log in to GHCR using the token you generated in Step 1:

   ```bash
   export GITHUB_PAT=<YOUR_GITHUB_PAT> # Use the token with read:packages scope for server authentication
   echo $GITHUB_PAT | docker login ghcr.io -u <GITHUB_USERNAME> --password-stdin
   ```

   Replace `<YOUR_GITHUB_PAT>` with the token you generated for server authentication and `<GITHUB_USERNAME>` with your GitHub username.

5. Create the Docker Group and add your user to it:

   ```bash
   sudo groupadd docker
   sudo usermod -aG docker $USER
   ```

6. Log out and log back in to apply the group changes.

## Step 7: Copy the ./docker-compose.yaml File to Your Server

1. Create a folder for your application on the server:

   ```bash
   mkdir pinesap
   cd pinesap
   ```

2. Copy the `docker-compose.yaml` file from your local machine to the server using `scp`:

   ```bash
   scp path/to/your/docker-compose.yaml user@your-server-ip:/path/to/pinesap/docker-compose.yaml
   ```

   Replace `path/to/your/docker-compose.yaml` with the actual path to your `docker-compose.yaml` file, `user` with your server username, and `your-server-ip` with the IP address of your server.

3. Copy the Prisma schema and migration files to the server:

   ```bash
    scp -r path/to/your/prisma user@your-server-ip:/path/to/pinesap/prisma
   ```

   Replace `path/to/your/prisma` with the actual path to your `prisma` folder.

## Step 8: Create Environment Variables File

Create a `.env` file in the root directory of your project and add the following environment variables:

```env
POSTGRES_USER="admin"
POSTGRES_PASSWORD="<SECURE_PASSWORD>"
POSTGRES_DB="postgres_db"
DATABASE_URL="postgresql://admin:<SECURE_PASSWORD>@database:5432/postgres_db"
BETTER_AUTH_SECRET="<SECURE_RANDOM_STRING>" # A secure random string used for authentication
BETTER_AUTH_URL="<YOUR_APP_URL>" # Base URL of your app
NEXT_PUBLIC_BETTER_AUTH_URL="<YOUR_APP_URL>" # Should always be the same as BETTER_AUTH_URL for client-side usage
AUTH_GMAIL_EMAIL="<GMAIL_EMAIL_ADDRESS>" # The Gmail address used for authentication
AUTH_GMAIL_PASSWORD="<GMAIL_APP_PASSWORD>" # Use an app password for Gmail authentication
NEXT_PUBLIC_ITEMS_PER_PAGE=10
CERTBOT_EMAIL="<EMAIL_ADDRESS_FOR_CERTBOT>" # Email for Certbot notifications (replace with your email)
```

Replace the placeholders with your actual values. Make sure to keep this file secure as it contains sensitive information.

> [!NOTE]
> You can generate secure secrets using `openssl rand -base64 32` for the `BETTER_AUTH_SECRET` and use a strong password for the database credentials.

## Step 9: Configure Apache and Certbot

Apache and Certbot are provided in the `docker-compose.yaml` file. Make sure to update the configuration as mentioned in Step 3.

1.  Create the `httpd.conf` file for Apache with the following content:
    mkdir -p ./apache
    nano ./apache/httpd.conf

```bash
# Extract the default config from the image
docker run --rm httpd:alpine cat /usr/local/apache2/conf/httpd.conf > ./apache/httpd.conf

# Append your vhost include
echo "Include conf/extra/vhost.conf" >> ./apache/httpd.conf
```

2.  Find `LoadModule rewrite_module modules/mod_rewrite.so` in `httpd.conf` and make sure it is not commented out (i.e., remove the `#` at the beginning of the line if it exists).
3.  Find `LoadModule ssl_module modules/mod_ssl.so` in `httpd.conf` and make sure it is not commented out (i.e., remove the `#` at the beginning of the line if it exists).
4.  Find `LoadModule proxy_module modules/mod_proxy.so` in `httpd.conf` and make sure it is not commented out (i.e., remove the `#` at the beginning of the line if it exists).
5.  Find `LoadModule proxy_http_module modules/mod_proxy_http.so` in `httpd.conf` and make sure it is not commented out (i.e., remove the `#` at the beginning of the line if it exists).
6.  Find `Listen 80` in `httpd.conf` and make sure it is present (add it if it doesn't exist).
7.  Find `Listen 443` in `httpd.conf` and make sure it is present (add it if it doesn't exist).

8.  Create the `vhost.conf` file for Apache with the following content:

            nano ./apache/vhost.conf

```apache
# HTTP — only used to serve ACME challenge, then redirect everything else
<VirtualHost *:80>
    ServerName <DOMAIN_NAME>

    # Certbot webroot challenge path
    Alias /.well-known/acme-challenge/ /var/www/certbot/.well-known/acme-challenge/
    <Directory /var/www/certbot>
        Options None
        AllowOverride None
        Require all granted
    </Directory>

    # Redirect all non-challenge traffic to HTTPS
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/.well-known/acme-challenge/
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</VirtualHost>

# HTTPS — reverse proxy to Next.js
# <VirtualHost *:443>
#    ServerName <DOMAIN_NAME>

#    SSLEngine on
#   SSLCertificateFile    /etc/letsencrypt/live/<DOMAIN_NAME>/fullchain.pem
#   SSLCertificateKeyFile /etc/letsencrypt/live/<DOMAIN_NAME>/privkey.pem

#   # Modern TLS only
#   SSLProtocol         all -SSLv3 -TLSv1 -TLSv1.1
#   SSLHonorCipherOrder off
#   SSLSessionTickets   off
#
#   # Reverse proxy to Next.js container
#   ProxyPreserveHost On
#   ProxyPass        / http://nextjs:3000/
#   ProxyPassReverse / http://nextjs:3000/
#
#   # Forward real client IP
#   RequestHeader set X-Forwarded-Proto "https"
#   RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}e"
# </VirtualHost>

```

> [!IMPORTANT]
> Replace `<DOMAIN_NAME>` with your actual domain name in both virtual host configurations.

> [!IMPORTANT]
> Note how that the HTTPS virtual host is commented out. This is because Certbot needs to be able to serve the ACME challenge over HTTP without interference from the reverse proxy. Once you have successfully obtained your SSL certificates, you can uncomment the HTTPS virtual host configuration.

# Step 10: Start the Application

Start the application using Docker Compose:

```bash
docker compose up -d apache certbot postgres nextjs
```

This command will start all the necessary services in detached mode. The first time you run this, apache will fail to start properly because the httpd.conf configuration is not yet set up, but that's expected.

Confirm that Certbot has successfully obtained the certificates by checking the logs:

```bash
docker compose logs certbot
```

You should see a message indicating that the certificate was successfully obtained. If there are any errors, make sure to address them (e.g., DNS issues, port blocking) before proceeding.

Once the certificates are obtained, you can deploy the Prisma migrations to set up the database schema:

```bash
docker compose run --rm nextjs npx prisma migrate deploy
```

Now that Certbot has successfully obtained the certificates, uncomment the HTTPS virtual host configuration in `vhost.conf` and restart the Apache container to enable HTTPS:

```bash
docker compose restart apache
```

## 11. Bootstrap Admin User

To create an initial admin user, you can use the following command:

```bash
docker compose run --rm nextjs npx tsx utils/bootstrap.ts \
  --name "<YOUR_NAME>" \
  --email "<YOUR_EMAIL>" \
  --password "<YOUR_PASSWORD>"
```

Replace `<YOUR_NAME>`, `<YOUR_EMAIL>`, and `<YOUR_PASSWORD>` with the desired name, email, and password for the admin user. This command will create a new user with admin privileges that you can use to log in to the application.
