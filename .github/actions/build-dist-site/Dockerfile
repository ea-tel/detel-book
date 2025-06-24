# Docker image based on ruby:3-slim
FROM ruby:3-slim
LABEL author="Benedikt Hensen"
LABEL version="1.1.0"

# Update rubygems
RUN gem update --system

# install dependencies
ENV BUNDLER_VERSION 2.6.9
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        bats \
        build-essential \
        ca-certificates \
        curl \
        libffi8 \
        make \
        shellcheck \
        git-all \
    && gem install bundler:2.6.9 \
    && bundle config --global silence_root_warning 1

# entrypoint to the scripts
COPY entrypoint.sh /

# define entrypoint
ENTRYPOINT ["sh", "/entrypoint.sh"]