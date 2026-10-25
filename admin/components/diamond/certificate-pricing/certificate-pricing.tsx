'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Empty,
  Button,
  Input,
  Tag,
  message,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  SearchOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { Roboto } from '@/src/common/fonts';
import Loader from '@/components/common/loader';
import {
  diamondAPI,
  Certificate,
} from '@/src/services/diamond/diamond.api';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700'],
  subsets: ['latin'],
});

interface CertificateRow {
  key: string;
  weightRange: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const CertificatePricing = () => {
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await diamondAPI.getCertificates();
      const list = response || [];

      const mapped: CertificateRow[] = list.map((item: Certificate) => ({
        key: item.id,
        weightRange: `${item.weightStartsAt} - ${item.weightEndsAt} ct`,
        price: item.price,
        status: item.status,
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        updatedAt: new Date(item.updatedAt).toLocaleDateString(),
      }));

      setCertificates(mapped);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const columns: ColumnsType<CertificateRow> = [
    {
      title: <div className={`text-center ${roboto.className}`}>Weight Range</div>,
      dataIndex: 'weightRange',
      key: 'weightRange',
      align: 'center',
      render: (text) => (
        <span className={`font-medium text-brand-900 ${roboto.className}`}>
          {text}
        </span>
      ),
    },
    {
      title: <div className={`text-center ${roboto.className}`}>Price</div>,
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: number) => (
        <span className={`text-brand-900 font-semibold ${roboto.className}`}>
          ₹{price.toLocaleString()}
        </span>
      ),
    },
    // {
    //   title: <div className={`text-center ${roboto.className}`}>Status</div>,
    //   dataIndex: 'status',
    //   key: 'status',
    //   align: 'center',
    //   render: (status: string) => (
    //     <Tag color={status === 'ENABLED' ? '#526f4d' : 'red'}>{status}</Tag>
    //   ),
    // },
    // {
    //   title: <div className={`text-center ${roboto.className}`}>Created Date</div>,
    //   dataIndex: 'createdAt',
    //   key: 'createdAt',
    //   align: 'center',
    //   render: (date: string) => (
    //     <span className={`text-brand-700 ${roboto.className}`}>{date}</span>
    //   ),
    // },
    // {
    //   title: <div className={`text-center ${roboto.className}`}>Updated Date</div>,
    //   dataIndex: 'updatedAt',
    //   key: 'updatedAt',
    //   align: 'center',
    //   render: (date: string) => (
    //     <span className={`text-brand-700 ${roboto.className}`}>{date}</span>
    //   ),
    // },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">
          Certificate Pricing
        </h1>
          {/* Search Field */}
        {/* <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-[280px]">
            <Input
              placeholder="Search by weight, price, or status"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full h-10 ${roboto.className}`}
              size="middle"
              allowClear
              suffix={<SearchOutlined />}
            />
            {searchTerm && (
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearSearch}
                size="middle"
                type="text"
                className="text-brand-600 hover:text-brand-800 h-10"
              />
            )}
          </div>
        </div> */}
      </div>

      {/* Table Content */}
      <div className="px-2 scrollbar border-1 border-brand-100 m-5 rounded-2xl h-[calc(100%-110px)] overflow-y-auto scrollbar">
        <Table
          columns={columns}
          dataSource={certificates}
          loading={{
            spinning: loading,
            indicator: (
              <Loader
                message="Loading certificates..."
                size={40}
                color="border-brand-600"
              />
            ),
          }}
          pagination={false}
          locale={
            loading
              ? { emptyText: null }
              : {
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <div>
                          <h3 className="text-lg font-medium text-brand-800 mb-2">
                            Certificate Pricing
                          </h3>
                          <p className="text-brand-600">
                            No certificate pricing data available.
                          </p>
                        </div>
                      }
                    />
                  ),
                }
          }
        />
      </div>
    </div>
  );
};

export default CertificatePricing;



