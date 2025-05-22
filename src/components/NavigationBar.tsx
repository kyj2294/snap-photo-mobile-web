
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Camera, Image, User, BarChart, Gift } from "lucide-react";

const NavigationBar = () => {
  const location = useLocation();

  // 현재 경로에 따라 활성화된 아이콘 스타일 설정
  const getActiveClass = (path: string) => {
    return location.pathname === path ? "text-green-500" : "text-gray-500 dark:text-gray-400";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex flex-col items-center">
          <Camera className={`h-6 w-6 ${getActiveClass('/')}`} />
          <span className={`text-xs mt-1 ${getActiveClass('/')}`}>카메라</span>
        </Link>
        
        <Link to="/activity" className="flex flex-col items-center">
          <BarChart className={`h-6 w-6 ${getActiveClass('/activity')}`} />
          <span className={`text-xs mt-1 ${getActiveClass('/activity')}`}>활동</span>
        </Link>
        
        <Link to="/mypage" className="flex flex-col items-center">
          <User className={`h-6 w-6 ${getActiveClass('/mypage')}`} />
          <span className={`text-xs mt-1 ${getActiveClass('/mypage')}`}>내 정보</span>
        </Link>
        
        <Link to="/rewards" className="flex flex-col items-center">
          <Gift className={`h-6 w-6 ${getActiveClass('/rewards')}`} />
          <span className={`text-xs mt-1 ${getActiveClass('/rewards')}`}>보상</span>
        </Link>
      </div>
    </nav>
  );
};

export default NavigationBar;
