pragma circom 2.0.0;

template SGD() {
    signal input learning_rate; 
    signal input prev_weight; //
    signal input loss_gradient; 
    signal input new_weight; // 
   
    signal expected_weight;

    signal scaled_gradient;
    scaled_gradient <== (learning_rate * loss_gradient) /1000000;
    expected_weight <== prev_weight - scaled_gradient;
    signal output error;
    error<== expected_weight-new_weight;
}

component main = SGD();