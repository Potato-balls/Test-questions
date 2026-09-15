import Taro from '@tarojs/taro';
import React, { useState } from 'react';
import { View, Text, Checkbox } from '@tarojs/components';
import './index.scss';

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

// 标签颜色映射
const TAG_COLORS: Record<Tag['type'], { bg: string; text: string }> = {
  common: { bg: '#FFE4E1', text: '#E91E63' },
  company: { bg: '#E3F2FD', text: '#1976D2' },
  recent: { bg: '#FFF3E0', text: '#F57C00' },
  school: { bg: '#F3E5F5', text: '#7B1FA2' },
  parents: { bg: '#E8F5E9', text: '#388E3C' },
  home: { bg: '#FFF8E1', text: '#F9A825' },
  distance: { bg: '#E0F7FA', text: '#00838F' },
};

// 示例数据
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
  const colors = TAG_COLORS[tag.type];
  return (
    <View className={`tag-badge tag-${tag.type}`} style={{ backgroundColor: colors.bg, color: colors.text }}>
      <Text className="tag-text">{tag.label}</Text>
    </View>
  );
};

// 地址行组件 - 处理标签和地址的布局
const AddressLine: React.FC<{ address: Address }> = ({ address }) => {
  const [firstLineTags, setFirstLineTags] = useState<Tag[]>([]);
  const [secondLineTags, setSecondLineTags] = useState<Tag[]>([]);

  // 智能分配标签到第一行和第二行
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
    <View className="address-line-wrapper">
      {/* 第一行：标签 + 地址开头 */}
      <View className="address-line line-1">
        <View className="tags-container">
          {firstLineTags.map((tag, idx) => (
            <TagBadge key={idx} tag={tag} />
          ))}
        </View>
        <Text className="address-text">{address.address}</Text>
        {address.special && <View className="special-tag">{address.special}</View>}
      </View>

      {/* 第二行：剩余标签 */}
      {secondLineTags.length > 0 && (
        <View className="address-line line-2">
          <View className="tags-container tags-end">
            {secondLineTags.map((tag, idx) => (
              <TagBadge key={idx} tag={tag} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// 地址列表项
const AddressItem: React.FC<{ address: Address; onSelect: (id: string) => void }> = ({
  address,
  onSelect,
}) => {
  return (
    <View className={`address-item ${address.isSelected ? 'selected' : ''}`} onClick={() => onSelect(address.id)}>
      {/* 选择器 */}
      <Checkbox checked={address.isSelected} color="#FF4D4F" className="item-checkbox" />

      {/* 地址信息 */}
      <View className="address-content">
        <AddressLine address={address} />
        <View className="contact-info">
          <Text className="contact-name">{address.name}</Text>
          <Text className="contact-phone">{address.phone}</Text>
        </View>
      </View>

      {/* 编辑按钮 */}
      <View className="edit-btn">
        <Text className="edit-icon">✎</Text>
      </View>
    </View>
  );
};

// 主页面
const Index: React.FC = () => {
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
    <View className="page-container">
      <View className="page-header">
        <Text className="page-title">收货地址</Text>
      </View>
      <View className="address-list">
        {addresses.map((addr) => (
          <AddressItem key={addr.id} address={addr} onSelect={handleSelect} />
        ))}
      </View>
    </View>
  );
};

export default Index;
