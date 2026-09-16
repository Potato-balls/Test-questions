import React, { useState, useCallback, useRef, useEffect } from 'react';
import './CouponFloat.scss';

// ==================== 类型定义 ====================
interface Coupon {
  id: string;
  type: 'red' | 'blue' | 'orange';
  amount: number;
  condition: string;
  expired: string;
  isNew?: boolean;
}

interface FlyingItem {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  coupon: Coupon;
}

// ==================== 模拟数据 ====================
const INITIAL_COUPONS: Coupon[] = [
  { id: '1', type: 'red', amount: 50, condition: '满100可用', expired: '2026-12-31' },
  { id: '2', type: 'blue', amount: 30, condition: '满50可用', expired: '2026-11-30' },
  { id: '3', type: 'orange', amount: 100, condition: '满200可用', expired: '2026-10-15' },
];

const COUPON_TYPES: Array<Coupon['type']> = ['red', 'blue', 'orange'];

// ==================== 贝塞尔曲线 ====================
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ==================== 生成新券 ====================
function generateNewCoupons(count: number): Coupon[] {
  return Array.from({ length: count }, () => ({
    id: `new-${Date.now()}-${Math.random()}`,
    type: COUPON_TYPES[Math.floor(Math.random() * COUPON_TYPES.length)],
    amount: [5, 10, 20, 30, 50][Math.floor(Math.random() * 5)],
    condition: '满任意金额可用',
    expired: '2026-12-31',
    isNew: true,
  }));
}

// ==================== 单张飞券组件 ====================
const FlyingCoupon: React.FC<{
  item: FlyingItem;
  onComplete: (id: string) => void;
}> = ({ item, onComplete }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const duration = 700;

  // 控制点 - 提高抛物线高度，让弧线更明显
  const midY = (item.fromY + item.toY) / 2;
  const cp1x = item.fromX + (item.toX - item.fromX) * 0.3;
  const cp1y = midY - 150; // 控制点1更高，形成明显抛物线
  const cp2x = item.fromX + (item.toX - item.fromX) * 0.7;
  const cp2y = midY - 120; // 控制点2稍低，平滑过渡到终点

  useEffect(() => {
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const raw = Math.min(elapsed / duration, 1);
      const t = ease(raw);

      // 计算当前位置（贝塞尔曲线插值）
      const x = cubicBezier(t, item.fromX, cp1x, cp2x, item.toX);
      const y = cubicBezier(t, item.fromY, cp1y, cp2y, item.toY);

      // 相对位移（从起点到当前位置的偏移）
      const dx = x - item.fromX;
      const dy = y - item.fromY;

      const scale = 1 - t * 0.3;
      const opacity = raw < 0.9 ? 1 : 1 - (raw - 0.9) * 10;

      if (elRef.current) {
        elRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        elRef.current.style.opacity = String(opacity);
      }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onComplete(item.id);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [item.fromX, item.fromY, cp1x, cp1y, cp2x, cp2y, item.toX, item.toY, item.id, onComplete]);

  const typeColors: Record<Coupon['type'], string> = {
    red: '#ff4d4f',
    blue: '#1677ff',
    orange: '#fa8c16',
  };

  return (
    <div
      ref={elRef}
      className="flying-coupon"
      style={{
        left: item.fromX,
        top: item.fromY,
        backgroundColor: typeColors[item.coupon.type],
      }}
    >
      <span className="flying-amount">¥{item.coupon.amount}</span>
    </div>
  );
};

// ==================== 单张券展示 ====================
const CouponCard: React.FC<{ coupon: Coupon }> = ({ coupon }) => {
  const typeStyles: Record<Coupon['type'], { border: string; bg: string; label: string }> = {
    red: { border: '#ff4d4f', bg: '#fff1f0', label: '红包' },
    blue: { border: '#1677ff', bg: '#e6f4ff', label: '优惠券' },
    orange: { border: '#fa8c16', bg: '#fff7e6', label: '折扣券' },
  };
  const s = typeStyles[coupon.type];

  return (
    <div className={`coupon-card${coupon.isNew ? ' coupon-new' : ''}`}>
      <div className="coupon-left" style={{ borderColor: s.border, backgroundColor: s.bg }}>
        <div className="coupon-amount-wrap">
          <span className="coupon-symbol">¥</span>
          <span className="coupon-amount">{coupon.amount}</span>
        </div>
        <span className="coupon-label" style={{ color: s.border }}>{s.label}</span>
      </div>
      <div className="coupon-right">
        <div className="coupon-condition">{coupon.condition}</div>
        <div className="coupon-expired">有效期至 {coupon.expired}</div>
      </div>
    </div>
  );
};

// ==================== 主组件 ====================
const CouponFloat: React.FC<{ autoOpen?: boolean }> = ({ autoOpen = false }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [visible, setVisible] = useState(autoOpen);
  const [bannerIndex, setBannerIndex] = useState<number>(-1);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const claimBtnRef = useRef<HTMLButtonElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // 动画状态机
  const animStateRef = useRef<'idle' | 'measuring' | 'flying'>('idle');
  const pendingDataRef = useRef<{ coupons: Coupon[]; from: { x: number; y: number } }>({
    coupons: [],
    from: { x: 0, y: 0 },
  });

  // 随机选择横幅插入位置
  useEffect(() => {
    const idx = Math.floor(Math.random() * (coupons.length + 1));
    setBannerIndex(idx);
  }, []);

  useEffect(() => {
    if (autoOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(true), 150);
      return () => clearTimeout(timer);
    }
  }, []);

  // 获取飞行动画的起点坐标
  const getFlyFrom = useCallback((): { x: number; y: number } => {
    // 优先读横幅
    const bannerEl = document.querySelector<HTMLElement>('.in-page-coupon-banner');
    if (bannerEl) {
      const r = bannerEl.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    // 否则读按钮
    const btn = claimBtnRef.current;
    if (btn) {
      const r = btn.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return { x: 0, y: 0 };
  }, []);

  // 点击领券
  const handleClaim = useCallback(() => {
    // 同步测量起点坐标
    const flyFrom = getFlyFrom();

    const count = Math.floor(Math.random() * 4) + 1;
    const newCoupons = generateNewCoupons(count);

    // 存储待飞行数据
    pendingDataRef.current = {
      coupons: newCoupons,
      from: flyFrom,
    };

    // 隐藏横幅，添加新券到列表
    setBannerIndex(-1);
    setCoupons(prev => [...newCoupons, ...prev]);

    // 显示 Toast 提示
    setTimeout(() => {
      setToast({ show: true, message: `成功领取了 ${count} 张优惠券` });
      setTimeout(() => setToast({ show: false, message: '' }), 2000);
    }, 750);
  }, [getFlyFrom]);

  // 当 coupons 变化时，等待 DOM 更新后测量卡片位置
  useEffect(() => {
    if (pendingDataRef.current.coupons.length === 0) return;
    if (animStateRef.current !== 'idle') return;

    animStateRef.current = 'measuring';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const { coupons: newCoupons, from: start } = pendingDataRef.current;

        const couponsEl = document.querySelector<HTMLElement>('.coupon-list');
        if (!couponsEl) {
          animStateRef.current = 'idle';
          return;
        }

        const allItems = couponsEl.querySelectorAll<HTMLElement>('.coupon-list-item');
        const newCount = newCoupons.length;

        const items: FlyingItem[] = [];
        // 飞行图标尺寸（与 CSS 中的 width/height 一致）
        const FLYING_ICON_W = 72;
        const FLYING_ICON_H = 48;

        for (let i = 0; i < newCount; i++) {
          // 获取新增的卡片（列表开头的前 newCount 个卡片）
          const cardEl = allItems[i];
          if (!cardEl) continue;

          const rect = cardEl.getBoundingClientRect();
          // 目标位置：卡片中心（减去图标尺寸的一半，使图标中心对齐卡片中心）
          const toX = rect.left + rect.width / 2 - FLYING_ICON_W / 2;
          const toY = rect.top + rect.height / 2 - FLYING_ICON_H / 2;

          console.log('[COUPONS] 卡片', i, 'rect:', { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
          console.log('[COUPONS] 目标落点（图标左上角）:', { toX, toY, centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2 });

          items.push({
            id: `fly-${Date.now()}-${i}`,
            fromX: start.x - FLYING_ICON_W / 2, // 起点的左上角（按钮中心向左偏移半个图标宽）
            fromY: start.y - FLYING_ICON_H / 2, // 起点的左上角（按钮中心向上偏移半个图标高）
            toX,
            toY,
            coupon: newCoupons[i],
          });
        }

        if (items.length > 0) {
          animStateRef.current = 'flying';
          console.log("[FLY] 设置飞行物品:", items.length, "张");
          setFlyingItems(items);

          // 动画结束后清理
          setTimeout(() => {
            setFlyingItems([]);
            pendingDataRef.current = { coupons: [], from: { x: 0, y: 0 } };
            animStateRef.current = 'idle';
            // 高亮闪烁停止后清除 isNew
            setTimeout(() => {
              setCoupons(prev => prev.map(c => ({ ...c, isNew: false })));
            }, 1800);
          }, 750);
        } else {
          animStateRef.current = 'idle';
        }
      });
    });
  }, [coupons]);

  const handleFlyComplete = useCallback((id: string) => {
    setFlyingItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div className={`coupon-float-overlay${visible ? ' visible' : ''}`} onClick={() => setVisible(false)}>
      <div className="coupon-float-modal" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="coupon-header">
          <h2 className="coupon-title">我的优惠券</h2>
          <span className="coupon-count">{coupons.length} 张</span>
        </div>

        {/* 券列表 */}
        <div className="coupon-list-wrap">
          <div className="coupon-list">
            {bannerIndex < 0
              ? coupons.map((coupon, idx) => (
                  <div key={coupon.id} className="coupon-list-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <CouponCard coupon={coupon} />
                  </div>
                ))
              : [
                  ...coupons.slice(0, bannerIndex).map((coupon, idx) => (
                    <div key={coupon.id} className="coupon-list-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <CouponCard coupon={coupon} />
                    </div>
                  )),
                  <div
                    key="banner"
                    ref={bannerRef}
                    className="in-page-coupon-banner"
                    onClick={handleClaim}
                  >
                    <div className="in-page-coupon-banner-content">
                      <span className="in-page-coupon-banner-icon">🎁</span>
                      <span className="in-page-coupon-banner-text">新人专享红包 ¥50，限时领取</span>
                      <button className="in-page-coupon-banner-btn">立即领取</button>
                    </div>
                  </div>,
                  ...coupons.slice(bannerIndex).map((coupon, idx) => (
                    <div
                      key={coupon.id}
                      className="coupon-list-item"
                      style={{ animationDelay: `${(bannerIndex + idx) * 0.05}s` }}
                    >
                      <CouponCard coupon={coupon} />
                    </div>
                  )),
                ]
            }
          </div>
        </div>

        {/* 领券按钮 - 移除点击事件 */}
        <div className="claim-area">
          <button className="claim-btn" ref={claimBtnRef}>
            <span className="claim-btn-icon">🧧</span>
            <span className="claim-btn-text">立即领券</span>
          </button>
        </div>
      </div>

      {/* 飞行动画层 - 放在 modal 外部，避免 overflow: hidden 裁剪 */}
      {flyingItems.map(item => (
        <FlyingCoupon
          key={item.id}
          item={item}
          onComplete={handleFlyComplete}
        />
      ))}

      {/* Toast 提示 */}
      {toast.show && (
        <div className="coupon-toast">
          <span className="coupon-toast-icon">✓</span>
          <span className="coupon-toast-text">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default CouponFloat;
