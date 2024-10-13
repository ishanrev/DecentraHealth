import tenseal as ts
import numpy as np
import os, pickle, gc
import json
loc = 'key_store/'

def create_ckks_context():
    context = ts.context(ts.SCHEME_TYPE.CKKS, poly_modulus_degree=8192, coeff_mod_bit_sizes=[60, 40, 40, 60])
    context.global_scale = 2**40
    context.generate_galois_keys()
    return context

def main():
    context = create_ckks_context()
    public_key_context = context.copy()

    secret_key_context = context.copy()
    public_key_context.make_context_public()
    sk = context.serialize(save_secret_key=True)
    pk = context.serialize(save_secret_key=False)
    if not os.path.exists(loc):
        os.makedirs(loc)
    prvt_key_loc = f'{loc}private_key_ctx.pickle'
    pbl_key_loc = f'{loc}public_key_ctx.pickle'

    with open(prvt_key_loc, 'wb') as handle:
        pickle.dump(sk, handle, protocol=pickle.HIGHEST_PROTOCOL)

    with open(pbl_key_loc, 'wb') as handle:
        pickle.dump(pk, handle, protocol=pickle.HIGHEST_PROTOCOL)
        
    file_path = 'weights.json'
    try:
        final_weights = extract_final_weights(file_path)
        print("Final Weights:", final_weights)
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




main()
  # read the input json
  # hash the array with the public key
