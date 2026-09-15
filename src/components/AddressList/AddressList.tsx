import React, { useState } from 'react';
import './AddressList.scss';

// 类型定义
interface Tag {
  label: string;
  type: 'common' | 'company' | 'recent' | 'school' | 'parents' | 'home' | 'distance';
}

interface Address {
  id: string;
  tags: Tag[];
  address: string;
  name: string;
  phone: string;
  isSelected?: boolean;
  special?: string; // 特殊信息如倒计时
}

// 示例数据 - 模拟图片中的地址列表
const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    tags: [
      { label: '常用', type: 'common' },
      { label: '公司', type: 'company' },
    ],
    address: '地址未超过一行展示',
    name: '张先生',
    phone: '112****3838',
    isSelected: false,
  },
  {
    id: '2',
    tags: [
      { label: '上次下单', type: 'recent' },
      { label: '学校', type: 'school' },
    ],
    address: '地址未超过一行展示',
    name: '张先生',
    phone: '11212343838',
    isSelected: false,
  },
  {
    id: '3',
    tags: [
      { label: '距离最近', type: 'distance' },
      { label: '父母家', type: 'parents' },
    ],
    address: '城开YOYO联合办公 6楼',
    name: '张先生',
    phone: '112****3838',
    special: '04:59 后餐厅停止接单',
    isSelected: false,
  },
  {
    id: '4',
    tags: [
      { label: '距离最近', type: 'distance' },
      { label: '家', type: 'home' },
    ],
    address: '一行固定宽度展示超出后折行',
    name: '张先生',
    phone: '112****3838',
    isSelected: false,
  },
  {
    id: '5',
    tags: [
      { label: '常用', type: 'common' },
      { label: '公司', type: 'company' },
    ],
    address: '城开YOYO联合办公 6楼',
    name: '张先生',
    phone: '112****3838',
    isSelected: true,
  },
  {
    id: '6',
    tags: [],
    address: '一行固定宽度展示超出后折行文文案文案文超过固定长度折行折行折行折行折行折...',
    name: '张先生',
    phone: '112****3838',
    isSelected: false,
  },
];

// 单个标签组件
const TagBadge: React.FC<{ tag: Tag }> = ({ tag }) => {
  return (
    <span className={`tag-badge tag-${tag.type}`}>
      <span className="tag-text">{tag.label}</span>
    </span>
  );
};

// 地址行组件 - 处理标签和地址的布局（第三行重点实现）
const AddressLine: React.FC<{ address: Address }> = ({ address }) => {
  // 智能分配标签到第一行和第二行
  const [firstLineTags, setFirstLineTags] = useState<Tag[]>([]);
  const [secondLineTags, setSecondLineTags] = useState<Tag[]>([]);

  React.useEffect(() => {
    if (address.tags.length === 0) {
      setFirstLineTags([]);
      setSecondLineTags([]);
      return;
    }

    // 如果标签数量 <= 2，全部放在第一行
    if (address.tags.length <= 2) {
      setFirstLineTags(address.tags);
      setSecondLineTags([]);
      return;
    }

    // 超过 2 个标签时，第一个放第一行，其余放第二行
    // 如果第二行标签总宽度超过 50%，则调整
    const firstTag = address.tags[0];
    const restTags = address.tags.slice(1);

    // 估算宽度：中文标签约 40px，英文标签约 50px
    const estimateWidth = (tag: Tag): number => {
      const charCount = tag.label.length;
      if (/[一-龥]/.test(tag.label)) {
        return charCount * 20; // 中文字符
      }
      return charCount * 12; // 英文字符
    };

    // 检查第二行总宽度是否超过 50% (假设总宽度 375px, 50% = 187.5px)
    const secondLineWidth = restTags.reduce((sum, t) => sum + estimateWidth(t), 0);
    const MAX_SECOND_LINE_WIDTH = 187;

    if (secondLineWidth > MAX_SECOND_LINE_WIDTH) {
      // 尝试分配：第一个标签第一行，第二、三个标签第二行，其余第三行
      setFirstLineTags([firstTag]);
      setSecondLineTags(restTags.slice(0, 2));
    } else {
      setFirstLineTags([firstTag]);
      setSecondLineTags(restTags);
    }
  }, [address.tags]);

  return (
    <div className="address-line-wrapper">
      {/* 第一行：标签 + 地址开头 */}
      <div className="address-line line-1">
        <div className="tags-container">
          {firstLineTags.map((tag, idx) => (
            <TagBadge key={idx} tag={tag} />
          ))}
        </div>
        <span className="address-text">{address.address}</span>
        {address.special && <span className="special-tag">{address.special}</span>}
      </div>

      {/* 第二行：剩余标签 */}
      {secondLineTags.length > 0 && (
        <div className="address-line line-2">
          <div className="tags-container tags-end">
            {secondLineTags.map((tag, idx) => (
              <TagBadge key={idx} tag={tag} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 地址列表项
const AddressItem: React.FC<{
  address: Address;
  onSelect: (id: string) => void;
}> = ({ address, onSelect }) => {
  return (
    <div
      className={`address-item ${address.isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(address.id)}
    >
      {/* 选择器 */}
      <div className="item-checkbox">
        <input
          type="radio"
          checked={address.isSelected}
          readOnly
          className="radio-input"
        />
      </div>

      {/* 地址信息 */}
      <div className="address-content">
        <AddressLine address={address} />
        <div className="contact-info">
          <span className="contact-name">{address.name}</span>
          <span className="contact-phone">{address.phone}</span>
        </div>
      </div>

      {/* 编辑按钮 */}
      <div className="edit-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </div>
    </div>
  );
};

// 地址列表组件
const AddressList: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);

  const handleSelect = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isSelected: addr.id === id,
      }))
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">收货地址</h1>
      </div>
      <div className="address-list">
        {addresses.map((addr) => (
          <AddressItem key={addr.id} address={addr} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
};

export default AddressList;
