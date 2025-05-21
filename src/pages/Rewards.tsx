
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Ticket, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Rewards = () => {
  const navigate = useNavigate();
  
  const rewards = [
    {
      id: 1,
      title: '화성시 지역화폐 100원',
      points: 10,
      description: '지역 상점에서 현금처럼 사용 가능',
      available: true
    },
    {
      id: 2,
      title: '전기차 충전 10% 할인권',
      points: 20,
      description: '화성시 공영 전기차 충전소에서 사용 가능',
      available: false
    },
    {
      id: 3,
      title: '에코 텀블러 교환권',
      points: 50,
      description: '병점동 주민센터에서 교환 가능',
      available: false
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 p-4 flex items-center border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="flex-1 text-center text-xl font-semibold text-gray-800 dark:text-gray-200">환경 보상</h1>
      </header>
      
      {/* 포인트 상태 */}
      <div className="bg-green-50 dark:bg-green-900/20 m-4 p-6 rounded-xl border border-green-100 dark:border-green-800/30 text-center">
        <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">현재 보유 포인트</h2>
        <div className="text-4xl font-bold text-green-600 dark:text-green-400">12</div>
      </div>
      
      {/* 보상 목록 */}
      <div className="mx-4 mt-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">사용 가능한 보상</h2>
        
        <div className="space-y-4">
          {rewards.map(reward => (
            <div 
              key={reward.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-800 dark:text-gray-200 font-semibold">{reward.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{reward.description}</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-sm font-medium py-1 px-3 rounded-full">
                    {reward.points} 포인트
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-700">
                <Button
                  disabled={!reward.available}
                  className={`w-full py-3 rounded-none ${
                    reward.available 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {reward.available ? '교환하기' : '포인트 부족'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 안내 배너 */}
      <div className="mx-4 mt-8 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 flex items-start">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-300">
          포인트는 분리배출 활동을 통해 획득할 수 있습니다. 매 분석마다 자동으로 포인트가 적립됩니다.
        </p>
      </div>
    </div>
  );
};

export default Rewards;
