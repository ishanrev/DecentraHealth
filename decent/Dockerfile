# Use Node.js 16.16.0 as the base image for snarkjs
FROM node:16.16.0

# Install necessary system dependencies and tools
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    git \
    jq \
    cmake \
    libssl-dev \
    g++ \
    curl \
    libgmp-dev \
    libomp-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install snarkjs globally for zk-SNARK proof generation
RUN npm install -g snarkjs @supabase/supabase-js

# Install numpy separately to ensure compatibility
RUN pip3 install numpy

# Set up the application directory
WORKDIR /app

# Copy precompiled circuits, scripts, and the static config.json file into the container
COPY ./precompiled_circuits ./circuits
COPY ./scripts ./scripts
COPY ./config.json /app/config.json

# Make the proof generation script executable
RUN chmod +x ./scripts/generate_proof.sh

# Set the default command to start a bash shell
CMD ["bash"]
