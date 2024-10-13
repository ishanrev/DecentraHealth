//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

// Please note that you should adjust the length of the inputs
interface SGDVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external view returns (bool r);
}

contract ZkModel {
    struct Proof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }

    address public immutable sgdVerifier;
    address public immutable mseVerifier;
    uint256[3][] public records; // just a sample var

    constructor(address _mseVerifier) {
        sgdVerifier = 0x24515599ecfae88de1F5284508C3B942b542Cc3d;
        mseVerifier = _mseVerifier;
    }

    /**
     * @dev This is the sample function
     */
    function record(Proof memory proof)
        public
    {
        require(sgdVerify(proof), "SNARK verification failed");
        // records.push(publicSignals);
    }

    /**
     * Please adjust the IVerifier.sol and the array length of publicSignals
     */
    function sgdVerify(Proof memory proof)
        public
        view
        returns (bool)
    {
      
        bool result = SGDVerifier(sgdVerifier).verifyProof(
            proof.a,
            proof.b,
            proof.c,
            [uint256(0)]
        );
        return result;
    }

    function totalRecords() public view returns (uint256) {
        return records.length;
    }
}
