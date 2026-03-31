import React, { ReactNode, useEffect, useState } from 'react';
import { loadRuntimeConfig } from '../config/runtimeConfig';

interface ConfigGateProps {
  children: ReactNode;
}

const ConfigGate: React.FC<ConfigGateProps> = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadRuntimeConfig().finally(() => {
      if (active) {
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        正在加载配置...
      </div>
    );
  }

  return <>{children}</>;
};

export default ConfigGate;

