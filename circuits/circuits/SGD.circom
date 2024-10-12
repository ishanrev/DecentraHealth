pragma circom 2.0.0;

template SGD() {
    signal input learning_rate; // Fixed point representation
    signal input prev_weight; // Fixed point representation
    signal input loss_gradient; // Fixed point representation
    signal input new_weight; // Provided new weight for comparison
   
    signal expected_weight;

    // Perform the weight update directly with pre-scaled values
    signal scaled_gradient;
    scaled_gradient <== (learning_rate * loss_gradient) /1000000;
    expected_weight <== prev_weight - scaled_gradient;
    signal output error;
    // Ensure that the expected weight matches the provided new_weight
    error<== expected_weight-new_weight;
}

component main = SGD();