
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Coffee, Recycle, Battery } from 'lucide-react';

const ActivityLog = () => {
  const navigate = useNavigate();
  
  const activities = [
    {
      id: 1,
      item: '커피컵 (복합재질)',
      icon: Coffee,
      date: '2025-05-21',
      points: 5
    },
    {
      id: 2,
      item: '플라스틱 병',
      icon: Recycle,
      date: '2025-05-20',
      points: 5
    },
    {
      id: 3,
      item: '종이 상자',
      icon: Recycle,
      date: '2025-05-19',
      points: 3
    },
    {
      id: 4,
      item: '유리병',
      icon: Recycle,
      date: '2025-05-18',
      points: 4
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 p-4 flex items-center border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="flex-1 text-center text-xl font-semibold text-gray-800 dark:text-gray-200">나의 활동 기록</h1>
      </header>
      
      {/* 통계 요약 */}
      <div className="bg-green-50 dark:bg-green-900/20 m-4 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
        <div className="flex justify-between mb-3">
          <h3 className="text-gray-700 dark:text-gray-300 font-medium">총 획득 포인트</h3>
          <span className="text-green-600 dark:text-green-400 font-bold text-xl">12 포인트</span>
        </div>
        
        <div className="flex justify-between">
          <h3 className="text-gray-700 dark:text-gray-300 font-medium">이번 달 재활용 횟수</h3>
          <span className="text-gray-900 dark:text-gray-100 font-bold text-xl">3회</span>
        </div>
      </div>
      
      {/* 활동 목록 */}
      <div className="mx-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">활동 내역</h2>
        
        <div className="space-y-3">
          {activities.map(activity => (
            <div 
              key={activity.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-3">
                  <activity.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">{activity.item}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{activity.date}</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-sm font-medium py-1 px-3 rounded-full">
                +{activity.points} 포인트
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
