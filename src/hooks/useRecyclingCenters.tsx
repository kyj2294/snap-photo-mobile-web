
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Prediction, RecyclingCenter } from "@/types/prediction";
import { useToast } from "@/hooks/use-toast";

export function useRecyclingCenters(prediction: Prediction[] | null) {
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
          const predictedObjID = topPrediction.className;
          setSelectedObjID(predictedObjID);

          // objID가 예측 결과와 일치하는 재활용 센터를 찾습니다
          const { data, error } = await supabase
            .from('renewalcenter')
            .select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln, monSalsHrExplnCn, tuesSalsHrExplnCn, wedSalsHrExplnCn, thurSalsHrExplnCn, friSalsHrExplnCn, satSalsHrExplnCn, sunSalsHrExplnCn, point')
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
              .select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln, monSalsHrExplnCn, tuesSalsHrExplnCn, wedSalsHrExplnCn, thurSalsHrExplnCn, friSalsHrExplnCn, satSalsHrExplnCn, sunSalsHrExplnCn, point');
            
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

  return { recyclingCenters, isLoading, selectedObjID };
}
