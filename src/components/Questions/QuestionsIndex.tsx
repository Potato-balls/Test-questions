import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Questions.scss';

interface Question {
  id: number;
  title: string;
  desc: string;
  path: string;
  color: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: '试题一',
    desc: '地址列表组件（标签智能布局）',
    path: '/q1',
    color: '#1677ff',
  },
  {
    id: 2,
    title: '试题二',
    desc: '券浮层（抛物线动效）',
    path: '/q2',
    color: '#ff4d4f',
  },
  {
    id: 3,
    title: '试题三',
    desc: '求职信（信纸样式）',
    path: '/q3',
    color: '#fa8c16',
  },
];

const QuestionsIndex: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="questions-page">
      <div className="questions-header">
        <h1 className="questions-title">面试试题</h1>
        <p className="questions-subtitle">请选择要查看的试题</p>
      </div>
      <div className="questions-list">
        {QUESTIONS.map(q => (
          <div
            key={q.id}
            className="question-card"
            style={{ borderColor: q.color }}
            onClick={() => navigate(q.path)}
          >
            <div className="question-card-header">
              <span
                className="question-id"
                style={{ backgroundColor: q.color }}
              >
                {q.id}
              </span>
              <span className="question-title" style={{ color: q.color }}>
                {q.title}
              </span>
            </div>
            <p className="question-desc">{q.desc}</p>
            <div className="question-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsIndex;
