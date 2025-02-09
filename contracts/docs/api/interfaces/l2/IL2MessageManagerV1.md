# Solidity API

## IL2MessageManagerV1

### MinimumFeeChanged

```solidity
event MinimumFeeChanged(uint256 previousMinimumFee, uint256 newMinimumFee, address calledBy)
```

Emitted when L2 minimum fee is changed.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| previousMinimumFee | uint256 | The previous minimum fee in Wei. |
| newMinimumFee | uint256 | The new minimum fee in Wei. |
| calledBy | address | The indexed address who changed the minimum fee. |

### L1L2MessageHashesAddedToInbox

```solidity
event L1L2MessageHashesAddedToInbox(bytes32[] messageHashes)
```

Emitted when L1->L2 message hashes have been added to L2 storage.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| messageHashes | bytes32[] | The message hashes that were added to L2 for claiming. |

### MessageHashesListLengthHigherThanOneHundred

```solidity
error MessageHashesListLengthHigherThanOneHundred(uint256 length)
```

_Thrown when the message hashes list length is higher than one hundred._

### MessageDoesNotExistOrHasAlreadyBeenClaimed

```solidity
error MessageDoesNotExistOrHasAlreadyBeenClaimed(bytes32 messageHash)
```

_Thrown when the message does not exist or has already been claimed._

