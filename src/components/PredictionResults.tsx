
import React from "react";
import { Prediction } from "@/types/prediction";
import { openGoogleMaps, makePhoneCall } from "./utils/mapUtils";
import PredictionHeader from "./PredictionHeader";
import RecyclingCentersList from "./RecyclingCentersList";
import PointInfoTable from "./PointInfoTable";
import { usePointInfo } from "@/hooks/usePointInfo";
import { useRecyclingCenters } from "@/hooks/useRecyclingCenters";

interface PredictionResultsProps {
  prediction: Prediction[] | null;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
  prediction
}) => {
  // 포인트 정보 및 재활용 센터 정보를 가져오기 위한 훅 사용
  const { pointInfo, totalPoint, hasPoint } = usePointInfo(prediction);
  const { recyclingCenters, isLoading, selectedObjID } = useRecyclingCenters(prediction);

  if (!prediction) return null;

  // 확률 기준으로 내림차순 정렬
  const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
  
  // 가장 높은 확률의 예측 결과
  const topPrediction = sortedPredictions[0];

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm p-4 flex flex-col justify-end">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <PredictionHeader 
          className={topPrediction.className}
          probability={topPrediction.probability}
          pointInfo={pointInfo}
          totalPoint={totalPoint}
          hasPoint={hasPoint}
        />
        
        <RecyclingCentersList 
          recyclingCenters={recyclingCenters}
          isLoading={isLoading}
          selectedObjID={selectedObjID}
          predictedClassName={topPrediction.className}
          openGoogleMaps={openGoogleMaps}
          makePhoneCall={makePhoneCall}
        />
        
        {/* 포인트 정보 테이블로 표시 (별도 섹션) */}
        {pointInfo && (
          <PointInfoTable 
            objName={pointInfo.objName}
            amount={pointInfo.amount}
            centerPoint={pointInfo.centerPoint}
            totalPoint={totalPoint}
            hasPoint={hasPoint}
          />
        )}
      </div>
    </div>
  );
};

export default PredictionResults;
