import { PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import './index.scss';

interface AppProps {
  children: PropsWithChildren<any>;
}

const App: React.FC<AppProps> = ({ children }) => {
  return <>{children}</>;
};

export default App;
