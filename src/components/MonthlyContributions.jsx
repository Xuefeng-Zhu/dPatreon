import React, { useState } from 'react';
import { Card, List } from 'antd';
import { formatUnits } from 'ethers/lib/utils';
import { useQuery } from '@apollo/client';

import { STREAMS_GQL } from '../utils/graph';

const MonthlyContributions = ({ receiver }) => {
  const { loading, data } = useQuery(STREAMS_GQL, {
    variables: {
      where: {
        receiver: receiver.toLowerCase(),
      },
      first: 101,
      orderBy: 'createdAtBlockNumber',
      orderDirection: 'desc',
    },
    pollInterval: 0,
  });

  return (
    <Card
      title="Monthly Contributions"
      bordered={false}
      style={{ marginTop: 16 }}
    >
      <List
        itemLayout="horizontal"
        dataSource={data?.result?.filter(
          (stream) => stream.currentFlowRate !== '0'
        )}
        loading={loading}
        renderItem={(stream) => (
          <List.Item>
            <List.Item.Meta
              title={stream.sender.id}
              description={`${
                formatUnits(stream.currentFlowRate, 18) * 3600 * 24 * 30
              } ${stream.token.symbol}/month`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MonthlyContributions;
