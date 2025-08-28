FROM php:8.2-apache

RUN a2enmod rewrite headers

RUN docker-php-ext-install pdo pdo_mysql mysqli

COPY vhost.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

COPY public /var/www/html/public
