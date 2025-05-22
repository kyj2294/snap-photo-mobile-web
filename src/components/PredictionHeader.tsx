
import React from "react";
import { Coins } from "lucide-react";

// PointInfo 타입을 일관되게 정의 (centerPoint를 선택적으로 변경)
interface PointInfo {
  objName: string;
  amount: number | null;
  centerPoint?: number | null;  // ? 추가하여 선택적으로 변경
}

interface PredictionHeaderProps {
  className: string;
  probability: number;
  pointInfo: PointInfo | null;
  totalPoint: number;
  hasPoint: boolean;
}

const PredictionHeader: React.FC<PredictionHeaderProps> = ({
  className,
  probability,
  pointInfo,
  totalPoint,
  hasPoint
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white rounded-t-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-2">분석 결과</h2>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{className}</div>
        <div className="text-xl font-semibold">{Math.round(probability * 100)}%</div>
      </div>
      
      {/* 포인트 정보 표시 - 모바일 최적화 */}
      {pointInfo && (
        <div className="mt-2 p-2 bg-white/20 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Coins className="w-5 h-5 mr-2" />
            <span className="font-medium">수거 수수료:</span>
          </div>
          <div className="font-bold">
            {hasPoint ? `${totalPoint} 포인트` : "수수료 없음"}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionHeader;
