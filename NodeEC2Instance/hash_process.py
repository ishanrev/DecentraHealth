import base64
import tenseal
import pickle
import tenseal as ts
import numpy as np
loc = 'key_store/'

def get_context():
    prvt_key_loc = f'{loc}private_key_ctx.pickle'
    pbl_key_loc = f'{loc}public_key_ctx.pickle'
    with open(prvt_key_loc, 'rb') as handle:
        secret_key_context_serialized = pickle.load(handle)

    with open(pbl_key_loc, 'rb') as handle:
        public_key_context_serialized = pickle.load(handle)
    
    return public_key_context_serialized, secret_key_context_serialized
        
def process_hash(hash):
    decoded_hashed_weights = [base64.b64decode(h) for h in hash]
    pk_serialized, secret_key_serialized = get_context()
    context = ts.context_from(pk_serialized)
    hashed_weights = [ts.ckks_vector_from(context, serialized_chunk)for serialized_chunk in decoded_hashed_weights]
    return hashed_weights
    print(hashed_weights)
    
def calculate_average(hashes_array):
  average_chunks = []
  for i in range(0, len(hashes_array[0])):
    sum = 0
    for j in range(0,len(hashes_array)):
      sum = sum + hashes_array[j][i]
    num_nodes = len(hashes_array)
    average_chunk = sum * (1 / num_nodes) 
    average_chunks.append(average_chunk)
  return average_chunks

def decrypt_chunks(encrypted_chunks):
  pk, sk = get_context()
  secret_context = ts.context_from(sk)
  decrypted_chunks = [encrypted_chunk.decrypt(secret_context.secret_key()) for encrypted_chunk in encrypted_chunks]
  # print(decrypted_chunks)
  flattened_array = np.concatenate(decrypted_chunks)
  return flattened_array

      
  

