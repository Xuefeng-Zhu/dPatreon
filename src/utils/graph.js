import { gql } from '@apollo/client';

export const STREAMS_GQL = gql(`
query getStreams($where: Stream_filter! = {}, $skip: Int! = 0, $first: Int! = 10, $orderBy: Stream_orderBy! = id, $orderDirection: OrderDirection! = asc) {
  result: streams(
    where: $where
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    id
    createdAtTimestamp
    createdAtBlockNumber
    updatedAtTimestamp
    updatedAtBlockNumber
    currentFlowRate
    streamedUntilUpdatedAt
    token {
      id
      createdAtTimestamp
      createdAtBlockNumber
      name
      symbol
      isListed
      underlyingAddress
    }
    sender {
      id
    }
    receiver {
      id
    }
    flowUpdatedEvents(orderBy: timestamp, orderDirection: asc) {
      id
      blockNumber
      timestamp
      transactionHash
      token
      sender
      receiver
      flowRate
      totalSenderFlowRate
      totalReceiverFlowRate
      userData
      oldFlowRate
      type
      totalAmountStreamedUntilTimestamp
    }
  }
}
`);
