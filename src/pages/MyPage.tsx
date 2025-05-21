
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, Award, Leaf, BarChart3, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 p-4 flex items-center border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="flex-1 text-center text-xl font-semibold text-gray-800 dark:text-gray-200">마이페이지</h1>
      </header>
      
      {/* 프로필 섹션 */}
      <div className="bg-white dark:bg-gray-800 p-6 flex flex-col items-center mt-4 mx-4 rounded-xl shadow-sm">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
            <span className="text-4xl font-semibold">김</span>
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">김지현</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">화성시 병점동</p>
      </div>
      
      {/* 환경 기여 통계 */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 mx-4 mt-4 rounded-xl border border-green-100 dark:border-green-800/30">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">환경 기여 통계</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">이번 달 분리배출 횟수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">3회</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">절약한 CO2</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1.2kg</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">환경 기여 등급</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">에코 히어로 Lv.1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 메뉴 옵션 */}
      <div className="bg-white dark:bg-gray-800 mt-4 mx-4 rounded-xl overflow-hidden shadow-sm">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
          onClick={() => navigate('/settings')}
        >
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-3" />
            <span>설정</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        <hr className="dark:border-gray-700" />
        
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
        >
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-3" />
            <span>알림 설정</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        <hr className="dark:border-gray-700" />
        
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
        >
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-3" />
            <span>앱 정보</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* 버전 정보 */}
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>RecycLens v1.0.0</p>
      </div>
    </div>
  );
};

export default MyPage;
