FROM ubuntu:20.04

# Setting up user
RUN useradd -ms /bin/bash sandbox

# Setup working directory
WORKDIR /home/sandbox

# Update ubuntu machine
RUN apt update && apt upgrade -y

# Install nano and curl
RUN apt install nano curl -y

# Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt-get install -y nodejs

# Configuring terminal to display current working directory. Terminal will be used to interact with the docker container
RUN echo "PS1='\w '" >> /home/sandbox/.bashrc

# Setup final working directory (Project will be loaded in the app folder)
WORKDIR /home/sandbox/app