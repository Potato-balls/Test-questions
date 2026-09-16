import React from 'react';
import './Question3.scss';

const LETTER_CONTENT = `您好，

感谢您提供这次沟通机会。针对您提到的几个问题，我结合自己实际的前端开发工作情况做一下说明。

一、日常开发中如何使用 AI 工具进行编码，AI 占比多少

我目前会把 AI 作为日常开发中的辅助工具，而不是完全依赖 AI 进行开发。

在实际工作中，比较常见的使用方式包括：

根据需求快速生成基础代码、组件结构和 TypeScript 类型；
对已有代码进行重构、优化和补充；
排查报错、分析接口问题以及定位一些不容易发现的逻辑问题；
编写正则、工具函数、数据处理逻辑等重复性代码；
根据接口文档生成请求层、数据结构等基础代码；
对不熟悉的技术方案进行快速学习和验证。

如果按照代码产出的过程来估算，目前 AI 辅助参与的比例大概在 40%～60% 左右。但最终的代码结构、业务逻辑、技术方案以及代码 review 仍然由我自己负责，并不会直接复制 AI 生成的代码上线。

二、使用的 AI 工具、工作流以及 Skill / MCP / Plugin

目前我接触和使用比较多的是 Claude Code、ChatGPT、Cursor/Codex 等 AI 编程工具。

比较常用的工作流是：

先把需求、现有代码结构和约束条件告诉 AI；
让 AI 先分析项目结构和实现方案，而不是直接开始修改代码；
确认方案后，再让 AI 分步骤完成开发；
开发过程中让 AI 辅助排查 TypeScript、Vue/React、接口以及构建相关问题；
最后让 AI 对修改内容进行 review，检查是否存在潜在问题。

对于 Skill / MCP，我的理解是它们本质上是在扩展 AI 的能力边界。

例如 Skill 可以把一些固定的开发流程、规范或者专业能力封装起来，让 AI 在特定任务中按照约定的方式执行；MCP 则可以让模型通过统一协议访问外部工具或数据，例如项目文件、数据库、浏览器等。

我在实际使用 AI 编程工具时，也会关注上下文管理、任务拆分、工具调用以及让 AI 先分析后执行这些方式，而不是单纯把它当成一个代码生成器。

三、除了写代码，还会使用 AI 完成哪些工作

除了编码，我在工作中也会使用 AI 做一些辅助性的工作，例如：

分析产品需求，将比较模糊的需求拆分成具体开发任务；
阅读和总结接口文档、技术文档；
帮助分析项目中的历史代码，快速理解陌生模块；
整理技术方案以及开发思路；
分析线上问题和错误日志；
辅助编写测试用例；
优化技术文档、项目说明以及工作汇报；
面试准备、技术知识整理和新技术学习。

另外，我之前也参与过 AI 求职辅助类桌面应用的开发，对大模型 API 调用、Prompt、结构化输出以及 AI 功能和前端业务结合有一定实际接触。

整体来说，我目前对 AI 的定位是"开发效率工具 + 技术辅助工具"。我比较关注的并不是让 AI 完全替代开发，而是如何通过合理拆分任务、提供准确上下文和使用合适的工具，让 AI 真正参与到实际交付流程中。

如果贵公司方便的话，我也比较愿意参加线下机试。通过实际项目开发来展示自己使用 AI 工具解决问题的能力，我认为会比单纯描述使用情况更加直观。

感谢您的沟通，期待后续有进一步交流的机会。`;

const Question3: React.FC = () => {
  const paragraphs = LETTER_CONTENT.split('\n\n').filter(p => p.trim());

  return (
    <div className="q3-page">
      <div className="email-container">
        {/* 邮件头部 */}
        <div className="email-header">
          <div className="email-avatar">📧</div>
          <div className="email-meta">
            <div className="email-subject">回复：面试沟通 - 试题三</div>
            <div className="email-info">
              <span className="email-to">收件人：面试官</span>
              <span className="email-date">2026年9月16日</span>
            </div>
          </div>
        </div>

        {/* 邮件正文 */}
        <div className="email-body">
          {paragraphs.map((paragraph, idx) => {
            // 检测是否为标题段落
            const isTitle = paragraph.match(/^([一二三]、.*|$)/);
            // 检测是否为列表项
            const isListItem = paragraph.startsWith('根据') ||
                              paragraph.startsWith('对已有') ||
                              paragraph.startsWith('排查') ||
                              paragraph.startsWith('编写') ||
                              paragraph.startsWith('根据接口') ||
                              paragraph.startsWith('对不熟悉') ||
                              paragraph.startsWith('先把') ||
                              paragraph.startsWith('让 AI 先') ||
                              paragraph.startsWith('确认方案') ||
                              paragraph.startsWith('开发过程') ||
                              paragraph.startsWith('最后让') ||
                              paragraph.startsWith('例如') ||
                              paragraph.startsWith('例如') ||
                              paragraph.startsWith('分析产品') ||
                              paragraph.startsWith('阅读和') ||
                              paragraph.startsWith('帮助分析') ||
                              paragraph.startsWith('整理技术') ||
                              paragraph.startsWith('分析线上') ||
                              paragraph.startsWith('辅助编写') ||
                              paragraph.startsWith('优化技术');

            if (isTitle) {
              return (
                <h2 key={idx} className="email-title">{paragraph}</h2>
              );
            }

            if (isListItem) {
              return (
                <p key={idx} className="email-list-item">
                  <span className="list-dot">•</span>{paragraph}
                </p>
              );
            }

            return (
              <p key={idx} className="email-paragraph">{paragraph}</p>
            );
          })}
        </div>

        {/* 邮件签名 */}
        <div className="email-footer">
          <div className="signature">
            <div className="signature-name">孙铭宏</div>
            <div className="signature-date">2026年9月16日</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question3;
