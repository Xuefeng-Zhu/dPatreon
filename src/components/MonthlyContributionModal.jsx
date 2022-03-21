import React, { useState } from 'react';
import { Modal, Button, Form, InputNumber, Select, Spin, Avatar } from 'antd';
import { useQuery } from 'react-query';
import { formatUnits, parseUnits, Interface } from 'ethers/lib/utils';

import { useWeb3Context } from '../contexts/Web3ContextProvider';
import { addressBalances } from '../utils/covalent';

const MonthlyContributionModal = ({ receiver, visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {
    loadWeb3Modal,
    address,
    signer,
    sf,
    network: { chainId },
  } = useWeb3Context();
  const { isLoading, data } = useQuery(
    ['addressBalances', address, chainId],
    () => addressBalances({ address, chainId })
  );

  const sendToken = async (values) => {
    const { token, amount } = values;
    const [superToken, decimal] = token.split(',');
    const flowRate = parseUnits(amount.toString(), decimal).div(3600 * 24 * 30);
    const flow = await sf.cfaV1.getFlow({
      superToken,
      sender: address,
      receiver,
      providerOrSigner: signer,
    });

    let flowOperation;

    if (flow.flowRate === '0') {
      flowOperation = sf.cfaV1.createFlow({
        flowRate,
        superToken,
        receiver,
      });
    } else {
      flowOperation = sf.cfaV1.updateFlow({
        flowRate,
        superToken,
        receiver,
      });
    }

    setLoading(true);
    const result = await flowOperation.exec(signer);
    console.log(result);
    setLoading(false);
    onClose();
  };

  let content = (
    <Button type="primary" onClick={loadWeb3Modal}>
      Connect Wallet
    </Button>
  );

  if (isLoading) {
    return <Spin />;
  }

  if (address) {
    content = (
      <Form layout="vertical" form={form} onFinish={sendToken}>
        <Form.Item label="Token" name={'token'} rules={[{ required: true }]}>
          <Select
            options={data.items
              .filter((item) => item.contract_name.startsWith('Super'))
              .map((item) => ({
                label: (
                  <>
                    <Avatar src={item.logo_url} />
                    <span>
                      {item.contract_ticker_symbol} (
                      {formatUnits(item.balance, item.contract_decimals)})
                    </span>
                  </>
                ),
                value: `${item.contract_address},${item.contract_decimals}`,
              }))}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount per month"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }

  return (
    <Modal
      title="Monthly Contribution"
      visible={visible}
      footer={null}
      onCancel={onClose}
      zIndex={1}
    >
      {content}
    </Modal>
  );
};

export default MonthlyContributionModal;
