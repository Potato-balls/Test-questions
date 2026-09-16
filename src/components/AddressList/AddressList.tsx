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

// 估算标签宽度（像素）
const estimateTagWidth = (tag: Tag): number => {
  const text = tag.label;
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // 中文字符约 20px，英文/数字约 12px
    width += charCode > 127 ? 20 : 12;
  }
  return width + 24; // padding: 4px * 2 + border-radius
};

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
  {
    id: '7',
    tags: [
      { label: '常用', type: 'common' },
      { label: '公司', type: 'company' },
    ],
    address: '这是一段很长的地址文字，用于测试当地址文本超出两行时是否能正确显示省略号',
    name: '张先生',
    phone: '112****3838',
    isSelected: false,
  },
  // 第三行标签测试用例：3个标签，地址溢出
  {
    id: '8',
    tags: [
      { label: '常用', type: 'common' },
      { label: '公司', type: 'company' },
      { label: '学校', type: 'school' },
    ],
    address: '这是一段很长的地址文本用于测试当有三个标签时第二行末尾显示第三个标签且不超过50%宽度',
    name: '张先生',
    phone: '112****3838',
    isSelected: false,
  },
  // 第三行标签测试用例：4个标签，地址溢出
  {
    id: '9',
    tags: [
      { label: '常用', type: 'common' },
      { label: '父母家', type: 'parents' },
      { label: '学校', type: 'school' },
      { label: '家', type: 'home' },
    ],
    address: '长地址文本测试第三行标签分配逻辑确保第二个和第三个标签能正确显示在第二行末尾且总宽度不超过50%',
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

// 地址行组件 - 支持标签智能分配
const AddressLine: React.FC<{ address: Address }> = ({ address }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [secondLineText, setSecondLineText] = React.useState<string>('');
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const [secondLineTags, setSecondLineTags] = React.useState<Tag[]>([]);

  React.useEffect(() => {
    const measureOverflow = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const tagsElement = container.querySelector('.tags-container') as HTMLElement;
      const tagsWidth = tagsElement?.offsetWidth || 0;
      const availableWidth = containerWidth - tagsWidth - 16;

      // 估算每行可容纳的字符数（中文字符约 18px）
      const charsPerLine = Math.floor(availableWidth / 18);
      const totalChars = address.address.length;

      if (totalChars > charsPerLine) {
        // 地址溢出，需要显示第二行
        setSecondLineText(address.address.slice(charsPerLine));
        setHasOverflow(true);

        // 标签分配逻辑：如果标签数 > 2，多余的标签放到第二行末尾
        if (address.tags.length > 2) {
          const remainingTags = address.tags.slice(2);
          
          // 计算第二行标签总宽度，确保不超过容器的 50%
          const maxWidth = containerWidth * 0.5;
          let actualTags: Tag[] = [];
          let totalWidth = 0;
          
          for (const tag of remainingTags) {
            const tagWidth = estimateTagWidth(tag);
            if (totalWidth + tagWidth <= maxWidth) {
              actualTags.push(tag);
              totalWidth += tagWidth;
            }
          }
          
          setSecondLineTags(actualTags);
        }
      } else {
        setSecondLineText('');
        setHasOverflow(false);
        setSecondLineTags([]);
      }
    };

    // 使用 ResizeObserver 监听容器大小变化
    const observer = new ResizeObserver(measureOverflow);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 初始测量
    requestAnimationFrame(measureOverflow);

    return () => observer.disconnect();
  }, [address.address, address.tags]);

  return (
    <div className="address-line-wrapper">
      {/* 第一行：标签 + 地址开头 */}
      <div ref={containerRef} className="address-line line-1">
        <div className="tags-container">
          {address.tags.map((tag, idx) => (
            <TagBadge key={idx} tag={tag} />
          ))}
        </div>
        <span className="address-text address-text-first">{address.address}</span>
        {address.special && <span className="special-tag">{address.special}</span>}
      </div>

      {/* 第二行：仅地址剩余部分（无标签） */}
      {hasOverflow && secondLineText && (
        <div className="address-line line-2">
          <span className="address-text address-text-second">{secondLineText}</span>
          {/* 第二行末尾标签（如果有且符合宽度限制） */}
          {secondLineTags.length > 0 && (
            <div className="tags-container tags-container-second">
              {secondLineTags.map((tag, idx) => (
                <TagBadge key={idx} tag={tag} />
              ))}
            </div>
          )}
          {address.special && <span className="special-tag">{address.special}</span>}
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
