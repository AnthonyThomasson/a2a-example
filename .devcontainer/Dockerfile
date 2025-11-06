FROM mcr.microsoft.com/devcontainers/typescript-node:24-bookworm

# Install Docker CLI
RUN apt-get update && \
	apt-get install -y docker.io

RUN mkdir -p /workspaces/a2a-example
WORKDIR /workspaces/a2a-example
