import tenseal as ts
import numpy as np
import os, pickle, gc
import json
import base64
loc = 'key_store/'
import requests

def create_ckks_context():
    context = ts.context(ts.SCHEME_TYPE.CKKS, poly_modulus_degree=8192, coeff_mod_bit_sizes=[60, 40, 40, 60])
    context.global_scale = 2**40
    context.generate_galois_keys()
    return context

async def run():
    prvt_key_loc = f'{loc}private_key_ctx.pickle'
    pbl_key_loc = f'{loc}public_key_ctx.pickle'
    with open(prvt_key_loc, 'rb') as handle:
        secret_key_context_serialized = pickle.load(handle)

    with open(pbl_key_loc, 'rb') as handle:
        public_key_context_serialized = pickle.load(handle)
    

    # secret_key_context = context.copy()
    # public_key_context.make_context_public()
    # sk = context.serialize(save_secret_key=True)
    # pk = context.serialize(save_secret_key=False)
    # if not os.path.exists(loc):
    #     os.makedirs(loc)


    # with open(prvt_key_loc, 'wb') as handle:
    #     pickle.dump(sk, handle, protocol=pickle.HIGHEST_PROTOCOL)

    # with open(pbl_key_loc, 'wb') as handle:
    #     pickle.dump(pk, handle, protocol=pickle.HIGHEST_PROTOCOL)
    context_from_public_key = ts.context_from(public_key_context_serialized)
    file_path = 'info.json'
    file_path2 = 'info2.json'
    try:
        final_weights = extract_final_weights(file_path)
        
        chunk_size = 4096
        chunks = [final_weights[i:i + chunk_size] for i in range(0, int(len(final_weights)/100), chunk_size)]

# Encrypt each chunk separately
        encrypted_chunks = [ts.ckks_vector(context_from_public_key, chunk) for chunk in chunks]
        # print(encrypted_chunks)
        print("success")
        # hashed_weights = ts.ckks_vector(public_key_context, final_weights)
        # print(final_weights['final_weights'])
        encoded_chunks = [base64.b64encode(chunk.serialize()).decode('utf-8') for chunk in encrypted_chunks]
        
        final_weights_2 = extract_final_weights(file_path2)
        second_chunks = [final_weights_2[i:i + chunk_size] for i in range(0, int(len(final_weights_2)/100), chunk_size)]
        encrypted_chunks_2 = [ts.ckks_vector(context_from_public_key, chunk) for chunk in second_chunks]
        encoded_chunks_2 = [base64.b64encode(chunk.serialize()).decode('utf-8') for chunk in encrypted_chunks_2]

        payload = {
          "hash1": encoded_chunks,
          "hash2": encoded_chunks_2,
          "proof": "pr-cool"
        }
        
        # print(payload)
        response = requests.post(
          'http://52.90.123.164:5000/post-data'
          ,
          json=payload
        )
        
        print(response)
            
    except Exception as e:
        print(e)
        
    

def extract_final_weights(file_path):
    
    with open(file_path, 'r') as file:
        # Load the JSON data
        data = json.load(file)

        # Extract "final_weights" if it exists
        if "final_weights" in data:
            final_weights = data["final_weights"]
            return final_weights
        else:
            raise KeyError("Key 'final_weights' not found in the JSON file.")




# main()
  # read the input json
  # hash the array with the public key
