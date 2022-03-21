import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Skeleton, Card, Col, Row, Typography } from 'antd';
import { GithubFilled, GlobalOutlined } from '@ant-design/icons';

import ContributionCard from './ContributionCard';
import MonthlyContributions from './MonthlyContributions';
import { getNFTDetails } from '../utils/nftport';

const { Text, Title } = Typography;

const ProjectDetails = () => {
  const { id } = useParams();
  const { isLoading, data } = useQuery(['ProjectDetails', id], () =>
    getNFTDetails(id)
  );

  if (isLoading) {
    return <Skeleton />;
  }

  const { nft } = data;
  const actions = [];

  if (nft.metadata.github) {
    actions.push(
      <a href={nft.metadata.github} target="_blank">
        <GithubFilled />
      </a>
    );
  }

  if (nft.metadata.website) {
    actions.push(
      <a href={nft.metadata.website} target="_blank">
        <GlobalOutlined />
      </a>
    );
  }

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            bordered={false}
            actions={actions}
            cover={<img src={nft.file_url} height="200px" />}
          >
            <Card.Meta
              title={<Title level={2}>{nft.metadata.name}</Title>}
              description={
                <>
                  <Text ellipsis={{ tooltip: nft.metadata.owner }}>
                    <b>Owner: </b>
                    {nft.metadata.owner}
                  </Text>
                </>
              }
            />
          </Card>
        </Col>
        <Col span={16}>
          <ContributionCard receiver={nft.metadata.owner} />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="About" bordered={false} style={{ marginTop: 16 }}>
            {nft.metadata.description}
          </Card>
          <MonthlyContributions receiver={nft.metadata.owner} />
        </Col>
      </Row>
    </>
  );
};

export default ProjectDetails;
