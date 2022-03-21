import React, { useState } from 'react';
import { Modal, Button, Form, InputNumber, Select, Spin, Avatar } from 'antd';
import { useQuery } from 'react-query';
import { formatUnits, parseUnits, Interface } from 'ethers/lib/utils';

import { useWeb3Context } from '../contexts/Web3ContextProvider';
import { addressBalances } from '../utils/covalent';

const OneTimeContributionModal = ({ receiver, visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {
    loadWeb3Modal,
    address,
    signer,
    network: { chainId },
  } = useWeb3Context();
  const { isLoading, data } = useQuery(
    ['addressBalances', address, chainId],
    () => addressBalances({ address, chainId })
  );

  const sendToken = async (values) => {
    const { token, amount } = values;
    const [contractAddress, decimal] = token.split(',');
    let tx;

    if (contractAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      tx = {
        to: receiver,
        value: parseUnits(amount.toString(), decimal),
      };
    } else {
      tx = {
        to: contractAddress,
        value: 0,
        data: new Interface([
          'function transfer(address _to, uint256 _value)',
        ]).encodeFunctionData('transfer', [
          receiver,
          parseUnits(amount.toString(), decimal),
        ]),
      };
    }

    setLoading(true);
    await signer.sendTransaction(tx);
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
            options={data.items.map((item) => ({
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
        <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
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
      title="One-time Contribution"
      visible={visible}
      footer={null}
      onCancel={onClose}
      zIndex={1}
    >
      {content}
    </Modal>
  );
};

export default OneTimeContributionModal;
