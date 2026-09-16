import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Question1 from './components/AddressList/AddressList';
import Question2 from './components/Questions/Question2';
import Question3 from './components/Questions/Question3';
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
    element: <Question3 />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
