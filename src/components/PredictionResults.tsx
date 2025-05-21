
import React, { useState, useEffect } from "react";
import { Prediction } from "@/hooks/useImageClassifier";
import { Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PredictionItem from "./PredictionItem";
import RecyclingCenterInfo, { RecyclingCenter } from "./RecyclingCenterInfo";
import RecyclingGuide from "./RecyclingGuide";

interface PredictionResultsProps {
  prediction: Prediction[] | null;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
  prediction
}) => {
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedObjID, setSelectedObjID] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (prediction && prediction.length > 0) {
      const fetchRecyclingCenters = async () => {
        setIsLoading(true);
        try {
          // 최상위 예측 결과 가져오기
          const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
          const topPrediction = sortedPredictions[0];

          // 예측 결과를 objID로 간주하여 쿼리
          // 실제 구현에서는 예측 결과를 기반으로 objID를 결정하는 로직이 필요합니다
          const predictedObjID = topPrediction.className;
          setSelectedObjID(predictedObjID);

          // objID가 예측 결과와 일치하는 재활용 센터를 찾습니다
          const { data, error } = await supabase
            .from('renewalcenter')
            .select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln')
            .eq('objID', predictedObjID);
            
          if (error) {
            console.error('재활용 센터 정보 조회 오류:', error);
            toast({
              title: "데이터 조회 오류",
              description: "재활용 센터 정보를 불러올 수 없습니다.",
              variant: "destructive"
            });
          } else if (data && data.length > 0) {
            setRecyclingCenters(data);
          } else {
            // objID로 정확히 찾을 수 없는 경우 이전 방식으로 검색
            let query = supabase
              .from('renewalcenter')
              .select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln');
              
            if (topPrediction.className === "볼펜") {
              query = query.or(`clctItemCn.ilike.%볼펜%,clctItemCn.ilike.%필기구%`);
            } else if (topPrediction.className === "커피컵") {
              query = query.or(`clctItemCn.ilike.%커피컵%,clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%`);
            } else if (topPrediction.className === "종이컵") {
              query = query.or(`clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%,clctItemCn.ilike.%종이%`);
            }
            
            const limit = topPrediction.className === "볼펜" ? 5 : 3;
            query = query.limit(limit);
            
            const { data: fallbackData, error: fallbackError } = await query;
            
            if (fallbackError) {
              console.error('대체 검색 오류:', fallbackError);
              toast({
                title: "데이터 조회 오류",
                description: "재활용 센터 정보를 불러올 수 없습니다.",
                variant: "destructive"
              });
            } else if (fallbackData) {
              setRecyclingCenters(fallbackData);
            }
            
            if (!fallbackData || fallbackData.length === 0) {
              toast({
                title: "검색 결과 없음",
                description: `'${topPrediction.className}'에 대한 재활용 센터를 찾을 수 없습니다.`,
                variant: "default"
              });
            }
          }
        } catch (error) {
          console.error('재활용 센터 데이터 요청 실패:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchRecyclingCenters();
    }
  }, [prediction, toast]);

  if (!prediction) return null;

  // 확률 기준으로 내림차순 정렬
  const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);

  // 가장 높은 확률의 예측 결과
  const topPrediction = sortedPredictions[0];
  
  // 현재 예측 결과가 "볼펜"인지 확인
  const isItemPen = topPrediction.className === "볼펜";

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm p-4 flex flex-col justify-end">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <h2 className="text-xl font-bold text-center mb-2">분석 결과</h2>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{topPrediction.className}</div>
            <div className="text-xl font-semibold">{Math.round(topPrediction.probability * 100)}%</div>
          </div>
        </div>
        
        {/* 재활용 가이드 정보 */}
        <RecyclingGuide className={topPrediction.className} />
        
        {/* 재활용 센터 정보 */}
        <RecyclingCenterInfo
          centers={recyclingCenters}
          isLoading={isLoading}
          selectedObjID={selectedObjID}
          isItemPen={isItemPen}
        />
        
        {/* 다른 예측 결과들 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">다른 가능성</h3>
          <ul className="space-y-2">
            {sortedPredictions.slice(1, 3).map((pred, index) => (
              <PredictionItem key={index} prediction={pred} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PredictionResults;
