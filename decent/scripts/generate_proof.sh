#!/bin/bash

# Load the configuration file
CONFIG_FILE="/app/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Config file not found!"
  exit 1
fi

# Parse the configuration to determine the type of proof to generate
PROOF_TYPE=$(jq -r '.proof_type' $CONFIG_FILE)

# Check for the dynamic input file
INPUT_FILE="/app/input.json"
if [ ! -f "$INPUT_FILE" ]; then
  echo "Dynamic input.json not found!"
  exit 1
fi

# Check the optimizer type from config
if [ "$PROOF_TYPE" == "SGD" ]; then
    echo "Using SGD optimizer..."
    CIRCUIT_PATH="/app/circuits/SGD"
elif [ "$PROOF_TYPE" == "adam" ]; then
    echo "Using Adam optimizer..."
    CIRCUIT_PATH="/app/circuits/adam"
else
    echo "Unknown proof type. Please set 'proof_type' in config.json to 'sgd' or 'adam'."
    exit 1
fi

# Check if the model weights file exists
WEIGHTS_FILE="/app/model_weights.h5"
if [ ! -f "$WEIGHTS_FILE" ]; then
  echo "Weights file not found!"
  exit 1
fi

# Generate the witness using the correct WASM file based on the proof type
echo "Generating witness..."
node $CIRCUIT_PATH/generate_witness.js $CIRCUIT_PATH/$PROOF_TYPE.wasm /app/input.json $CIRCUIT_PATH/witness.wtns

# Generate the proof using snarkjs
echo "Generating proof..."
snarkjs groth16 prove $CIRCUIT_PATH/$PROOF_TYPE.zkey $CIRCUIT_PATH/witness.wtns $CIRCUIT_PATH/proof.json $CIRCUIT_PATH/public.json

echo "verifying the proofs"
node /app/scripts/verify_proofs.js

echo "Proof generated successfully."
# cat $CIRCUIT_PATH/proof.json
