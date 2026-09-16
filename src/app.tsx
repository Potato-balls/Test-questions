import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Question1 from './components/AddressList/AddressList';
import Question2 from './components/Questions/Question2';
import QuestionsIndex from './components/Questions/QuestionsIndex';

const router = createBrowserRouter([
  {
    path: '/',
    element: <QuestionsIndex />,
  },
  {
    path: '/q1',
    element: <Question1 />,
  },
  {
    path: '/q2',
    element: <Question2 />,
  },
  {
    path: '/q3',
    element: <div style={{ padding: '40px', textAlign: 'center', fontSize: '28px', color: '#999' }}>试题三开发中...</div>,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
