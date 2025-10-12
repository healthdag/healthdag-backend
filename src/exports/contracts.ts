// Auto-generated contract ABIs and addresses
// Generated: 2025-10-11T19:05:03.802Z

export const ContractABIs = {
  "DIDRegistry": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AccessControlBadConfirmation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "neededRole",
          "type": "bytes32"
        }
      ],
      "name": "AccessControlUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EnforcedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ExpectedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "length",
          "type": "uint256"
        }
      ],
      "name": "StringsInsufficientHexLength",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "did",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "DIDCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "did",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "documentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "DocumentAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "did",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "documentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "DocumentRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "did",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ProfileUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DOCUMENT_ADDER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "encryptionMethod",
          "type": "string"
        }
      ],
      "name": "addDocument",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "contractAddress",
          "type": "address"
        }
      ],
      "name": "authorizeContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "initialDocumentHash",
          "type": "string"
        }
      ],
      "name": "createDID",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "dataAccessController",
      "outputs": [
        {
          "internalType": "contract DataAccessController",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "didExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "did",
          "type": "string"
        }
      ],
      "name": "getAddressByDID",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getDID",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getDocumentCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "accessToken",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "documentId",
          "type": "uint256"
        }
      ],
      "name": "getDocumentWithToken",
      "outputs": [
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "uploadedAt",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "encryptionMethod",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "category",
          "type": "string"
        }
      ],
      "name": "getDocumentsByCategory",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "documentIds",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "timestamps",
          "type": "uint256[]"
        },
        {
          "internalType": "bool[]",
          "name": "activeStatus",
          "type": "bool[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getDocumentsMetadata",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "documentIds",
          "type": "uint256[]"
        },
        {
          "internalType": "string[]",
          "name": "categories",
          "type": "string[]"
        },
        {
          "internalType": "uint256[]",
          "name": "timestamps",
          "type": "uint256[]"
        },
        {
          "internalType": "bool[]",
          "name": "activeStatus",
          "type": "bool[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "callerConfirmation",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "documentId",
          "type": "uint256"
        }
      ],
      "name": "revokeDocument",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_dataAccessController",
          "type": "address"
        }
      ],
      "name": "setDataAccessController",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalDIDs",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "documentId",
          "type": "uint256"
        }
      ],
      "name": "validateDocument",
      "outputs": [
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "DataLease": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AccessControlBadConfirmation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "neededRole",
          "type": "bytes32"
        }
      ],
      "name": "AccessControlUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EnforcedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ExpectedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "accessToken",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "documentIds",
          "type": "uint256[]"
        }
      ],
      "name": "AccessTokenGenerated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "accessToken",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "LeaseActivated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "userDID",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "paymentAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        }
      ],
      "name": "LeaseCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "LeaseExpired",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "LeaseRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "PaymentReleased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MARKETPLACE_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "documentIds",
          "type": "uint256[]"
        }
      ],
      "name": "activateLease",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "userDID",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "paymentAmount",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "dataCategories",
          "type": "string[]"
        },
        {
          "internalType": "string",
          "name": "termsHash",
          "type": "string"
        }
      ],
      "name": "createLease",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "dataAccessController",
      "outputs": [
        {
          "internalType": "contract DataAccessController",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "didRegistry",
      "outputs": [
        {
          "internalType": "contract DIDRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "emergencyRevokeToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        }
      ],
      "name": "getAccessToken",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "userDID",
          "type": "string"
        }
      ],
      "name": "getActiveLeaseCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        }
      ],
      "name": "getLease",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "leaseId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "userDID",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "studyId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "researcher",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "paymentAmount",
              "type": "uint256"
            },
            {
              "internalType": "enum DataLease.LeaseStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "string[]",
              "name": "dataCategories",
              "type": "string[]"
            },
            {
              "internalType": "uint256[]",
              "name": "documentIds",
              "type": "uint256[]"
            },
            {
              "internalType": "bytes32",
              "name": "accessToken",
              "type": "bytes32"
            },
            {
              "internalType": "string",
              "name": "termsHash",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "paymentReleased",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "tokenGenerated",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct DataLease.Lease",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        }
      ],
      "name": "getLeaseDocuments",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        }
      ],
      "name": "getStudyLeases",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "userDID",
          "type": "string"
        }
      ],
      "name": "getUserLeases",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_didRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_dataAccessController",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "_paymentProcessor",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        }
      ],
      "name": "isLeaseActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "leases",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "userDID",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "paymentAmount",
          "type": "uint256"
        },
        {
          "internalType": "enum DataLease.LeaseStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "accessToken",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "termsHash",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "paymentReleased",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "tokenGenerated",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paymentProcessor",
      "outputs": [
        {
          "internalType": "contract PaymentProcessor",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        }
      ],
      "name": "releasePayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "callerConfirmation",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "revokeLease",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "studyLeases",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalLeases",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "leaseIds",
          "type": "uint256[]"
        }
      ],
      "name": "updateExpiredLeases",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userLeases",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "documentId",
          "type": "uint256"
        }
      ],
      "name": "validateDocumentAccess",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "EmergencyAccess": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AccessControlBadConfirmation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "neededRole",
          "type": "bytes32"
        }
      ],
      "name": "AccessControlUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EnforcedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ExpectedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "patientDID",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "responder",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expiresAt",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum EmergencyAccess.AccessLevel",
          "name": "accessLevel",
          "type": "uint8"
        }
      ],
      "name": "AccessGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "AccessRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "responder",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "dataCategory",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "DataAccessed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "admin",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "EmergencyOverride",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "EMERGENCY_GRANTER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "accessLogs",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "responder",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "accessTime",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "dataAccessed",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfsProof",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        }
      ],
      "name": "checkAccess",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "dataAccessController",
      "outputs": [
        {
          "internalType": "contract DataAccessController",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "didRegistry",
      "outputs": [
        {
          "internalType": "contract DIDRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum EmergencyAccess.AccessLevel",
          "name": "",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "emergencyCategories",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "patientDID",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "responder",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "justification",
          "type": "string"
        }
      ],
      "name": "emergencyOverride",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        }
      ],
      "name": "getAccessLogs",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "grantId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "responder",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "accessTime",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "dataAccessed",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "ipfsProof",
              "type": "string"
            }
          ],
          "internalType": "struct EmergencyAccess.AccessLog[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "patientDID",
          "type": "string"
        }
      ],
      "name": "getActiveGrants",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "activeGrants",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        }
      ],
      "name": "getEmergencyToken",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        }
      ],
      "name": "getGrant",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "grantId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "patientDID",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "responder",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "responderName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "responderCredential",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "grantedAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "expiresAt",
              "type": "uint256"
            },
            {
              "internalType": "enum EmergencyAccess.AccessLevel",
              "name": "accessLevel",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "string",
              "name": "location",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "reason",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "wasRevoked",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "revokedAt",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "accessToken",
              "type": "bytes32"
            },
            {
              "internalType": "uint256[]",
              "name": "documentIds",
              "type": "uint256[]"
            }
          ],
          "internalType": "struct EmergencyAccess.EmergencyGrant",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "patientDID",
          "type": "string"
        }
      ],
      "name": "getPatientGrants",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "patientDID",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "responder",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "responderName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "responderCredential",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "enum EmergencyAccess.AccessLevel",
          "name": "accessLevel",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
        }
      ],
      "name": "grantAccess",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "grants",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "patientDID",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "responder",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "responderName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "responderCredential",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "grantedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "expiresAt",
          "type": "uint256"
        },
        {
          "internalType": "enum EmergencyAccess.AccessLevel",
          "name": "accessLevel",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "reason",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "wasRevoked",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "revokedAt",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "accessToken",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_didRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_dataAccessController",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxAccessDuration",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "patientGrants",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "callerConfirmation",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "grantId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "revokeAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newDuration",
          "type": "uint256"
        }
      ],
      "name": "setMaxAccessDuration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalGrants",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "patientDID",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "responder",
          "type": "address"
        }
      ],
      "name": "verifyResponderAccess",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "Marketplace": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AccessControlBadConfirmation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "neededRole",
          "type": "bytes32"
        }
      ],
      "name": "AccessControlUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EnforcedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ExpectedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "userDID",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ParticipantApplied",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "oldFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "PlatformFeeUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "participantsEnrolled",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "StudyClosed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "paymentPerUser",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "participantsNeeded",
          "type": "uint256"
        }
      ],
      "name": "StudyCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "RESEARCHER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "userDID",
          "type": "string"
        },
        {
          "internalType": "uint256[]",
          "name": "documentIds",
          "type": "uint256[]"
        }
      ],
      "name": "applyToStudy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        }
      ],
      "name": "closeStudy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "irbApprovalHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "participantsNeeded",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "paymentPerUser",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "requiredDataCategories",
          "type": "string[]"
        }
      ],
      "name": "createStudy",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "dataLease",
      "outputs": [
        {
          "internalType": "contract DataLease",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "didRegistry",
      "outputs": [
        {
          "internalType": "contract DIDRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getActiveStudies",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "userDID",
          "type": "string"
        }
      ],
      "name": "getRequiredDocuments",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "categories",
          "type": "string[]"
        },
        {
          "internalType": "uint256[][]",
          "name": "availableDocIds",
          "type": "uint256[][]"
        },
        {
          "internalType": "uint256[][]",
          "name": "timestamps",
          "type": "uint256[][]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        }
      ],
      "name": "getStudy",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "studyId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "researcher",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "metadataHash",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "irbApprovalHash",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "participantsNeeded",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "participantsEnrolled",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "paymentPerUser",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalEscrow",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "enum Marketplace.StudyStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "string[]",
              "name": "requiredDataCategories",
              "type": "string[]"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct Marketplace.Study",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        }
      ],
      "name": "getStudyParticipants",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "userDID",
          "type": "string"
        }
      ],
      "name": "getUserStudies",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_didRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_dataLease",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "_paymentProcessor",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        }
      ],
      "name": "pauseStudy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paymentProcessor",
      "outputs": [
        {
          "internalType": "contract PaymentProcessor",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "platformFeePercentage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "leaseId",
          "type": "uint256"
        }
      ],
      "name": "releasePaymentAfterAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "callerConfirmation",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        }
      ],
      "name": "resumeStudy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "studies",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "irbApprovalHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "participantsNeeded",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "participantsEnrolled",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "paymentPerUser",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalEscrow",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "enum Marketplace.StudyStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "studyParticipants",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalStudies",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newFee",
          "type": "uint256"
        }
      ],
      "name": "updatePlatformFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userStudies",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ],
  "PaymentProcessor": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_platformWallet",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AccessControlBadConfirmation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "neededRole",
          "type": "bytes32"
        }
      ],
      "name": "AccessControlUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EnforcedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ExpectedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "depositor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "EscrowDeposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "EscrowReleased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "PlatformFeeCollected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "oldWallet",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newWallet",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "PlatformWalletUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "Refunded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "LEASE_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MARKETPLACE_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "depositor",
          "type": "address"
        }
      ],
      "name": "depositEscrow",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        }
      ],
      "name": "getDepositor",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        }
      ],
      "name": "getEscrow",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "platformWallet",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "refund",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "studyId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "releaseFromEscrow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "callerConfirmation",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalPlatformFees",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newWallet",
          "type": "address"
        }
      ],
      "name": "updatePlatformWallet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawPlatformFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
};

export const ContractBytecodes = {
  "DIDRegistry": "0x608060405234620000375760016002556200001a336200003c565b506200002633620000bc565b5060405161203690816200015f8239f35b600080fd5b6001600160a01b031660008181527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5602052604081205490919060ff16620000b857818052816020526040822081835260205260408220600160ff198254161790553391600080516020620021958339815191528180a4600190565b5090565b6001600160a01b031660008181527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260408120549091907fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff166200015957808352826020526040832082845260205260408320600160ff1982541617905560008051602062002195833981519152339380a4600190565b50509056fe6080806040526004908136101561001557600080fd5b60003560e01c90816301ffc9a71461140f57508063213e2b521461124d578063248a9ca31461121f5780632f2ff15d146111e05780633457d3e214610d7057806336568abe14610d2c57806336a8915b14610c21578063393f2dc514610b8b5780633b993fe014610b4f5780633f4ba83a14610ae557806342242ed814610aa45780634524942c146108c55780634bc55e6e1461083c578063593c23b0146108055780635c975abb146107e25780635d66b80e146107c457806367561d931461074757806375b238fc1461070c5780638456cb59146106b357806391d1485414610666578063a217fddf1461064a578063ab74ac1e14610621578063c3f995d4146105e6578063d547741f146105a5578063efa643d0146102c0578063f64e30b0146102425763fba1842a1461014a57600080fd5b3461023d576020908160031936011261023d578035903360005280835260406000209061017d60ff600384015416611903565b61018c60058301548410611e56565b808201908360005281855260ff60036040600020015416156102075750906101d091836000528452600360406000200160ff19815416905560405191828092611944565b0390209160405191825242908201527f2579050a8ee5df74c981f27f4aa8987f87e64e85c18a404e0b158c9ecb7fb70a60403392a3005b60405162461bcd60e51b8152908101859052600f60248201526e105b1c9958591e481c995d9bdad959608a1b6044820152606490fd5b600080fd5b503461023d57602036600319011261023d576001600160a01b03610264611461565b16806000528160205261028160ff60036040600020015416611903565b6000526020526102bc6102a16102a8604060002060405192838092611e98565b038261181f565b6040519182916020835260208301906114e4565b0390f35b503461023d57606036600319011261023d5780356102dc611477565b6003546001600160a01b039081169291604491823590851561056d5760405192634091350560e11b84528588850152826024850152602093848187818b5afa9081156104bb57600091610537575b50156104fd571660005285825285604060002061034d60ff600383015416611903565b61035c60058201548410611e56565b82600052018252604060002092600384019460ff865416156104c7576001850196604051858101906103a98161039b610395858c611944565b8d611944565b03601f19810183528261181f565b519020813b1561023d5760006084928b928296604051988997889663359e0a3760e01b88528701526024860152840152600160648401525af180156104bb5761048d575b5093816104736104669661043461045260ff60026102bc999801549754169461043b6040519a6104288c6104218186611e98565b038d61181f565b60405194858092611e98565b038461181f565b61044b6040518098819301611e98565b038661181f565b60405198899860a08a5260a08a01906114e4565b91888303908901526114e4565b9260408601521515606085015283820360808501526114e4565b6001600160401b0381116104a6576040526102bc6103ed565b604186634e487b7160e01b6000525260246000fd5b6040513d6000823e3d90fd5b60405162461bcd60e51b8152808901859052601060248201526f111bd8dd5b595b9d081c995d9bdad95960821b81840152606490fd5b60405162461bcd60e51b8152808901859052601460248201527324b73b30b634b21030b1b1b2b9b9903a37b5b2b760611b81870152606490fd5b90508481813d8311610566575b61054e818361181f565b8101031261023d5751801515810361023d573861032a565b503d610544565b60405162461bcd60e51b8152602081890152601260248201527110dbdb9d1c9bdb1b195c881b9bdd081cd95d60721b81860152606490fd5b503461023d57604036600319011261023d576105e490356105c4611477565b908060005260006020526105df6001604060002001546115e6565b611737565b005b3461023d57600036600319011261023d5760206040517f3a06d7ac5b53e3a28e6d26d08512ebe945db9c084b05695845989e7ee7cd5dbb8152f35b3461023d57600036600319011261023d576003546040516001600160a01b039091168152602090f35b3461023d57600036600319011261023d57602060405160008152f35b503461023d57604036600319011261023d57610680611477565b9035600052600060205260406000209060018060a01b0316600052602052602060ff604060002054166040519015158152f35b3461023d57600036600319011261023d576106cc61156c565b6106d46118e5565b600160ff19815416176001557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586020604051338152a1005b3461023d57600036600319011261023d5760206040517fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217758152f35b3461023d57602036600319011261023d576105e4610763611461565b61076b61156c565b7f3a06d7ac5b53e3a28e6d26d08512ebe945db9c084b05695845989e7ee7cd5dbb60009081526020527fbca5d6e16df09bc12feaf125d50e6ddf6d4f002ad5570863c6d526eb1e6425af546107bf906115e6565b61160c565b3461023d57600036600319011261023d576020600654604051908152f35b3461023d57600036600319011261023d57602060ff600154166040519015158152f35b3461023d57604036600319011261023d57604061082c610823611461565b60243590611fa0565b8251911515825215156020820152f35b503461023d57602036600319011261023d57610856611461565b61085e61156c565b6001600160a01b031690811561088c57506bffffffffffffffffffffffff60a01b6003541617600355600080f35b60649060206040519162461bcd60e51b8352820152601260248201527124b73b30b634b21031b7b73a3937b63632b960711b6044820152fd5b503461023d57604036600319011261023d576108df611461565b6024356001600160401b03811161023d576108fd903690840161153f565b9160018060a01b03166000526020838152604060002060ff90600394610927838784015416611903565b60009260009760058401549301975b838110610a43575061094784611f44565b9661095a61095486611f44565b95611f44565b9660009360005b8681106109a4576109898b6102bc8c6109968d8d60405196879660608852606088019061148d565b918683039087015261148d565b908382036040850152611509565b806000528b8952896040600020898d6040516109c7816102a18160018801611e98565b8d81519101208d6109d936898b61187a565b8051910120146109f6575b505050506109f1906118c0565b610961565b8989898295610a379795899e99610a136109f19b610a2d98611f76565b52610a2385600284015492611f76565b5201541692611f76565b90151590526118c0565b9590508938898d6109e4565b806000528886526102a1610a64600160406000200160405192838092611e98565b868151910120610a7536858a61187a565b87815191012014610a8f575b610a8a906118c0565b610936565b93610a9c610a8a916118c0565b949050610a81565b503461023d57602036600319011261023d576001600160a01b03610ac6611461565b16600052602052602060ff600360406000200154166040519015158152f35b503461023d57600036600319011261023d57610aff61156c565b6001549060ff821615610b40575060ff19166001557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6020604051338152a1005b604051638dfc202b60e01b8152fd5b503461023d57602036600319011261023d576001600160a01b03610b71611461565b166000526020526020600560406000200154604051908152f35b503461023d57602036600319011261023d5780356001600160401b03811161023d57610bba903690830161153f565b8060405192833760059082019081528190036020019020546001600160a01b0316908115610bed57602082604051908152f35b60649060206040519162461bcd60e51b8352820152600d60248201526c111251081b9bdd08199bdd5b99609a1b6044820152fd5b503461023d57606036600319011261023d576001600160401b0390803582811161023d57610c52903690830161153f565b91909260243581811161023d57610c6c903690840161153f565b94909160443590811161023d57610c86903690850161153f565b949093610c916118e5565b3360005280602052610cad60ff60036040600020015416611903565b610cb88215156117ac565b8615610cf7576020610cef8888610ce889610ce08a610cd8368b8d61187a565b95369161187a565b92369161187a565b91336119c7565b604051908152f35b60649060206040519162461bcd60e51b8352820152600e60248201526d456d7074792063617465676f727960901b6044820152fd5b503461023d57604036600319011261023d57610d46611477565b336001600160a01b03821603610d60576105e49135611737565b5060405163334bd91960e11b8152fd5b503461023d57602036600319011261023d576001600160401b0390803582811161023d57610da1903690830161153f565b9091610dab6118e5565b60028054146111d15760028055336000528060205260ff6003604060002001541661119857610ddb8215156117ac565b6040513394606082018181118382101761118357604052602a82526020820195604036883782511561116e576030875382516001101561116e576078602184015360295b600181116110fe57506110e057610e6d602d6040518098610e5d60208301966c3234b21d313637b1b5b230b39d60991b8852518092858501906114c1565b810103600d81018952018761181f565b336000528260205260406000209286519182116110cb5750610e8f8354611840565b601f8111611083575b506020601f821160011461100b5792610f3160206102bc98979484610f969895610f4b98600091611000575b508160011b916000199060031b1c19161784555b6000600560018601956bffffffffffffffffffffffff60a01b9633888254161790554260028201556003810160ff1990600182825416179055600160068301918254161790550155604051809381928b519283916114c1565b81016005815203019020903390825416179055369161187a565b604051610f57816117ee565b600781526650524f46494c4560c81b602082015260405191610f78836117ee565b600b83526a4145532d3235362d43424360a81b6020840152336119c7565b50610fa26006546118c0565b600655604051604081527f05df43fb03bcbacb9a4122938d2024b390ebfc39ce205b84fa2a9cecda077c60610fda60408301846114e4565b914260208201528033930390a260016002556040519182916020835260208301906114e4565b90508a015138610ec4565b601f198216908460005260206000209160005b81811061106b57506102bc989794600185610f4b9895610f3195610f969b9860209610611052575b5050811b018455610ed8565b8c015160001960f88460031b161c191690553880611046565b9192602060018192868d01518155019401920161101e565b836000526020600020601f830160051c810191602084106110c1575b601f0160051c01905b8181106110b55750610e98565b600081556001016110a8565b909150819061109f565b604190634e487b7160e01b6000525260246000fd5b60405163e22e27eb60e01b8152338185015260146024820152604490fd5b90600f81166010811015611159578451831015611159576f181899199a1a9b1b9c1cb0b131b232b360811b901a84830160200153841c9080156111445760001901610e1f565b601185634e487b7160e01b6000525260246000fd5b603286634e487b7160e01b6000525260246000fd5b603284634e487b7160e01b6000525260246000fd5b604184634e487b7160e01b6000525260246000fd5b60649060206040519162461bcd60e51b8352820152601260248201527144494420616c72656164792065786973747360701b6044820152fd5b604051633ee5aeb560e01b8152fd5b503461023d57604036600319011261023d576105e490356111ff611477565b9080600052600060205261121a6001604060002001546115e6565b6116be565b503461023d57602036600319011261023d573560005260006020526020600160406000200154604051908152f35b503461023d576020908160031936011261023d576001600160a01b03611271611461565b16600052808252604060002060ff906003611290838284015416611903565b60058201549461129f86611f44565b956112a981611f2d565b946112b7604051968761181f565b818652601f1993846112c884611f2d565b0160005b8181106114005750506112de83611f44565b956112e884611f44565b980160005b848110611395576113118b8b8b8b8b8b60405196879660808852608088019061148d565b908682038188015284519182815281810182808560051b8401019701946000925b85841061135f578a806102bc8c6113518d8d858203604087015261148d565b908382036060850152611509565b91938080979a9b5061137f8a8486600196989a9c9d030188528c516114e4565b9a0194019401918a999897969491959395611332565b8084848d6113dd848e6113fb97600052888d52816113b881604060002096611f76565b526040516113cd816102a18160018901611e98565b6113d78383611f76565b52611f76565b5060028101546113ed858e611f76565b52015416610a2d828d611f76565b6112ed565b606089820187015285016112cc565b823461023d57602036600319011261023d57359063ffffffff60e01b821680920361023d57602091637965db0b60e01b8114908115611450575b5015158152f35b6301ffc9a760e01b14905083611449565b600435906001600160a01b038216820361023d57565b602435906001600160a01b038216820361023d57565b90815180825260208080930193019160005b8281106114ad575050505090565b83518552938101939281019260010161149f565b60005b8381106114d45750506000910152565b81810151838201526020016114c4565b906020916114fd815180928185528580860191016114c1565b601f01601f1916010190565b90815180825260208080930193019160005b828110611529575050505090565b835115158552938101939281019260010161151b565b9181601f8401121561023d578235916001600160401b03831161023d576020838186019501011161023d57565b3360009081527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260409020547fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff16156115c85750565b6044906040519063e2517d3f60e01b82523360048301526024820152fd5b80600052600060205260406000203360005260205260ff60406000205416156115c85750565b6001600160a01b031660008181527fbca5d6e16df09bc12feaf125d50e6ddf6d4f002ad5570863c6d526eb1e6425ae60205260408120549091907f3a06d7ac5b53e3a28e6d26d08512ebe945db9c084b05695845989e7ee7cd5dbb9060ff166116b957808352826020526040832082845260205260408320600160ff198254161790557f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339380a4600190565b505090565b9060009180835282602052604083209160018060a01b03169182845260205260ff604084205416156000146116b957808352826020526040832082845260205260408320600160ff198254161790557f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339380a4600190565b9060009180835282602052604083209160018060a01b03169182845260205260ff6040842054166000146116b95780835282602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4600190565b156117b357565b60405162461bcd60e51b815260206004820152601360248201527208adae0e8f240c8dec6eadacadce840d0c2e6d606b1b6044820152606490fd5b604081019081106001600160401b0382111761180957604052565b634e487b7160e01b600052604160045260246000fd5b90601f801991011681019081106001600160401b0382111761180957604052565b90600182811c92168015611870575b602083101461185a57565b634e487b7160e01b600052602260045260246000fd5b91607f169161184f565b9291926001600160401b03821161180957604051916118a3601f8201601f19166020018461181f565b82948184528183011161023d578281602093846000960137010152565b60001981146118cf5760010190565b634e487b7160e01b600052601160045260246000fd5b60ff600154166118f157565b60405163d93c066560e01b8152600490fd5b1561190a57565b60405162461bcd60e51b815260206004820152601260248201527111125108191bd95cc81b9bdd08195e1a5cdd60721b6044820152606490fd5b60009291815461195381611840565b926001918083169081156119ac5750600114611970575b50505050565b90919293945060005260209081600020906000915b85831061199b575050505001903880808061196a565b805485840152918301918101611985565b60ff191684525050508115159091020191503880808061196a565b60018060a01b03169081600052600460205260406000206005810154946040519060a082018281106001600160401b03821117611809576040528382528560208301524260408301526001606083015260808201528560005260048201602052604060002081518051906001600160401b038211611809578190611a4b8454611840565b601f8111611e06575b50602090601f8311600114611d9a57600092611d8f575b50508160011b916000199060031b1c19161781555b60208201518051906001600160401b03821161180957611aa36001840154611840565b601f8111611d48575b50602090601f8311600114611cd357918060809492600494600092611cc8575b50508160011b916000199060031b1c19161760018201555b60408401516002820155600381016060850151151560ff80198354169116179055019101518051906001600160401b03821161180957611b248354611840565b601f8111611c80575b50602090601f8311600114611beb57937f3d69684690ea5f6f60d2f657cb30e8b186eb4e1912f03f1aa7f3827a7c47945d959383611bd494611ba894611bc698600092611be0575b50508160011b916000199060031b1c19161790555b611b9760058201546118c0565b600582015560405191828092611944565b039020956040519384938985526080602086015260808501906114e4565b9083820360408501526114e4565b4260608301520390a390565b015190503880611b75565b90601f198316918460005260206000209260005b818110611c68575084611ba894611bc698947f3d69684690ea5f6f60d2f657cb30e8b186eb4e1912f03f1aa7f3827a7c47945d9a9894611bd49860019510611c4f575b505050811b019055611b8a565b015160001960f88460031b161c19169055388080611c42565b92936020600181928786015181550195019301611bff565b836000526020600020601f840160051c81019160208510611cbe575b601f0160051c01905b818110611cb25750611b2d565b60008155600101611ca5565b9091508190611c9c565b015190503880611acc565b906001840160005260206000209160005b601f1985168110611d305750926080949260019260049583601f19811610611d17575b505050811b016001820155611ae4565b015160001960f88460031b161c19169055388080611d07565b91926020600181928685015181550194019201611ce4565b600184016000526020600020601f840160051c810160208510611d88575b601f830160051c82018110611d7c575050611aac565b60008155600101611d66565b5080611d66565b015190503880611a6b565b9250836000526020600020906000935b601f1984168510611deb576001945083601f19811610611dd2575b505050811b018155611a80565b015160001960f88460031b161c19169055388080611dc5565b81810151835560209485019460019093019290910190611daa565b909150836000526020600020601f840160051c810160208510611e4f575b90849392915b601f830160051c82018110611e40575050611a54565b60008155859450600101611e2a565b5080611e24565b15611e5d57565b60405162461bcd60e51b8152602060048201526013602482015272125b9d985b1a5908191bd8dd5b595b9d081251606a1b6044820152606490fd5b9060009291805491611ea983611840565b918282526001938481169081600014611f0a5750600114611eca5750505050565b90919394506000526020928360002092846000945b838610611ef657505050500101903880808061196a565b805485870183015294019385908201611edf565b9294505050602093945060ff191683830152151560051b0101903880808061196a565b6001600160401b0381116118095760051b60200190565b90611f4e82611f2d565b611f5b604051918261181f565b8281528092611f6c601f1991611f2d565b0190602036910137565b8051821015611f8a5760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b6001600160a01b0316600090815260046020526040812060038101549192909160ff16158015611ff2575b611feb5782600460039360409360ff965201602052200154169060019190565b5050908190565b506005820154811015611fcb56fea264697066735822122044be561a9b18cdc32ab7bc1e2fddc5f5e2b500671ad44e810f1160cbe83ef48e64736f6c634300081400332f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d",
  "DataLease": "0x608060405234620000375760016002556200001a336200003c565b506200002633620000bc565b5060405161296e90816200015f8239f35b600080fd5b6001600160a01b031660008181527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5602052604081205490919060ff16620000b857818052816020526040822081835260205260408220600160ff19825416179055339160008051602062002acd8339815191528180a4600190565b5090565b6001600160a01b031660008181527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260408120549091907fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff166200015957808352826020526040832082845260205260408320600160ff1982541617905560008051602062002acd833981519152339380a4600190565b50509056fe608080604052600436101561001357600080fd5b600090813560e01c90816301ffc9a714612229575080630212926b146121f757806311023bdb14611f3d5780631291557714611e6a57806320d0f31114611e4c578063248a9ca314611e205780632eb0994514611d535780632f2ff15d14611d1657806331b803e31461154a57806336568abe146115025780633f4ba83a14611497578063404f90ae14611414578063577f9fb1146113eb5780635b92cbd1146113985780635c975abb146113755780635d20fc4614610f5557806375b238fc14610f1a5780638456cb5914610ec057806388685cd914610b8f5780638927a10614610a6f57806390ca5e7e14610a4457806391d14854146109f957806392b7a73c146108eb578063991acf6e146108be5780639f44657c14610570578063a217fddf14610554578063ab74ac1e1461052b578063c0c53b8b14610395578063c3439f3f1461035a578063c7fc805114610314578063d1ee16b5146102f0578063d547741f146102af578063eb0e70b9146101c25763f1c6bdf81461019757600080fd5b346101bf57806003193601126101bf576009546040516001600160a01b039091168152602090f35b80fd5b50346101bf576101d1366122ef565b90916101db6125b7565b835260036020526040832060ff600c82015460081c161561027557600854600a9190910154849390916001600160a01b0316803b15610271576102459385809460405196879586948593630757a76360e41b8552600485015260406024850152604484019161274b565b03925af18015610266576102565750f35b61025f90612322565b6101bf5780f35b6040513d84823e3d90fd5b8480fd5b60405162461bcd60e51b81526020600482015260126024820152714e6f20746f6b656e20746f207265766f6b6560701b6044820152606490fd5b50346101bf5760403660031901126101bf576102ec6004356102cf6123ab565b90808452836020526102e76001604086200154612613565b6126b7565b5080f35b50346101bf57602061030a6103043661227e565b90612888565b6040519015158152f35b50346101bf5760203660031901126101bf576103426009604061035693600435815260036020522001612837565b6040519182916020835260208301906123f1565b0390f35b50346101bf57806003193601126101bf5760206040517f0ea61da3a8a09ad801432653699f8c1860b1ae9d2ea4a141fadfd63227717bc88152f35b50346101bf5760603660031901126101bf576004356001600160a01b0381811691829003610526576103c56123ab565b9160443592828416809403610271576103dc6125b7565b81156104eb5782169081156104a657831561046157600754928316610426576bffffffffffffffffffffffff60a01b80931617600755816008541617600855600954161760095580f35b60405162461bcd60e51b8152602060048201526013602482015272105b1c9958591e481a5b9a5d1a585b1a5e9959606a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152601860248201527f496e76616c6964205061796d656e7450726f636573736f7200000000000000006044820152606490fd5b60405162461bcd60e51b815260206004820152601c60248201527f496e76616c69642044617461416363657373436f6e74726f6c6c6572000000006044820152606490fd5b60405162461bcd60e51b8152602060048201526013602482015272496e76616c696420444944526567697374727960681b6044820152606490fd5b600080fd5b50346101bf57806003193601126101bf576008546040516001600160a01b039091168152602090f35b50346101bf57806003193601126101bf57602090604051908152f35b50346101bf5760203660031901126101bf57806101c06040516105928161234b565b828152606060208201528260408201528260608201528260808201528260a08201528260c08201528260e08201526060610100820152606061012082015282610140820152606061016082015282610180820152826101a0820152015260043581526003602052604081206040519061060a8261234b565b8054825260405161062981610622816001860161245f565b0382612367565b60208301526002810154604083015260038101546001600160a01b031660608301526004810154608083015260058082015460a0840152600682015460c0840152600782015460ff16908110156108aa5760e083015260088101546001600160401b03811161089657604051906106a660208260051b0183612367565b808252602082016008840186526020862086915b838310610871578787600d88886101008401526106d960098201612837565b610120840152600a8101546101408401526040516106fe8161062281600b860161245f565b61016084015260ff600c820154818116151561018086015260081c1615156101a084015201546101c082015260405190602082528051602083015261075460208201516101e060408501526102008401906124f5565b926040820151606084015260018060a01b036060830151166080840152608082015160a084015260a082015160c084015260c082015160e08401526107a260e083015161010085019061251a565b61010082015190601f19948585820301610120860152825190818152602081016020808460051b840101950193915b838310610846578780886101c061081f8d6107fc8c61012086015183888303016101408901526123f1565b9061014085015161016087015261016085015190868303016101808701526124f5565b9161018081015115156101a08501526101a081015115158285015201516101e08301520390f35b9091929394602080610862838c866001960301875289516124f5565b970193019301919392906107d1565b60016020819260405161088881610622818961245f565b8152019201920191906106ba565b634e487b7160e01b84526041600452602484fd5b634e487b7160e01b84526021600452602484fd5b50346101bf5760203660031901126101bf57600a6040602092600435815260038452200154604051908152f35b50346101bf576020806003193601126109f5576004356001600160401b0381116109f15761091e839136906004016123c1565b906109276125b7565b82935b828510610935578380f35b610940858484612928565b35845260038152604084209460078601805460ff8116976005808a10156109dd576001610981969798999a1491826109cf575b505061098a575b505061276c565b9392919061092a565b60ff1916600217905561099e818686612928565b357f6d45dfbad6a6e2b87344c52f24fe2fb19112d18169b42f9407ac36c053520ee484604051428152a2868061097a565b015442101590508980610973565b634e487b7160e01b89526021600452602489fd5b8280fd5b5080fd5b50346101bf5760403660031901126101bf576040610a156123ab565b91600435815280602052209060018060a01b0316600052602052602060ff604060002054166040519015158152f35b50346101bf5760203660031901126101bf576103426040610356926004358152600560205220612837565b50346101bf5760203660031901126101bf57600435815260036020526040902080546040519182806001830190610aa59161245f565b03610ab09084612367565b6002810154600160a01b600190036003830154169060048301549060058401546006850154600786015460ff1690600a87015492604051958680600b8b0190610af89161245f565b03610b039088612367565b600c89015498600d0154976040519b8c9b8c528b6101a06020819201528c01610b2b916124f5565b9660408c015260608b015260808a015260a089015260c088015260e08701610b529161251a565b610100860152848103610120860152610b6a916124f5565b9160ff8116151561014085015260081c60ff1615156101608401526101808301520390f35b50346101bf576020806003193601126109f557600435610bad6127dd565b610bb561253d565b60029081805414610eae57818055808452600383526040842060ff6007820154166005811015610e9a57600103610e6257600c8101805460ff8116610e2a5760081c60ff1615610df35760085460405163fcc1767d60e01b8152600481018590526001600160a01b039187908290602490829086165afa908115610de8578891610dbb575b5015610d7657808791600754169087604051809363393f2dc560e01b82528260048301528180610c706024820160018c0161245f565b03915afa918215610d6b578392610d3c575b506009541693600687820154910194855490803b1561027157604051637633f96d60e01b815260048101939093526001600160a01b0393909316602483015260448201529082908290606490829084905af1801561026657610d24575b50506001947f3c70b1e8034b5738ec77fbfdaa4d28906a0b3160018d67a2dc7b534e53e33fe0926040928760ff19825416179055549082519182524290820152a25580f35b610d2d90612322565b610d38578538610cdf565b8580fd5b610d5d919250883d8a11610d64575b610d558183612367565b81019061272c565b9038610c82565b503d610d4b565b6040513d85823e3d90fd5b60405162461bcd60e51b815260048101879052601760248201527f4e6f2076657269666965642064617461206163636573730000000000000000006044820152606490fd5b610ddb9150873d8911610de1575b610dd38183612367565b81019061281f565b38610c3a565b503d610dc9565b6040513d8a823e3d90fd5b60405162461bcd60e51b815260048101869052600f60248201526e27379030b1b1b2b9b9903a37b5b2b760891b6044820152606490fd5b60405162461bcd60e51b815260048101879052601060248201526f105b1c9958591e481c995b19585cd95960821b6044820152606490fd5b60405162461bcd60e51b815260048101859052601060248201526f4c65617365206e6f742061637469766560801b6044820152606490fd5b634e487b7160e01b86526021600452602486fd5b604051633ee5aeb560e01b8152600490fd5b50346101bf57806003193601126101bf57610ed96125b7565b610ee16127dd565b600160ff19815416176001557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586020604051338152a180f35b50346101bf57806003193601126101bf5760206040517fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217758152f35b50346101bf576003196040368201126109f5576001600160401b039060043560248035848111610d3857610f8d9036906004016123c1565b9190610f976127dd565b610f9f61253d565b838752602091600383526040882090600782019760ff895416600581101561136257611330576005830180544210156112fa5786156112bd57600c84019960ff8b5460081c166112795760018060a01b03928c84600954168960028901548860405180948193633e8cf2cb60e11b835260048301525afa91821561126d579161123c575b5060068701541161120257600986019089116111ef57600160401b89116111ef578c81548a83558a8a8282106111d4575b505050908d5250868c20868d5b8a81106111c257505050600160ff1982541617905554914283039283116111b057908592918b89836008541693600388015416946110dc6040519d8e9788968795630227500760e61b8752600487015285015260c060448501526110cb60c4850160018c0161245f565b908482030160648501528c8b6127fb565b9060848301528260a483015203925af1958615610de8578896611178575b509085967f160ab55bf391f9ca6f8efbf7635431e5dcf3ac9e356d67c48485d490dab7784e9596600a61117294015561010061ff001982541617905586867feee7f1a7bbe5e10f32e753efda839f532ae02cc782c40bf6b9a4f71747f586cd85604051428152a36040519383859485528401916127fb565b0390a380f35b91909495508282813d83116111a9575b6111928183612367565b810103126111a55790519493600a6110fa565b8780fd5b503d611188565b634e487b7160e01b8b5260116004528afd5b81358382015590890190600101611061565b83856111e69552209182019101612791565b8c388a8a611054565b634e487b7160e01b8d526041600452848dfd5b60405162461bcd60e51b81526004810189905260138187015272496e73756666696369656e7420657363726f7760681b6044820152606490fd5b90508881813d8311611266575b6112538183612367565b81010312611262575138611023565b8d80fd5b503d611249565b604051903d90823e3d90fd5b60405162461bcd60e51b8152600481018890526017818601527f546f6b656e20616c72656164792067656e6572617465640000000000000000006044820152606490fd5b60405162461bcd60e51b81526004810187905260168185015275139bc8191bd8dd5b595b9d1cc81cdc1958da599a595960521b6044820152606490fd5b60405162461bcd60e51b815260048101879052600f818501526e105b1c9958591e48195e1c1a5c9959608a1b6044820152606490fd5b60405162461bcd60e51b815260048101869052600b818401526a4e6f742070656e64696e6760a81b6044820152606490fd5b634e487b7160e01b8b526021600452828bfd5b50346101bf57806003193601126101bf57602060ff600154166040519015158152f35b50346101bf5760203660031901126101bf57600435906001600160401b0382116101bf5761035661034260206113d136600487016122c2565b919082604051938492833781016004815203019020612837565b50346101bf57806003193601126101bf576007546040516001600160a01b039091168152602090f35b50346101bf5760203660031901126101bf57600435815260036020526040812060ff60078201541691600583101561148357506001602092149081611475575b81611465575b506040519015158152f35b60ff9150600c015416153861145a565b600581015442109150611454565b634e487b7160e01b81526021600452602490fd5b50346101bf57806003193601126101bf576114b06125b7565b60015460ff8116156114f05760ff19166001557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6020604051338152a180f35b604051638dfc202b60e01b8152600490fd5b50346101bf5760403660031901126101bf5761151c6123ab565b336001600160a01b03821603611538576102ec906004356126b7565b60405163334bd91960e11b8152600490fd5b50346101bf5760e03660031901126101bf576004356001600160401b0381116109f55761157b9036906004016122c2565b909190604435906001600160a01b03821682036105265760a4356001600160401b038111611d12576115b19036906004016123c1565b94909360c4356001600160401b0381116109f5576115d39036906004016122c2565b6115de9791976127dd565b6115e661253d565b60075460405163393f2dc560e01b8152602060048201819052909182906001600160a01b0316818061161c602482018c8c61274b565b03915afa908115611d07578491611ce8575b506001600160a01b031615611cb5576001600160a01b03861615611c7b57606435151580611c6b575b15611c335760843515611bfc578115611bc257600654966116778861276c565b600655878452600360205260408420928884556001600160401b038711611af2576116a56001850154612425565b601f8111611b8f575b508685601f8211600114611b25578691611b1a575b508760011b906000198960031b1c19161760018501555b60243560028501556003840180546001600160a01b0319166001600160a01b038a161790554260048501819055606435810110611b065742606435016005850155608435600685015560078401805460ff19169055600160401b8111611af2576008840154816008860155808210611a7a575b50600884018552602085208592805b8385106119275750505050506001600160401b0381116119135780602098611787600b850154612425565b601f81116118d7575b508490601f831160011461186d578592611862575b50508160011b916000199060031b1c191617600b8201555b600c810161ffff198154169055600d429101556117ed8560405185858237888187810160048152030190206127a8565b60243581526005865261180385604083206127a8565b82604051938493843782019081520390206040519160018060a01b03168252608435848301526064356040830152827faf8b98b061a0f4bb4e3f422bed546b664e48978c580da60707b6a85b59090464606060243594a4604051908152f35b0135905038806117a5565b600b850186528a8620869450915b601f19841685106118c0576001945083601f198116106118a6575b505050811b01600b8201556117bd565b0135600019600384901b60f8161c19169055388080611896565b818101358355938b01936001909201918b0161187b565b61190390600b860187528b8720601f850160051c8101918d8610611909575b601f0160051c0190612791565b38611790565b90915081906118f6565b634e487b7160e01b83526041600452602483fd5b8035601e1983360301811215611a76576001600160401b038184013511611a765780830135360360208285010113611a76576119638454612425565b601f8111611a44575b5088601f82850135116001146119c35760019283926020928c90828801356119b4575b5081870135851b916000199088013560031b1c19161786555b0193019401939161175c565b8491508288010101353861198f565b848a5260208a20908a5b85840135601f19168110611a2857506001938493602093919285929088830135601f19811610611a07575b5050860135811b0186556119a8565b8560001960f8858c013560031b161c1991848b0101013516905538806119f8565b90916020600181928286888b01010135815501930191016119cd565b848a526020808b20611a709286850135601f810160051c8301931161190957601f0160051c0190612791565b3861196c565b8880fd5b60088501865260208620908282015b8183018110611a9957505061174d565b8088611aa760019354612425565b80611ab5575b505001611a89565b601f81118414611acd575050600081555b8838611aad565b828252611ae8601f60208420920160051c8201858301612791565b6000835555611ac6565b634e487b7160e01b85526041600452602485fd5b634e487b7160e01b85526011600452602485fd5b9050860135386116c3565b600186018752602087209150865b601f198a168110611b77575088601f19811610611b5d575b5050600187811b0160018501556116da565b87013560001960038a901b60f8161c191690553880611b4b565b9091602060018192858c013581550193019101611b33565b611bbc9060018601875260208720601f8a0160051c81019160208b1061190957601f0160051c0190612791565b386116ae565b60405162461bcd60e51b81526020600482015260126024820152714e6f20646174612063617465676f7269657360701b6044820152606490fd5b60405162461bcd60e51b815260206004820152600f60248201526e125b9d985b1a59081c185e5b595b9d608a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152601060248201526f24b73b30b634b210323ab930ba34b7b760811b6044820152606490fd5b506301e133806064351115611657565b60405162461bcd60e51b815260206004820152601260248201527124b73b30b634b2103932b9b2b0b931b432b960711b6044820152606490fd5b60405162461bcd60e51b815260206004820152600b60248201526a125b9d985b1a590811125160aa1b6044820152606490fd5b611d01915060203d602011610d6457610d558183612367565b3861162e565b6040513d86823e3d90fd5b8380fd5b50346101bf5760403660031901126101bf576102ec600435611d366123ab565b9080845283602052611d4e6001604086200154612613565b612639565b50346101bf576020806003193601126109f5576004356001600160401b0381116109f157611d88611da89136906004016122c2565b849291925083859382604051938492833781016004815203019020612837565b92805b8451811015611e165760058482821b8701015183526003855260ff60076040852001541690811015611e0257600114611ded575b611de89061276c565b611dab565b91611dfa611de89161276c565b929050611ddf565b634e487b7160e01b83526021600452602483fd5b5050604051908152f35b50346101bf5760203660031901126101bf57600160406020926004358152808452200154604051908152f35b50346101bf57806003193601126101bf576020600654604051908152f35b50346101bf5760403660031901126101bf576001600160401b03906004358281116109f557366023820112156109f5578060040135928311611f295760405192611ebe601f8201601f191660200185612367565b80845260208401913660248383010111611d1257918360208381946024611efb970185378701015260243594604051938492839251928391612388565b810160048152030190209081548310156101bf576020611f1b8484612294565b90546040519160031b1c8152f35b634e487b7160e01b82526041600452602482fd5b50346101bf57611f4c366122ef565b90828452602091600383526040852060018060a01b03806007541685604051809263393f2dc560e01b82528260048301528180611f8f6024820160018a0161245f565b03915afa8015610de857829189916121da575b501633036121a35760078201805460ff8116600581101561218f578015908115612184575b501561214f5760ff19166003179055600c82018054889392919060081c60ff1680612142575b6120c0575b5460ff1615612044575b5050507fb289b37d2e4c9f7b0ec71d082a3a7edf5f010a8d76c6760d1e5ec879f05090179261203860405193849360408552604085019161274b565b9042908301520390a280f35b8060095416600660028401549260038501541693015490803b156102715760405163e796a6eb60e01b815260048101939093526001600160a01b0393909316602483015260448201529082908290606490829084905af18015610266576120ac575b80611ffc565b6120b590612322565b6102715784386120a6565b90809293506008541688600a850154823b156109f557604051928391630757a76360e41b83526004830152604060248301528183816121048c8c604484019161274b565b03925af180156121375761211d575b5090879291611ff2565b9761212d60ff9994939294612322565b9792909192612113565b6040513d8b823e3d90fd5b50600a8301541515611fed565b60405162461bcd60e51b815260048101889052600d60248201526c43616e6e6f74207265766f6b6560981b6044820152606490fd5b600191501438611fc7565b634e487b7160e01b8a52602160045260248afd5b60405162461bcd60e51b815260048101869052600f60248201526e2737ba103632b0b9b29037bbb732b960891b6044820152606490fd5b6121f19150873d8911610d6457610d558183612367565b38611fa2565b50346101bf576122063661227e565b919081526005602052604081209081548310156101bf576020611f1b8484612294565b9050346109f55760203660031901126109f55760043563ffffffff60e01b81168091036109f15760209250637965db0b60e01b811490811561226d575b5015158152f35b6301ffc9a760e01b14905038612266565b6040906003190112610526576004359060243590565b80548210156122ac5760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b9181601f84011215610526578235916001600160401b038311610526576020838186019501011161052657565b9060406003198301126105265760043591602435906001600160401b0382116105265761231e916004016122c2565b9091565b6001600160401b03811161233557604052565b634e487b7160e01b600052604160045260246000fd5b6101e081019081106001600160401b0382111761233557604052565b90601f801991011681019081106001600160401b0382111761233557604052565b60005b83811061239b5750506000910152565b818101518382015260200161238b565b602435906001600160a01b038216820361052657565b9181601f84011215610526578235916001600160401b038311610526576020808501948460051b01011161052657565b90815180825260208080930193019160005b828110612411575050505090565b835185529381019392810192600101612403565b90600182811c92168015612455575b602083101461243f57565b634e487b7160e01b600052602260045260246000fd5b91607f1691612434565b906000929180549161247083612425565b9182825260019384811690816000146124d25750600114612492575b50505050565b90919394506000526020928360002092846000945b8386106124be57505050500101903880808061248c565b8054858701830152940193859082016124a7565b9294505050602093945060ff191683830152151560051b0101903880808061248c565b9060209161250e81518092818552858086019101612388565b601f01601f1916010190565b9060058210156125275752565b634e487b7160e01b600052602160045260246000fd5b3360009081527fda104853dc3972fb943ce0ee89200279d8af13db255ed28fb43e685524f21b1960205260409020547f0ea61da3a8a09ad801432653699f8c1860b1ae9d2ea4a141fadfd63227717bc89060ff16156125995750565b6044906040519063e2517d3f60e01b82523360048301526024820152fd5b3360009081527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260409020547fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff16156125995750565b80600052600060205260406000203360005260205260ff60406000205416156125995750565b9060009180835282602052604083209160018060a01b03169182845260205260ff604084205416156000146126b257808352826020526040832082845260205260408320600160ff198254161790557f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339380a4600190565b505090565b9060009180835282602052604083209160018060a01b03169182845260205260ff6040842054166000146126b25780835282602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4600190565b9081602091031261052657516001600160a01b03811681036105265790565b908060209392818452848401376000828201840152601f01601f1916010190565b600019811461277b5760010190565b634e487b7160e01b600052601160045260246000fd5b81811061279c575050565b60008155600101612791565b8054600160401b811015612335576127c591600182018155612294565b819291549060031b91821b91600019901b1916179055565b60ff600154166127e957565b60405163d93c066560e01b8152600490fd5b81835290916001600160fb1b0383116105265760209260051b809284830137010190565b90816020910312610526575180151581036105265790565b9060405191828154918282526020928383019160005283600020936000905b82821061286e5750505061286c92500383612367565b565b855484526001958601958895509381019390910190612856565b9060009182526003602052604082209060ff60078301541660058110156108aa57600114801590612916575b6126b2576020906044600a60018060a01b03600854169401546040519485938492634091350560e11b8452600484015260248301525afa91821561126d57916128fb575090565b612913915060203d8111610de157610dd38183612367565b90565b5060ff600c83015460081c16156128b4565b91908110156122ac5760051b019056fea2646970667358221220ef1fd9274b5de77c13fa7b7d1df61c640f5383a09b08e805d32113c36376aa6764736f6c634300081400332f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d",
  "EmergencyAccess": "0x6080604052346200003e57600160025562015180600855620000213362000043565b506200002d33620000c3565b506040516135589081620001668239f35b600080fd5b6001600160a01b031660008181527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5602052604081205490919060ff16620000bf57818052816020526040822081835260205260408220600160ff198254161790553391600080516020620036be8339815191528180a4600190565b5090565b6001600160a01b031660008181527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260408120549091907fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff166200016057808352826020526040832082845260205260408320600160ff19825416179055600080516020620036be833981519152339380a4600190565b50509056fe61026080604052600436101561001457600080fd5b6000806101a052803560e01c91826301ffc9a7146129ed57505080630c0debea146128a2578063248a9ca31461287157806327005122146128455780632ce5c39a146127b55780632f2ff15d1461277357806336568abe1461272c5780633a7b2696146126e75780633f4ba83a14612675578063485cc95514611e985780634cede43214611a43578063577f9fb114611a175780635c975abb146119f1578063695bf0e8146119675780636e583cac1461193f57806370e187ec14611853578063729aa626146117ed57806375b238fc146117af5780638456cb591461174e57806391d14854146116fc578063a04220d414611656578063a217fddf14611637578063ab74ac1e1461160b578063b8cc6c931461133c578063be6ff6f7146111c0578063c81bd8cf146105f4578063d547741f146105aa578063d9211be814610589578063e9e80a111461050c578063ec632503146104e8578063f1fb8d89146101df5763f6c9cf301461018757600080fd5b346101d85760403660031901126101d8576004356001600160401b0381116101d8576101ca6101bc6040923690600401612c1c565b6101c4612c01565b916133f3565b825191151582526020820152f35b6101a05180fd5b346101d85760403660031901126101d8576024356001600160401b0381116101d85761020f903690600401612c1c565b906004356101a05152600460205260406101a0512060018060a01b03600954166040519063393f2dc560e01b825260206004830152816101a051600185015461025781612a48565b908160248501526001811690816000146104c65750600114610483575b5091818060209403915afa9081156103bf576101a05191610454575b506001600160a01b031633148015610405575b6102ac906134c5565b600781019081549160ff8360081c16156103cd57600c9261ff0019169055600a8101600160ff1982541617905542600b820155015480610335575b5061031f7f376b297f290aecfa7f3942f1b58c4ba92d45dfc781d0c060387be17d83551c1091604051936040855260408501916130da565b9142602082015280600435930390a26101a05180f35b600a546001600160a01b0316803b156101d85760405191630757a76360e41b8352600483015260406024830152816101a0519181806103786044820189896130da565b03916101a051905af180156103bf57156102e7576001600160401b0381116103a55760405261031f6102e7565b634e487b7160e01b6101a05152604160045260246101a051fd5b6040513d6101a051823e3d90fd5b60405162461bcd60e51b815260206004820152601060248201526f416c726561647920696e61637469766560801b6044820152606490fd5b507fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217756101a051526101a0518060205260408120903390526020526102ac60ff60406101a05120541690506102a3565b610476915060203d60201161047c575b61046e8183612acf565b8101906130bb565b84610290565b503d610464565b9050600185016101a051526101a05190602082205b8183106104ac575050810160440181610274565b805460448488010152859350602090920191600101610498565b60ff191660448086019190915291151560051b84019091019150829050610274565b346101d8576101a05180600319360112610509576020600854604051908152f35b80fd5b346101d85760403660031901126101d85760043560038110156101d85761053560243591612cf1565b9081548110156101d85761054891612c8f565b6105705761055861056c91612af0565b604051918291602083526020830190612bb9565b0390f35b634e487b7160e01b6101a0515260246101a05180600452fd5b346101d8576101a05180600319360112610509576020600754604051908152f35b346101d85760403660031901126101d8576105ec6004356105c9612c01565b90806101a051526105e7600160406101a05180602052200154612d84565b612ec3565b506101a05180f35b346101d85760e03660031901126101d8576004356001600160401b0381116101d857610624903690600401612c1c565b9061062d612c01565b916044356001600160401b0381116101d85761064d903690600401612c1c565b9190926064356001600160401b0381116101d85761066f903690600401612c1c565b6102205261020052600360a43510156101d85760c4356001600160401b0381116101d8576106a1903690600401612c1c565b610160526106ad6131a1565b6000805160206135038339815191526101a051526101a05180602052604081209033905260205260ff60406101a051205416156111945760095460405163393f2dc560e01b81526020600482018190526001600160a01b039092169791818061071a6024820189896130da565b03818b5afa9081156103bf576101a05191611175575b506001600160a01b031615611142576001600160a01b03811615611109576084351515806110fb575b610762906130fb565b84156110c9576102205115611091576007549061077e8261313a565b60075561078d6084354261315f565b906107bf602061079e368989612c49565b6040518093819263393f2dc560e01b83528460048401526024830190612bb9565b03818d5afa80156103bf576101a05160a052611070575b506107e260a435612cf1565b9586546107ee816131bf565b976107fc604051998a612acf565b81895260208901610180526101a051526101a0516020812060e0525b8181106110445750506101a051806080525b8751608051908110156108c15761084190896131d6565b519060405191631149250b60e21b8352828d81806108696101a0519560a05160048401613300565b03915afa80156103bf57610889926101a0519161089e575b50519061315f565b9861089560805161313a565b6080529861082a565b6108b9913d8091833e6108b18183612acf565b810190613248565b50508d610881565b5091899793916108d38c979694613325565b610140526101a051806101e0526101c0525b84516101c051908110156109f7576108fd90866131d6565b5160c0526040518061024052631149250b60e21b90526101a051610240518061092e60c05160a05160048401613300565b03610240518a5afa80156103bf576101a0519081610120526109c5575b506101a0515b61012051805182101561099c579061096c81610997936131d6565b516109916101e0516109836101009180835261313a565b6101e05251610140516131d6565b5261313a565b610951565b50509193959790929496986109b36101c05161313a565b6101c0529896949290979593916108e5565b6109eb903d8091610240513e6109de8161024051612acf565b6102405190810190613248565b5050610120528a61094b565b50879450888a87610140515115610fff57610a65916020610a5060018060a01b03600a54168b6040518097819482936307cc001360e21b84528d60018060a01b03166004850152608060248501528c60848501916130da565b82810360031901604484015261014051612cbd565b608435606483015203916101a051905af19283156103bf576101a05193610fcb575b50876101a0515260046020526101a0519360408520948986556001600160401b038711610fb35750610ac986610ac06001880154612a48565b60018801612ff1565b856101a051601f8211600114610f44576101a05191610f39575b508660011b906000198860031b1c19161760018601555b6002850180546001600160a01b0319166001600160a01b0389161790556001600160401b0382116103a5578190610b4182610b386003890154612a48565b60038901612ff1565b6101a05190601f8311600114610ec9576101a05192610ebe575b50508160011b916000199060031b1c19161760038401555b6001600160401b0361022051116103a557610ba161022051610b986004860154612a48565b60048601612ff1565b6101a051601f6102205111600114610e47576101a051610220519182610e39575b508160011b916000199060031b1c19161760048401555b42600584015585600684015560078301610100815460ff60a435169061ffff1916171790556001600160401b0361016051116103a5576101605190610c2c6008850192610c268454612a48565b84612ff1565b6101a05161016051601f8111600114610dc8575090600d949392916101a05190610160519283610dbd575b50508160011b916000199060031b1c19161790555b60098201610c83610c7d8254612a48565b82612fc9565b7f4d65646963616c20456d657267656e63790000000000000000000000000000229055600a8201805460ff19169055600c8201556101405151910195906001600160401b0381116103a557600160401b81116103a5578654818855808210610d9b575b5060206101405101966101a051526101a0519660208820975b828110610d87576020888888827f32492723308f5c8556a5b537c5b899b810280369c6292d69c3553d94a86034c760408b8b610d4d858451848482378b81868101600581520301902061316c565b818351928392833781016101a0518152039020938151958652610d7488870160a435612bde565b6001600160a01b031694a4604051908152f35b60019060208351930192818b015501610cff565b610db790886101a051528260206101a051209182019101612fb2565b87610ce6565b013590508b80610c57565b601f1916918382526101a0519160208320925b848110610e21575091600d969594939160019361016051809410610e07575b505050811b019055610c6c565b0135600019600384901b60f8161c191690558b8080610dfa565b90926020600181928686013581550194019101610ddb565b90506102005101358a610bc2565b6004840181526101a0519060208220610220519161020051905b601f1984168510610ea6576001945083601f19811610610e8c575b505050811b016004840155610bd9565b0135600019600384901b60f8161c191690558a8080610e7c565b81810135835560209485019460019093019201610e61565b013590508a80610b5b565b6003870182526101a05160208120909450915b601f1984168510610f21576001945083601f19811610610f07575b505050811b016003840155610b73565b0135600019600384901b60f8161c191690558a8080610ef7565b81810135835560209485019460019093019201610edc565b90508a01358b610ae3565b6001870181526101a0516020812092505b8c601f198a168210610f9b57505087601f19811610610f81575b5050600186811b016001860155610afa565b8b0135600019600389901b60f8161c191690558a80610f6f565b60018394602093948493013581550193019101610f55565b634e487b7160e01b905260416004526101a051602490fd5b9092506020813d602011610ff7575b81610fe760209383612acf565b810103126101d857519189610a87565b3d9150610fda565b60405162461bcd60e51b815260206004820152601c60248201527f4e6f20656d657267656e637920646f63756d656e747320666f756e64000000006044820152606490fd5b60019061105260e051612af0565b610180515260206101805101610180528160e0510160e05201610818565b6110889060203d60201161047c5761046e8183612acf565b60a052896107d6565b60405162461bcd60e51b815260206004820152601060248201526f115b5c1d1e4818dc9959195b9d1a585b60821b6044820152606490fd5b60405162461bcd60e51b815260206004820152600a602482015269456d707479206e616d6560b01b6044820152606490fd5b506008546084351115610759565b60405162461bcd60e51b815260206004820152601160248201527024b73b30b634b2103932b9b837b73232b960791b6044820152606490fd5b60405162461bcd60e51b815260206004820152600b60248201526a125b9d985b1a590811125160aa1b6044820152606490fd5b61118e915060203d60201161047c5761046e8183612acf565b88610730565b60405163e2517d3f60e01b81523360048201526000805160206135038339815191526024820152604490fd5b346101d8576020806003193601126101d8576004356101a051526006815260406101a05120908154916111f2836131bf565b926112006040519485612acf565b80845282840180926101a051526101a0519084822091905b8382106112c55750505050604051918083019381845251809452604083019360408160051b85010192916101a051955b8287106112555785850386f35b9091929382806112b5600193603f198a8203018652885180518252858060a01b03848201511684830152604081015160408301526112a26060808301519060a08091860152840190612bb9565b9160808092015191818403910152612bb9565b9601920196019592919092611248565b60409695965160a081018181106001600160401b038211176103a5576001926005928a9260405286548152848060a01b038588015416838201526002870154604082015261131560038801612af0565b606082015261132660048801612af0565b6080820152815201930191019091959495611218565b346101d85760203660031901126101d85760606101c060405161135e81612a82565b6101a05181528260208201526101a051604082015282808201528260808201526101a05160a08201526101a05160c08201526101a05160e08201526101a05161010082015282610120820152826101408201526101a0516101608201526101a0516101808201526101a0516101a082015201526004356101a05152600460205260406101a051206040516113f181612a82565b8154815261140160018301612af0565b602082015260028201546001600160a01b0316604082015261142560038301612af0565b606082015261143660048301612af0565b6080820152600582015460a0820152600682015460c0820152600782015491600360ff841610156115f157600d6114d19160ff858161056c971660e087015260081c16151561010085015261148d60088201612af0565b61012085015261149f60098201612af0565b61014085015260ff600a820154161515610160850152600b810154610180850152600c8101546101a0850152016133a4565b6101c082015260405191829160208352805160208401526101c06115b86115a061155361153d61151260208701516101e060408b01526102008a0190612bb9565b60408701516001600160a01b031660608a810191909152870151898203601f190160808b0152612bb9565b6080860151888203601f190160a08a0152612bb9565b60a085015160c088015260c085015160e088015261157a60e0860151610100890190612bde565b6101008501511515610120880152610120850151601f1988830301610140890152612bb9565b610140840151868203601f1901610160880152612bb9565b9161016081015115156101808601526101808101516101a08601526101a0810151828601520151601f19848303016101e0850152612cbd565b634e487b7160e01b6101a05152602160045260246101a051fd5b346101d8576101a0518060031936011261050957600a546040516001600160a01b039091168152602090f35b346101d8576101a0518060031936011261050957602090604051908152f35b346101d85760403660031901126101d8576024356004356101a0515260066020526101a051604081209081548310156105095752600560206101a05120910201805461056c60018060a01b03600184015416926116ee6002820154916116ca60046116c360038401612af0565b9201612af0565b9260405196879687526020870152604086015260a0606086015260a0850190612bb9565b908382036080850152612bb9565b346101d85760403660031901126101d857611715612c01565b6004356101a051526101a05180602052604081209160018060a01b03169052602052602060ff60406101a0512054166040519015158152f35b346101d8576101a051806003193601126105095761176a612d0a565b6117726131a1565b600160ff19815416176001557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586020604051338152a16101a05180f35b346101d8576101a051806003193601126105095760206040517fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217758152f35b346101d85760203660031901126101d8576004356001600160401b0381116101d85761183f602061182561056c933690600401612c1c565b9190826040519384928337810160058152030190206133a4565b604051918291602083526020830190612cbd565b346101d85760203660031901126101d8576004356001600160401b0381116101d8576020611825611888923690600401612c1c565b6101a051805b82518110156118d2576118aa6118a482856131d6565b51613357565b6118bd575b6118b89061313a565b61188e565b906118ca6118b89161313a565b9190506118af565b506118dc90613325565b906101a051805b825181101561192957806118fd6118a461190693866131d6565b61190b5761313a565b6118e3565b61191581856131d6565b516109916119228561313a565b94876131d6565b6040516020808252819061056c90820187612cbd565b346101d85760203660031901126101d857602061195d600435613357565b6040519015158152f35b346101d85760403660031901126101d8576004356001600160401b0381116101d857366023820112156101d8576119a8903690602481600401359101612c49565b6119c46020602435928160405193828580945193849201612b96565b8101600581520301902080548210156101d8576020916119e391612c8f565b90546040519160031b1c8152f35b346101d8576101a0518060031936011261050957602060ff600154166040519015158152f35b346101d8576101a05180600319360112610509576009546040516001600160a01b039091168152602090f35b346101d85760803660031901126101d8576001600160401b036004358181116101d857611a74903690600401612c1c565b9091611a7e612c01565b906064358181116101d857611a97903690600401612c1c565b92611aa0612d0a565b60328410611e5357611ab130612daa565b5060075494611abf8661313a565b600755611ace6044354261315f565b90866101a05152602097600489526101a0519560408720968988556001880190828511610fb35750611b0a84611b048354612a48565b83612ff1565b836101a051601f8211600114611dea576101a05191611ddf575b508460011b906000198660031b1c19161790555b6002870180546001600160a01b0319166001600160a01b039096169586179055600387018054611b6b90610c7d90612a48565b602471456d657267656e6379204f7665727269646560701b01905560048701611b97610c7d8254612a48565b601c6d2437b9b834ba30b61020b236b4b760911b0190554260058801558360068801556007870161010261ffff1982541617905560088701611bdc610c7d8254612a48565b7f4f76657272696465202d204e6f20475053000000000000000000000000000022905587116103a557888660098a9801611c1a8a611b048354612a48565b896101a051601f8211600114611d185794611cc78b8096600a7f32492723308f5c8556a5b537c5b899b810280369c6292d69c3553d94a86034c7976040977fa735c895884062b6f682aa10441bda74e37cc521d971905fa2b4dd0b2fdfa11f9f9d9b97611cf99f9d988f9082916101a05192611d0d575b50508160011b916000199060031b1c19161790555b01805460ff191690558551908585833781868101600581520301902061316c565b818351928392833781016101a051815203902093815190815260028d820152a4604051946040865260408601916130da565b9242868201528033940390a3604051908152f35b013590508f80611c91565b8281526101a05190858220915b601f1984168110611dc257508b8096600a7f32492723308f5c8556a5b537c5b899b810280369c6292d69c3553d94a86034c7976040977fa735c895884062b6f682aa10441bda74e37cc521d971905fa2b4dd0b2fdfa11f9f9d9b96611cf99f9d988f91600192611cc79983601f19811610611da8575b505050811b019055611ca6565b0135600019600384901b60f8161c191690558f8038611d9b565b818c013583558e9c508d9350600190920191908601908601611d25565b90508301358c611b24565b8281526101a0518d81209290601f198216908f5b828210611e3657505010611e1c575b5050600184811b019055611b38565b840135600019600387901b60f8161c191690558b80611e0d565b80929350600185968293968b013581550195019301889291611dfe565b60405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e74206a757374696669636174696f6e0000000000006044820152606490fd5b346101d85760403660031901126101d8576004356001600160a01b03818116918290036101d857611ec7612c01565b611ecf612d0a565b821561263a5781169182156125f5576009549182166125ba576bffffffffffffffffffffffff60a01b80921617600955600a541617600a55604051606081018181106001600160401b038211176103a557604052611f2b612f38565b8152611f35612f5e565b6020820152611f42612f83565b60408201526101a051805260036020526101a05190604082209182805491600382558260031061253d575b505050906101a051526101a051906020822091905b6003821061245a5760405160c081018181106001600160401b038211176103a557604052611fae612f38565b8152611fb8612f5e565b6020820152611fc5612f83565b6040820152611fd2613036565b6060820152611fdf61305f565b6080820152611fec61308d565b60a082015260016101a0515260036020526101a0519060408220918280549160068255826006106123dd575b505050906101a051526101a051906020822091905b600682106122f75760405161014081018181106001600160401b038211176103a55760405261205a612f38565b8152612064612f5e565b6020820152612071612f83565b604082015261207e613036565b606082015261208b61305f565b608082015261209861308d565b60a08201526040516120a981612ab4565b600b81526a4c41425f524553554c545360a81b602082015260c08201526040516120d281612ab4565b6007815266494d4147494e4760c81b602082015260e08201526040516120f781612ab4565b600d81526c505245534352495054494f4e5360981b602082015261010082015260405161212381612ab4565b600f81526e4d45444943414c5f484953544f525960881b602082015261012082015260026101a0515260036020526101a05190604082209182805491600a825582600a1061227a575b505050906101a051526101a051906020822091905b600a8210612190576101a05180f35b80518051906001600160401b0382116103a5576121b7826121b18754612a48565b87612ff1565b6101a05190602091601f841160011461220b575092826001949360209386956101a05192612200575b5050600019600383901b1c191690841b1786555b01930191019091612181565b0151905088806121e0565b8690526101a05160208120929190601f198516905b8181106122625750936020936001969387969383889510612249575b505050811b0186556121f4565b015160001960f88460031b161c1916905588808061223c565b82840151855560019094019360209384019301612220565b52600a60206101a0512091820191015b81811061229857839061216c565b806122a560019254612a48565b806122b2575b500161228a565b601f9081811184146122cd5750506101a05181555b856122ab565b826101a051526122ee6101a0519260208420920160051c8201858301612fb2565b818355556122c7565b80518051906001600160401b0382116103a557612318826121b18754612a48565b6101a0519085602092601f851160011461236e57505092826001949360209386956101a05192612363575b5050600019600383901b1c191690841b1786555b0193019101909161202d565b015190508880612343565b526101a051602081209291905b601f19851681106123c5575083602093600196938796938794601f198116106123ac575b505050811b018655612357565b015160001960f88460031b161c1916905588808061239f565b8282015184556001909301926020928301920161237b565b52600660206101a0512091820191015b8181106123fb578390612018565b8061240860019254612a48565b80612415575b50016123ed565b601f9081811184146124305750506101a05181555b8561240e565b826101a051526124516101a0519260208420920160051c8201858301612fb2565b8183555561242a565b80518051906001600160401b0382116103a55761247b826121b18754612a48565b6101a05190602091601f84116001146124cf575092826001949360209386956101a051926124c4575b5050600019600383901b1c191690841b1786555b01930191019091611f82565b0151905088806124a4565b8690526101a05160208120929190601f198516905b81811061252557509260019592859287966020961061250c575b505050831b830186556124b8565b015160001960f88460031b161c191690558780806124fe565b838301518555600190940193602093840193016124e4565b52600360206101a0512091820191015b81811061255b578390611f6d565b8061256860019254612a48565b80612575575b500161254d565b601f9081811184146125905750506101a05181555b8561256e565b826101a051526125b16101a0519260208420920160051c8201858301612fb2565b8183555561258a565b60405162461bcd60e51b8152602060048201526013602482015272105b1c9958591e481a5b9a5d1a585b1a5e9959606a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152601c60248201527f496e76616c69642044617461416363657373436f6e74726f6c6c6572000000006044820152606490fd5b60405162461bcd60e51b8152602060048201526013602482015272496e76616c696420444944526567697374727960681b6044820152606490fd5b346101d8576101a0518060031936011261050957612691612d0a565b60015460ff8116156126d55760ff19166001557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6020604051338152a16101a05180f35b604051638dfc202b60e01b8152600490fd5b346101d85760203660031901126101d857600435612703612d0a565b8015158061271f575b612715906130fb565b6008556101a05180f35b5062093a8081111561270c565b346101d85760403660031901126101d857612745612c01565b336001600160a01b03821603612761576105ec90600435612ec3565b60405163334bd91960e11b8152600490fd5b346101d85760403660031901126101d8576105ec600435612792612c01565b90806101a051526127b0600160406101a05180602052200154612d84565b612e4a565b346101d85760203660031901126101d857600435806101a0515260046020526127fb60406101a05120916127f660018060a01b0360028501541633146134c5565b613357565b1561280f57600c6020910154604051908152f35b60405162461bcd60e51b815260206004820152600e60248201526d1058d8d95cdcc8195e1c1a5c995960921b6044820152606490fd5b346101d8576101a051806003193601126105095760206040516000805160206135038339815191528152f35b346101d85760203660031901126101d8576004356101a051526020600160406101a051808452200154604051908152f35b346101d85760203660031901126101d8576004356101a0515260046020526101a051604090208054600182016128d790612af0565b60028301549092906001600160a01b03166128f460038301612af0565b9161290160048201612af0565b600582015460068301549060078401546008850161291e90612af0565b9261292b60098701612af0565b94600a87015460ff1698600b88015497600c0154986040519c8d9c8d528c6101c06020819201528d0161295d91612bb9565b9060408d01528b810360608d015261297491612bb9565b8a810360808c015261298591612bb9565b9260a08a015260c089015260e0880160ff8216906129a291612bde565b60081c60ff1615156101008801528681036101208801526129c291612bb9565b8581036101408701526129d491612bb9565b9215156101608501526101808401526101a08301520390f35b34612a44576020366003190112612a445760043563ffffffff60e01b8116809103612a405760209250637965db0b60e01b8114908115612a2f575b5015158152f35b6301ffc9a760e01b14905083612a28565b8280fd5b5080fd5b90600182811c92168015612a78575b6020831014612a6257565b634e487b7160e01b600052602260045260246000fd5b91607f1691612a57565b6101e081019081106001600160401b03821117612a9e57604052565b634e487b7160e01b600052604160045260246000fd5b604081019081106001600160401b03821117612a9e57604052565b90601f801991011681019081106001600160401b03821117612a9e57604052565b9060405191826000825492612b0484612a48565b908184526001948581169081600014612b735750600114612b30575b5050612b2e92500383612acf565b565b9093915060005260209081600020936000915b818310612b5b575050612b2e93508201013880612b20565b85548884018501529485019487945091830191612b43565b915050612b2e94506020925060ff191682840152151560051b8201013880612b20565b60005b838110612ba95750506000910152565b8181015183820152602001612b99565b90602091612bd281518092818552858086019101612b96565b601f01601f1916010190565b906003821015612beb5752565b634e487b7160e01b600052602160045260246000fd5b602435906001600160a01b0382168203612c1757565b600080fd5b9181601f84011215612c17578235916001600160401b038311612c175760208381860195010111612c1757565b9291926001600160401b038211612a9e5760405191612c72601f8201601f191660200184612acf565b829481845281830111612c17578281602093846000960137010152565b8054821015612ca75760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b90815180825260208080930193019160005b828110612cdd575050505090565b835185529381019392810192600101612ccf565b6003811015612beb576000526003602052604060002090565b3360009081527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260409020547fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff1615612d665750565b6044906040519063e2517d3f60e01b82523360048301526024820152fd5b80600052600060205260406000203360005260205260ff6040600020541615612d665750565b6001600160a01b031660008181527f135e4043bdf5a7d17bf428b8b7d7ff12f5d9b05899a7fb2824e3d582f100ecec60205260408120549091906000805160206135038339815191529060ff16612e4557808352826020526040832082845260205260408320600160ff198254161790557f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339380a4600190565b505090565b9060009180835282602052604083209160018060a01b03169182845260205260ff60408420541615600014612e4557808352826020526040832082845260205260408320600160ff198254161790557f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339380a4600190565b9060009180835282602052604083209160018060a01b03169182845260205260ff604084205416600014612e455780835282602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4600190565b60405190612f4582612ab4565b600a825269424c4f4f445f5459504560b01b6020830152565b60405190612f6b82612ab4565b6009825268414c4c45524749455360b81b6020830152565b60405190612f9082612ab4565b601382527243555252454e545f4d454449434154494f4e5360681b6020830152565b818110612fbd575050565b60008155600101612fb2565b90601f8111612fd6575050565b612b2e91600052601f6020600020910160051c810190612fb2565b9190601f811161300057505050565b612b2e926000526020600020906020601f840160051c8301931061302c575b601f0160051c0190612fb2565b909150819061301f565b6040519061304382612ab4565b600d82526c524543454e545f56495349545360981b6020830152565b6040519061306c82612ab4565b60128252714348524f4e49435f434f4e444954494f4e5360701b6020830152565b6040519061309a82612ab4565b6012825271454d455247454e43595f434f4e544143545360701b6020830152565b90816020910312612c1757516001600160a01b0381168103612c175790565b908060209392818452848401376000828201840152601f01601f1916010190565b1561310257565b60405162461bcd60e51b815260206004820152601060248201526f24b73b30b634b210323ab930ba34b7b760811b6044820152606490fd5b60001981146131495760010190565b634e487b7160e01b600052601160045260246000fd5b9190820180921161314957565b8054600160401b811015612a9e5761318991600182018155612c8f565b819291549060031b91821b91600019901b1916179055565b60ff600154166131ad57565b60405163d93c066560e01b8152600490fd5b6001600160401b038111612a9e5760051b60200190565b8051821015612ca75760209160051b010190565b81601f82011215612c1757805191613201836131bf565b9261320f6040519485612acf565b808452602092838086019260051b820101928311612c17578301905b828210613239575050505090565b8151815290830190830161322b565b9091606082840312612c17578151926001600160401b0393848111612c1757816132739185016131ea565b9360209081850151818111612c17578361328e9187016131ea565b946040810151918211612c1757019180601f84011215612c175782516132b3816131bf565b936132c16040519586612acf565b818552838086019260051b820101928311612c17578301905b8282106132e8575050505090565b81518015158103612c175781529083019083016132da565b6001600160a01b03909116815260406020820181905261332292910190612bb9565b90565b9061332f826131bf565b61333c6040519182612acf565b828152809261334d601f19916131bf565b0190602036910137565b6000526004602052604060002060ff600782015460081c16158015613396575b613390576006015442101561338b57600190565b600090565b50600090565b5060ff600a82015416613377565b9060405191828154918282526020928383019160005283600020936000905b8282106133d957505050612b2e92500383612acf565b8554845260019586019588955093810193909101906133c3565b909161341760409284845195869283378101600581526020958691030190206133a4565b9160005b83518110156134b85761342e81856131d6565b5160009081526004865282902060028101546001600160a01b0385811691161490816134a6575b81613496575b81613488575b506134745761346f9061313a565b61341b565b9291505061348292506131d6565b51600191565b600691500154421038613461565b600a81015460ff1615915061345b565b600781015460081c60ff169150613455565b5050505050600090600090565b156134cc57565b60405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606490fdfe2528cc2d3e0fe8cd3e521ea7fdf10b42eda63d5c2a3f2b2d773527d2330a7198a26469706673582212201a1ade7c55796037e7f160cb098bcac9e4b85be864c1afe7e611a3a4f9e73d8964736f6c634300081400332f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d",
  "Marketplace": "0x6080604052346200003c576001600255600f6007556200001f3362000041565b506200002b33620000c1565b506040516131599081620001648239f35b600080fd5b6001600160a01b031660008181527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5602052604081205490919060ff16620000bd57818052816020526040822081835260205260408220600160ff198254161790553391600080516020620032bd8339815191528180a4600190565b5090565b6001600160a01b031660008181527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260408120549091907fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff166200015e57808352826020526040832082845260205260408320600160ff19825416179055600080516020620032bd833981519152339380a4600190565b50509056fe608080604052600436101561001d575b50361561001b57600080fd5b005b600090813560e01c90816301ffc9a7146122f257508063043439c5146122d45780632335bb2914612214578063248a9ca3146121e85780632f2ff15d146121ab57806336568abe146121635780633f4ba83a146120f85780634c8bd11414611c5157806350f2aab314611c16578063577f9fb114611bed5780635c975abb14611bca578063611d2c9614611a9257806369d7dc061461156757806375b238fc1461153e5780638456cb59146114e457806391d148541461149957806391db16dd14611202578063987ddf49146111d95780639d8fdcf91461115f578063a217fddf14611143578063aa0b5988146110a9578063b1f406fc1461100d578063ba95491114610920578063c0c53b8b14610792578063ca039cac14610753578063cdd78cfc14610735578063d44caf8914610690578063d547741f1461064f578063e5f299911461053c578063ecc6cbb4146102cb578063ee43548d1461024d578063f065536e146101bc5763f1c6bdf80361000f57346101b957806003193601126101b957600a546040516001600160a01b039091168152602090f35b80fd5b50346101b95760403660031901126101b9576004356001600160401b0381116102495736602382011215610249576101fe903690602481600401359101612690565b9061021b60206024359381604051938285809451938492016124f0565b810160058152030190209081548310156101b957602061023b8484612647565b90546040519160031b1c8152f35b5080fd5b50346101b95760203660031901126101b957610294600435808352600360205260018060a01b0360016040852001541633148015610297575b61028f90612f0b565b612f81565b80f35b50600080516020613104833981519152835282602052604083203360005260205261028f60ff604060002054169050610286565b50346101b95760203660031901126101b957806101a06040516102ed816124b3565b82815282602082015260606040820152606080820152606060808201528260a08201528260c08201528260e0820152826101008201528261012082015282610140820152826101608201526060610180820152015260043581526003602052604081206040519061035d826124b3565b8054825260018101546001600160a01b0316602083015260405161038f8161038881600286016123f4565b03826124cf565b60408301526040516103a88161038881600386016123f4565b60608301526040516103c18161038881600486016123f4565b6080830152600581015460a0830152600681015460c0830152600781015460e083015260088101546101008301526009810154610120830152600a81015461014083015260ff600b82015416600481101561052857610160830152600d9061042b600c8201612a4d565b61018084015201546101a08201526040518091602082528051602083015260018060a01b0360208201511660408301526101a061051b6104ae61049861048260408601516101c060608901526101e0880190612513565b6060860151878203601f19016080890152612513565b6080850151868203601f190160a0880152612513565b60a084015160c086015260c084015160e086015260e0840151610100860152610100840151610120860152610120840151610140860152610140840151610160860152610505610160850151610180870190612538565b610180840151858203601f19018487015261255b565b9101516101c08301520390f35b634e487b7160e01b84526021600452602484fd5b50346101b957806003193601126101b9578080600654905b81811061060a575061056583612a36565b9261057360405194856124cf565b808452610582601f1991612a36565b0191602092368486013780805b8381106105ad57604051858152806105a9818801896125b7565b0390f35b8082526003855260ff600b6040842001541660048110156105f657906105d791156105dc576128bd565b61058f565b806105f06105e9866128bd565b9589612abf565b526128bd565b634e487b7160e01b83526021600452602483fd5b808352600360205260ff600b604085200154166004811015610528571561063a575b610635906128bd565b610554565b92610647610635916128bd565b93905061062c565b50346101b95760403660031901126101b95761068c60043561066f612347565b9080845283602052610687600160408620015461272f565b6127d3565b5080f35b50346101b957602080600319360112610249576004356001600160401b038111610731576106c38291369060040161235d565b91908260405193849283378101600581520301902091604051809384918482549182815201918452848420935b8582821061071b57505050610707925003836124cf565b6105a96040519282849384528301906125b7565b85548452600195860195889550930192016106f0565b8280fd5b50346101b957806003193601126101b9576020600754604051908152f35b50346101b95760203660031901126101b95761077e60406105a9926004358152600460205220612a4d565b60405191829160208352602083019061255b565b50346101b95760603660031901126101b9576004356001600160a01b038181169182900361091b576107c2612347565b9160443592828416809403610917576107d96126c7565b81156108dc5782169081156108a357831561085e57600854928316610823576bffffffffffffffffffffffff60a01b80931617600855816009541617600955600a541617600a5580f35b60405162461bcd60e51b8152602060048201526013602482015272105b1c9958591e481a5b9a5d1a585b1a5e9959606a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152601860248201527f496e76616c6964205061796d656e7450726f636573736f7200000000000000006044820152606490fd5b60405162461bcd60e51b8152602060048201526011602482015270496e76616c696420446174614c6561736560781b6044820152606490fd5b60405162461bcd60e51b8152602060048201526013602482015272496e76616c696420444944526567697374727960681b6044820152606490fd5b8480fd5b600080fd5b50346101b95760603660031901126101b9576001600160401b03906024358281116102495761095390369060040161235d565b926044359081116107315761096c90369060040161238a565b610974612a04565b6002805414610ffb576002805560043584526003602052604084209160ff600b840154166004811015610fe757610faf57600683015460058401541115610f7d5760085460405163393f2dc560e01b8152602060048201819052909182906001600160a01b031681806109eb602482018d8c6129e3565b03915afa908115610d96578691610f43575b50336001600160a01b0390911603610f0e57610a25610a1d368887612690565b600435612eac565b610ed7578115610e9a57610a3882612a36565b610a4560405191826124cf565b82815260208101368460051b840111610d5a5782905b8460051b84018210610e8a575050610a8090610a79600c8601612a4d565b9033612c69565b15610e3a576009546001840154600a8501546001600160a01b03918216949290911690610aae904290612ab2565b60078601546040516331b803e360e01b815260e060048201529586928a9290610adb60e486018e8d6129e3565b9260043560248701526044860152606485015260848401526003198382030160a4840152600c880154808252602082019060208160051b84010192600c8b018552602085209285915b838310610e0a5750505050508281036003190160c484015260038801548291610b4c826123ba565b8082529160018116908115610de65750600114610da1575b50506020939183809203925af1928315610d96578693610d5e575b506009546001600160a01b031690813b15610d5a5760408051632e907e2360e11b815260048101869052602481019190915260448101829052926001600160fb1b038211610d5657918388606482858397829760051b908484013760051b81010301925af18015610d4b57908591610d33575b50506004358452600460205260408420948554600160401b9687821015610d1f5790610c2391600182018155612647565b610d0b578185610c32926128e3565b604051818582376020818381016005815203019020805496871015610cf75786610c659160016005979899018155612647565b81549060031b90600435821b91600019901b1916179055610c8960068401546128bd565b948560068501558160405192839283378101878152039020906040519081524260208201527f4b4b03c0adf2a19220c86cce00410ddeea0c1f0e33fcd153bcb7d0e98c501bf7604060043592a301541115610ce7575b600160025580f35b610cf2600435612f81565b610cdf565b634e487b7160e01b86526041600452602486fd5b634e487b7160e01b86526004869052602486fd5b634e487b7160e01b87526041600452602487fd5b610d3c9061248a565b610d47578338610bf2565b8380fd5b6040513d87823e3d90fd5b8780fd5b8680fd5b9092506020813d602011610d8e575b81610d7a602093836124cf565b81010312610d8a57519138610b7f565b8580fd5b3d9150610d6d565b6040513d88823e3d90fd5b909150600389018352602083209183925b818410610dc6575050016020018183610b64565b600191955060209294508054838587010152019101909187938b93610db2565b60ff191660208381019190915292151560051b909101909101915082905083610b64565b9295509295509260206001610e298193601f19868203018752896123f4565b9701930193018995938d9592610b24565b60405162461bcd60e51b815260206004820152602260248201527f446f63756d656e747320646f6e2774206d6174636820726571756972656d656e604482015261747360f01b6064820152608490fd5b8135815260209182019101610a5b565b60405162461bcd60e51b8152602060048201526015602482015274139bc8191bd8dd5b595b9d1cc81cd95b1958dd1959605a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e48185c1c1b1a5959608a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152600d60248201526c2737ba102224a21037bbb732b960991b6044820152606490fd5b90506020813d602011610f75575b81610f5e602093836124cf565b81010312610d8a57610f6f90612a22565b386109fd565b3d9150610f51565b60405162461bcd60e51b815260206004820152600a60248201526914dd1d591e48199d5b1b60b21b6044820152606490fd5b60405162461bcd60e51b815260206004820152601060248201526f5374756479206e6f742061637469766560801b6044820152606490fd5b634e487b7160e01b86526021600452602486fd5b604051633ee5aeb560e01b8152600490fd5b50346101b95760203660031901126101b95760043581526003602052600b6040822060018060a01b0360018201541633148015611075575b61104e90612f0b565b01805460ff81166004811015610528579061106b60019215612f48565b60ff191617905580f35b50600080516020613104833981519152835282602052604083203360005260205261104e60ff604060002054169050611045565b50346101b95760203660031901126101b9576004356110c66126c7565b601e811161110f5760607f50f8ab96ec41b29e295dbc21aa964857bd7ba51c554c209db631610ce392d4569160075490806007556040519182526020820152426040820152a180f35b60405162461bcd60e51b815260206004820152600c60248201526b08ccaca40e8dede40d0d2ced60a31b6044820152606490fd5b50346101b957806003193601126101b957602090604051908152f35b50346101b95760403660031901126101b95760243560043582526004602052604082209081548110156107315761119591612647565b9190916111c5576040516105a9906111b18161038881876123f4565b604051918291602083526020830190612513565b634e487b7160e01b81526004819052602490fd5b50346101b957806003193601126101b9576009546040516001600160a01b039091168152602090f35b50346101b95760403660031901126101b9576024356001600160401b0381116102495761123661127891369060040161235d565b90926004358152600360205260408120602060018060a01b0395866008541694604051968792839263393f2dc560e01b845285600485015260248401916129e3565b0381865afa93841561148e578294611452575b508484161561141f57600c6112a09101612a4d565b926112ab84516130b9565b926112b685516130b9565b95835b86518110156113e35780856112d16112fc938a612abf565b5160405180948192631149250b60e21b8352878a166004840152604060248401526044830190612513565b0381875afa8015610d965786879161134a575b611345935061131e838a612abf565b526113298289612abf565b50611334828b612abf565b5261133f818a612abf565b506128bd565b6112b9565b5050903d908187823e61135d82826124cf565b6060818381010312610d5a5780516001600160401b038111610d565761138890838301908301612ae0565b9060208101516001600160401b0381116113df576113ab90848301908301612ae0565b926040820151906001600160401b0382116113db57916113d5916113459695949382019101612c03565b5061130f565b8980fd5b8880fd5b611403876105a98a6114118a60405195869560608752606087019061255b565b9085820360208701526125eb565b9083820360408501526125eb565b60405162461bcd60e51b815260206004820152600b60248201526a125b9d985b1a590811125160aa1b6044820152606490fd5b9093506020813d602011611486575b8161146e602093836124cf565b810103126102495761147f90612a22565b923861128b565b3d9150611461565b6040513d84823e3d90fd5b50346101b95760403660031901126101b95760406114b5612347565b91600435815280602052209060018060a01b0316600052602052602060ff604060002054166040519015158152f35b50346101b957806003193601126101b9576114fd6126c7565b611505612a04565b600160ff19815416176001557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586020604051338152a180f35b50346101b957806003193601126101b95760206040516000805160206131048339815191528152f35b50346101b957602090816003193601126101b957600435611586612a04565b6009546040516327d1195f60e21b8152600481018390526024946001600160a01b03939192909190841685848881845afa938415610d96578694611921575b506040840151865260038352604086209185600184015416331480156118f7575b6115ef90612f0b565b6101808501516118b357813b15610d5a57869188839260405194859384926388685cd960e01b845260048401525af18015610d96576118a0575b50600781015493600754801561188d57806000190486116118495761165060649187612894565b049485811061180f578387986116698861169594612ab2565b968285600854169101519160405180958194829363393f2dc560e01b8452876004850152830190612513565b03915afa9081156117bb5787916117da575b5081600a541690835495823b156113df57604051637633f96d60e01b80825260048201989098526001600160a01b0392909216602483015260448201529087908290606490829084905af19081156117bb5787916117c6575b5050600a54169054604051637d157ced60e11b81528381600481865afa9384156117bb578794611783575b5050813b15610d8a5760405193845260048401526001600160a01b0391909116602483015260448201929092529082908290606490829084905af1801561148e576117735750f35b61177c9061248a565b6101b95780f35b9080929450813d83116117b4575b61179b81836124cf565b81010312610d8a576117ac90612a22565b91388061172b565b503d611791565b6040513d89823e3d90fd5b6117cf9061248a565b610d8a578538611700565b90508381813d8311611808575b6117f181836124cf565b81010312610d5a5761180290612a22565b386116a7565b503d6117e7565b60405162461bcd60e51b8152600481018590526013818a01527211995948195e18d959591cc81c185e5b595b9d606a1b6044820152606490fd5b60405162461bcd60e51b8152600481018590526018818a01527f4665652063616c63756c6174696f6e206f766572666c6f7700000000000000006044820152606490fd5b634e487b7160e01b875260126004528787fd5b6118ac9095919561248a565b9338611629565b60405162461bcd60e51b8152600481018590526018818a01527f5061796d656e7420616c72656164792072656c656173656400000000000000006044820152606490fd5b5060008051602061310483398151915287528684526040808820338952855287205460ff166115e6565b9093503d8087833e61193381836124cf565b8101908381830312610d5a5780516001600160401b03918282116113df5701906101e09283838203126113df5760405193840184811083821117611a7f5760405282518452858301518281116113db578161198f918501612b3e565b86850152604083015160408501526119a960608401612a22565b60608501526080830151608085015260a083015160a085015260c083015160c085015260e083015160058110156113db5760e085015261010080840151838111611a7b57826119f9918601612b83565b9085015261012080840151838111611a7b5782611a17918601612ae0565b90850152610140808401519085015261016091828401519081116113db5790611a41918401612b3e565b90830152610180611a53818301612ad3565b908301526101a0611a65818301612ad3565b908301526101c0809101519082015292386115c5565b8a80fd5b634e487b7160e01b8a5260416004528a8afd5b50346101b95760203660031901126101b95760043581526003602052604090208054600160a01b600190036001830154169160405180806002840190611ad7916123f4565b03611ae290826124cf565b6040519182611af481600384016123f4565b03611aff90846124cf565b6040519283611b1181600485016123f4565b03611b1c90856124cf565b60058201549360068301546007840154600885015491600986015493600a87015495600b88015460ff1697600d0154986040519c8d9c8d5260208d01528b6101a06040819201528c01611b6e91612513565b8b810360608d0152611b7f91612513565b8a810360808c0152611b9091612513565b9760a08a015260c089015260e08801526101008701526101208601526101408501526101608401611bc091612538565b6101808301520390f35b50346101b957806003193601126101b957602060ff600154166040519015158152f35b50346101b957806003193601126101b9576008546040516001600160a01b039091168152602090f35b50346101b957806003193601126101b95760206040517f7765bfe615aab9fb9a16bd4c5c9b353f39dae79ca7da86094b0a74ea8a89e59a8152f35b5060e03660031901126101b9576004356001600160401b03811161024957611c7d90369060040161235d565b90916024356001600160401b03811161024957611c9e90369060040161235d565b91906044356001600160401b03811161073157611cbf90369060040161235d565b909360c4356001600160401b03811161091757611ce090369060040161238a565b919092611ceb612a04565b87156120c557606435158015611d0081612848565b6084351561208e5762278d0060a4351061205457611d1d90612848565b61204057606435600019046084351161200b57611d3e606435608435612894565b3410611fd0578796611d99611da2938b97611d906006549c8d9a611d618c6128bd565b6006558b8d52600360205260408d209b8c5560018c0180546001600160a01b0319163317905560028c016128e3565b600389016128e3565b600486016128e3565b6064356005840155836006840155608435600784015534600884015542600984015560a4354201804211611fbc57600a840155600b8301805460ff19169055600160401b8111611fa857600c83015481600c850155808210611f33575b5081600c84018552602085209285915b838310611edc575050505050600d4291015560018060a01b03600a5416803b15610249579080604492604051938480926302d3c39560e31b825288600483015233602483015234905af1908115611ed05750611ea360209585937fdcc5e0cf9069ce50b4d9e217b9a761c1203cbc9a9b96b83add7b831e50be687093611ec1575b50604051946060865260608601916129e3565b926084358682015260643560408201528033940390a3604051908152f35b611eca9061248a565b38611e90565b604051903d90823e3d90fd5b8035601e1983360301811215610d56576001600160401b038184013511610d565780830135360360208285010113610d56576020600192611f2783838695880135918801018a6128e3565b01950192019193611e0f565b600c8401855260208520908282015b8183018110611f52575050611dff565b8087611f60600193546123ba565b80611f6e575b505001611f42565b601f8082118514611f8557505081555b8738611f66565b611f9f9084845260208420920160051c82018583016128cc565b81835555611f7e565b634e487b7160e01b84526041600452602484fd5b634e487b7160e01b85526011600452602485fd5b60405162461bcd60e51b8152602060048201526013602482015272496e73756666696369656e7420657363726f7760681b6044820152606490fd5b60405162461bcd60e51b815260206004820152600d60248201526c4f766572666c6f77207269736b60981b6044820152606490fd5b634e487b7160e01b86526012600452602486fd5b60405162461bcd60e51b8152602060048201526012602482015271111d5c985d1a5bdb881d1bdbc81cda1bdc9d60721b6044820152606490fd5b60405162461bcd60e51b815260206004820152600f60248201526e125b9d985b1a59081c185e5b595b9d608a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152600b60248201526a456d707479207469746c6560a81b6044820152606490fd5b50346101b957806003193601126101b9576121116126c7565b60015460ff8116156121515760ff19166001557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6020604051338152a180f35b604051638dfc202b60e01b8152600490fd5b50346101b95760403660031901126101b95761217d612347565b336001600160a01b038216036121995761068c906004356127d3565b60405163334bd91960e11b8152600490fd5b50346101b95760403660031901126101b95761068c6004356121cb612347565b90808452836020526121e3600160408620015461272f565b612755565b50346101b95760203660031901126101b957600160406020926004358152808452200154604051908152f35b50346101b95760203660031901126101b95760043581526003602052600b6040822060018060a01b03600182015416331480156122a7575b61225590612f0b565b01805460ff81166004811015610528576001036122755760ff1916905580f35b60405162461bcd60e51b815260206004820152600a602482015269139bdd081c185d5cd95960b21b6044820152606490fd5b5060008051602061310483398151915283526020838152604080852033865290915283205460ff1661224c565b50346101b957806003193601126101b9576020600654604051908152f35b9050346102495760203660031901126102495760043563ffffffff60e01b81168091036107315760209250637965db0b60e01b8114908115612336575b5015158152f35b6301ffc9a760e01b1490503861232f565b602435906001600160a01b038216820361091b57565b9181601f8401121561091b578235916001600160401b03831161091b576020838186019501011161091b57565b9181601f8401121561091b578235916001600160401b03831161091b576020808501948460051b01011161091b57565b90600182811c921680156123ea575b60208310146123d457565b634e487b7160e01b600052602260045260246000fd5b91607f16916123c9565b9060009291805491612405836123ba565b9182825260019384811690816000146124675750600114612427575b50505050565b90919394506000526020928360002092846000945b838610612453575050505001019038808080612421565b80548587018301529401938590820161243c565b9294505050602093945060ff191683830152151560051b01019038808080612421565b6001600160401b03811161249d57604052565b634e487b7160e01b600052604160045260246000fd5b6101c081019081106001600160401b0382111761249d57604052565b90601f801991011681019081106001600160401b0382111761249d57604052565b60005b8381106125035750506000910152565b81810151838201526020016124f3565b9060209161252c815180928185528580860191016124f0565b601f01601f1916010190565b9060048210156125455752565b634e487b7160e01b600052602160045260246000fd5b908082519081815260208091019281808460051b8301019501936000915b8483106125895750505050505090565b90919293949584806125a7600193601f198682030187528a51612513565b9801930193019194939290612579565b90815180825260208080930193019160005b8281106125d7575050505090565b8351855293810193928101926001016125c9565b908082519081815260208091019281808460051b8301019501936000915b8483106126195750505050505090565b9091929394958480612637600193601f198682030187528a516125b7565b9801930193019194939290612609565b805482101561265f5760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b6001600160401b03811161249d57601f01601f191660200190565b92919261269c82612675565b916126aa60405193846124cf565b82948184528183011161091b578281602093846000960137010152565b3360009081527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260409020546000805160206131048339815191529060ff16156127115750565b6044906040519063e2517d3f60e01b82523360048301526024820152fd5b80600052600060205260406000203360005260205260ff60406000205416156127115750565b9060009180835282602052604083209160018060a01b03169182845260205260ff604084205416156000146127ce57808352826020526040832082845260205260408320600160ff198254161790557f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339380a4600190565b505090565b9060009180835282602052604083209160018060a01b03169182845260205260ff6040842054166000146127ce5780835282602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4600190565b1561284f57565b60405162461bcd60e51b815260206004820152601960248201527f496e76616c6964207061727469636970616e7420636f756e74000000000000006044820152606490fd5b818102929181159184041417156128a757565b634e487b7160e01b600052601160045260246000fd5b60001981146128a75760010190565b8181106128d7575050565b600081556001016128cc565b9092916001600160401b03811161249d576128fe82546123ba565b601f81116129a6575b506000601f82116001146129425781929394600092612937575b50508160011b916000199060031b1c1916179055565b013590503880612921565b601f198216948382526020918281209281905b88821061298e57505083600195969710612974575b505050811b019055565b0135600019600384901b60f8161c1916905538808061296a565b80600184968294958701358155019501920190612955565b6129d390836000526020600020601f840160051c810191602085106129d9575b601f0160051c01906128cc565b38612907565b90915081906129c6565b908060209392818452848401376000828201840152601f01601f1916010190565b60ff60015416612a1057565b60405163d93c066560e01b8152600490fd5b51906001600160a01b038216820361091b57565b6001600160401b03811161249d5760051b60200190565b908154612a5981612a36565b92604093612a69855191826124cf565b828152809460208092019260005281600020906000935b858510612a8f57505050505050565b60018481928451612aa481610388818a6123f4565b815201930194019391612a80565b919082039182116128a757565b805182101561265f5760209160051b010190565b5190811515820361091b57565b81601f8201121561091b57805191612af783612a36565b92612b0560405194856124cf565b808452602092838086019260051b82010192831161091b578301905b828210612b2f575050505090565b81518152908301908301612b21565b81601f8201121561091b578051612b5481612675565b92612b6260405194856124cf565b8184526020828401011161091b57612b8091602080850191016124f0565b90565b9080601f8301121561091b57815190612b9b82612a36565b92612ba960405194856124cf565b828452602092838086019160051b8301019280841161091b57848301915b848310612bd75750505050505090565b82516001600160401b03811161091b578691612bf884848094890101612b3e565b815201920191612bc7565b81601f8201121561091b57805191612c1a83612a36565b92612c2860405194856124cf565b808452602092838086019260051b82010192831161091b578301905b828210612c52575050505090565b838091612c5e84612ad3565b815201910190612c44565b6008549092600092916001600160a01b03908116905b8251851015612ea157600095865b8551811015612e9757612ca08187612abf565b5160408051630593c23b60e41b81528585169260049184838201526024918282015283816044818c5afa908115612e8c576000908192612e49575b5015908115612e40575b50612e335790600091835194859263109f15a960e11b845283015281895afa918215612e2857600092612d9a575b5050612d1f8288612abf565b518151119081612d63575b50612d3d57612d38906128bd565b612c8d565b5095509360015b15612d5857612d52906128bd565b93612c7f565b505050505050600090565b612d799150612d728389612abf565b5190612abf565b51805160208092012090612d8d8988612abf565b5180519101201438612d2a565b90913d8082843e612dab81846124cf565b820191608081840312610249578051916001600160401b03928381116102495784612dd7918401612ae0565b5060208201518381116102495784612df0918401612b83565b948201518381116102495784612e07918401612ae0565b5060608201519283116101b95750612e20929101612c03565b503880612d13565b50513d6000823e3d90fd5b50505050612d38906128bd565b90501538612ce5565b91508482813d8311612e85575b612e6081836124cf565b810103126101b95750612e7e6020612e7783612ad3565b9201612ad3565b9038612cdb565b503d612e56565b84513d6000823e3d90fd5b5095949094612d44565b505050505050600190565b600052602060048152612ec26040600020612a4d565b9160005b8351811015612f0257612ed98185612abf565b5183815191012082518484012014612ef957612ef4906128bd565b612ec6565b50505050600190565b50505050600090565b15612f1257565b60405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606490fd5b15612f4f57565b60405162461bcd60e51b815260206004820152600a6024820152694e6f742061637469766560b01b6044820152606490fd5b600081815260036020526040812090600b8201805460ff811660048110156105285790612fb060029215612f48565b60ff1916179055600882015491612fdc600782015493612fd66006840195865490612894565b90612ab2565b9081613019575b50505060407f976b51d58797a828e6919a4b624201e844ff4de52e6ddbaa3b25fc15f979361991548151908152426020820152a2565b60018060a01b03600181600a541692015416813b15610d4757604051637633f96d60e01b8152600481018790526001600160a01b03919091166024820152604481019290925290919081908390606490829084905af1908115611ed05750916040917f976b51d58797a828e6919a4b624201e844ff4de52e6ddbaa3b25fc15f9793619936130aa575b819350612fe3565b6130b39061248a565b386130a2565b906130c382612a36565b6130d060405191826124cf565b82815280926130e1601f1991612a36565b019060005b8281106130f257505050565b8060606020809385010152016130e656fea49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775a264697066735822122026e6ab29b31f5441f75fea2c767ec02a4ab10cd0b327b0194e535240d1c2e81964736f6c634300081400332f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d",
  "PaymentProcessor": "0x6080346100d857601f6110fa38819003918201601f19168301916001600160401b038311848410176100dd578084926020946040528339810103126100d857516001600160a01b038116908190036100d8576001600255801561009357600680546001600160a01b031916919091179055610079336100f3565b5061008333610171565b50604051610ec890816102128239f35b60405162461bcd60e51b815260206004820152601760248201527f496e76616c696420706c6174666f726d2077616c6c65740000000000000000006044820152606490fd5b600080fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b031660008181527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5602052604081205490919060ff1661016d57818052816020526040822081835260205260408220600160ff1982541617905533916000805160206110da8339815191528180a4600190565b5090565b6001600160a01b031660008181527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260408120549091907fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff1661020c57808352826020526040832082845260205260408320600160ff198254161790556000805160206110da833981519152339380a4600190565b50509056fe6080604081815260049182361015610022575b505050361561002057600080fd5b005b600092833560e01c91826301ffc9a714610a7f57508163169e1ca81461095c578163248a9ca3146109325781632f2ff15d1461090857816332d8e65b146108d657816336568abe146108905781633f4ba83a1461082657816343674d10146107eb5781635c975abb146107c757816375b238fc1461078c5781637633f96d1461061b5781637d19e596146105f35781638456cb591461059957816391d1485414610553578163a217fddf14610538578163ada4ef301461047d578163c3439f3f14610442578163d0b7830b146102ff578163d3631fa5146102e0578163d547741f146102a1578163e796a6eb1461014f575063fa2af9da146101245780610012565b3461014b578160031936011261014b5760065490516001600160a01b039091168152602090f35b5080fd5b9190503461029d5761016036610aed565b9061016c939293610d29565b610174610e71565b7fc64aef098463840dd2000eea86952c72cddd241461d3a94e819756ea8cc7d03d90818752602091878352848820338952835260ff85892054161561027f57506001600160a01b0316946101c9861515610d47565b6101d4831515610d87565b848752600382526101ea83858920541015610dc1565b848752600382528387206101ff848254610e03565b905586808080868a5af1610211610e10565b501561024e5750825191825242908201527f279ac10417b4a21068fc6d3150dd2e5fc45320cb722f60a07d37a113a3bf3acd9190a3600160025580f35b60649184519162461bcd60e51b8352820152600d60248201526c1499599d5b990819985a5b1959609a1b6044820152fd5b845163e2517d3f60e01b815233818901526024810191909152604490fd5b8280fd5b9190503461029d578060031936011261029d576102dc91356102d760016102c6610ad2565b938387528660205286200154610bed565b610c91565b5080f35b50503461014b578160031936011261014b576020906005549051908152f35b90503461029d578260031936011261029d57610319610b91565b610321610e71565b600554908115610409576006546001600160a01b031680156103c657848080858194826005555af1610351610e10565b501561038f5750907fa8341f104131cae3e9965326a01662a1e0dc3dc60c8d099fefa4578ef8f6f9ae918151908152426020820152a1600160025580f35b606490602084519162461bcd60e51b8352820152601160248201527015da5d1a191c985dd85b0819985a5b1959607a1b6044820152fd5b835162461bcd60e51b8152602081840152601760248201527f496e76616c696420706c6174666f726d2077616c6c65740000000000000000006044820152606490fd5b606490602084519162461bcd60e51b835282015260136024820152724e6f206665657320746f20776974686472617760681b6044820152fd5b50503461014b578160031936011261014b57602090517f0ea61da3a8a09ad801432653699f8c1860b1ae9d2ea4a141fadfd63227717bc88152f35b9190503461029d57602036600319011261029d576001600160a01b0382358181169390849003610534576104af610b91565b8315610500575060207f8e48a4de7367d52e4053a25ac618738501e6235da380868ea1784ee66e74d0fc9160065493856bffffffffffffffffffffffff60a01b86161760065551934285521692a380f35b606490602084519162461bcd60e51b8352820152600e60248201526d125b9d985b1a59081dd85b1b195d60921b6044820152fd5b8480fd5b50503461014b578160031936011261014b5751908152602090f35b90503461029d578160031936011261029d578160209360ff92610574610ad2565b903582528186528282206001600160a01b039091168252855220549151911615158152f35b50503461014b578160031936011261014b5760207f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258916105d7610b91565b6105df610d29565b600160ff198154161760015551338152a180f35b90503461029d57602036600319011261029d5760209282913581526003845220549051908152f35b90503461029d5761062b36610aed565b90939192610637610d29565b61063f610e71565b610647610b17565b6001600160a01b039485169461065e861515610d47565b610669831515610d87565b848752600360205261068083858920541015610dc1565b8487526003602052838720610696848254610e03565b9055600654168503610718575090816106d27f07dd78b97459a0754e75d3d53bbd26afd8a683f317c40b50eea07d05c49f966b93600554610d06565b6005557fa8341f104131cae3e9965326a01662a1e0dc3dc60c8d099fefa4578ef8f6f9ae828051838152426020820152a15b8151908152426020820152a3600160025580f35b8580808085895af1610728610e10565b50156107575750907f07dd78b97459a0754e75d3d53bbd26afd8a683f317c40b50eea07d05c49f966b91610704565b606490602084519162461bcd60e51b8352820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152fd5b50503461014b578160031936011261014b57602090517fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217758152f35b50503461014b578160031936011261014b5760209060ff6001541690519015158152f35b50503461014b578160031936011261014b57602090517fc64aef098463840dd2000eea86952c72cddd241461d3a94e819756ea8cc7d03d8152f35b90503461029d578260031936011261029d57610840610b91565b6001549060ff821615610882575060ff1916600155513381527f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa90602090a180f35b8251638dfc202b60e01b8152fd5b83833461014b578060031936011261014b576108aa610ad2565b90336001600160a01b038316036108c757506102dc919235610c91565b5163334bd91960e11b81528390fd5b90503461029d57602036600319011261029d57803583526020908152918190205490516001600160a01b039091168152f35b9190503461029d578060031936011261029d576102dc913561092d60016102c6610ad2565b610c13565b90503461029d57602036600319011261029d57816020936001923581528085522001549051908152f35b9180915060031936011261029d57813590610975610ad2565b61097d610d29565b610985610b17565b3415610a4d576001600160a01b03908116938415610a1657907fde5dfac08f391b7fb8d1ed1fb37b69761e9c0c4d12e3b52f6dc8ceac1e72b8a9929184875260036020528287206109d7348254610d06565b90558487526020528482872091825490811615610a01575b5050508051348152426020820152a380f35b6001600160a01b0319161790553884816109ef565b606490602084519162461bcd60e51b8352820152601160248201527024b73b30b634b2103232b837b9b4ba37b960791b6044820152fd5b815162461bcd60e51b8152602081860152600c60248201526b16995c9bc819195c1bdcda5d60a21b6044820152606490fd5b84913461029d57602036600319011261029d573563ffffffff60e01b811680910361029d5760209250637965db0b60e01b8114908115610ac1575b5015158152f35b6301ffc9a760e01b14905083610aba565b602435906001600160a01b0382168203610ae857565b600080fd5b6060906003190112610ae857600435906024356001600160a01b0381168103610ae8579060443590565b3360009081527fda104853dc3972fb943ce0ee89200279d8af13db255ed28fb43e685524f21b1960205260409020547f0ea61da3a8a09ad801432653699f8c1860b1ae9d2ea4a141fadfd63227717bc89060ff1615610b735750565b6044906040519063e2517d3f60e01b82523360048301526024820152fd5b3360009081527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60205260409020547fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff1615610b735750565b80600052600060205260406000203360005260205260ff6040600020541615610b735750565b9060009180835282602052604083209160018060a01b03169182845260205260ff60408420541615600014610c8c57808352826020526040832082845260205260408320600160ff198254161790557f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d339380a4600190565b505090565b9060009180835282602052604083209160018060a01b03169182845260205260ff604084205416600014610c8c5780835282602052604083208284526020526040832060ff1981541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4600190565b91908201809211610d1357565b634e487b7160e01b600052601160045260246000fd5b60ff60015416610d3557565b60405163d93c066560e01b8152600490fd5b15610d4e57565b60405162461bcd60e51b8152602060048201526011602482015270125b9d985b1a59081c9958da5c1a595b9d607a1b6044820152606490fd5b15610d8e57565b60405162461bcd60e51b815260206004820152600b60248201526a16995c9bc8185b5bdd5b9d60aa1b6044820152606490fd5b15610dc857565b60405162461bcd60e51b8152602060048201526013602482015272496e73756666696369656e7420657363726f7760681b6044820152606490fd5b91908203918211610d1357565b3d15610e6c5767ffffffffffffffff903d828111610e565760405192601f8201601f19908116603f0116840190811184821017610e565760405282523d6000602084013e565b634e487b7160e01b600052604160045260246000fd5b606090565b6002805414610e805760028055565b604051633ee5aeb560e01b8152600490fdfea2646970667358221220f368191fad24bcefe175f78801ce52badce1a170509f91032963d333d2e404e264736f6c634300081400332f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d"
};

// * Contract addresses are now loaded from environment variables
// * See env.example for the required environment variable names

export const NetworkInfo = {
  network: 'localhost',
  chainId: 31337,
  deployer: '0x0000000000000000000000000000000000000000',
  timestamp: '2024-01-01T00:00:00.000Z'
};

// Helper function to get contract instance
export function getContractInterface(contractName: keyof typeof ContractABIs) {
  return ContractABIs[contractName];
}

// * Contract addresses are now loaded from environment variables
// * Use process.env.DID_REGISTRY_ADDRESS, process.env.DATA_LEASE_ADDRESS, etc.
