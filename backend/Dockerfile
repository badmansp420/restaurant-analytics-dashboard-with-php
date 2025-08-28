FROM php:8.2-apache

# Enable Apache modules
RUN a2enmod rewrite headers

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Copy Apache vhost config
COPY vhost.conf /etc/apache2/sites-available/000-default.conf

# Set working directory
WORKDIR /var/www/html

# Copy ALL project files (not just /public)
COPY . /var/www/html

# Fix permissions for Apache user
RUN chown -R www-data:www-data /var/www/html
