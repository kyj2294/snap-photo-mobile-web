
import React from "react";
import { Clock } from "lucide-react";

interface BusinessHoursProps {
  monHours?: string;
  tuesHours?: string;
  wedHours?: string;
  thurHours?: string;
  friHours?: string;
  satHours?: string;
  sunHours?: string;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({
  monHours,
  tuesHours,
  wedHours,
  thurHours,
  friHours,
  satHours,
  sunHours,
}) => {
  const hours = [
    { day: '월', hours: monHours },
    { day: '화', hours: tuesHours },
    { day: '수', hours: wedHours },
    { day: '목', hours: thurHours },
    { day: '금', hours: friHours },
    { day: '토', hours: satHours },
    { day: '일', hours: sunHours }
  ];

  // 영업시간 정보가 있는지 확인
  const hasHoursInfo = hours.some(day => day.hours && day.hours.trim() !== '');

  if (!hasHoursInfo) return null;

  return (
    <div className="mt-2 text-sm">
      <div className="flex items-center gap-1 mb-1 text-blue-600 dark:text-blue-400">
        <Clock className="w-3.5 h-3.5" />
        <span className="font-medium">영업시간:</span>
      </div>
      <div className="grid grid-cols-7 gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-md p-2 text-xs">
        {hours.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.day}</span>
            <span className="text-gray-600 dark:text-gray-400">{item.hours || '-'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;
