
import React, { useState, useEffect } from "react";
import { Prediction } from "@/hooks/useImageClassifier";
import { MapPin, Building, Phone, Clock, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PredictionResultsProps {
  prediction: Prediction[] | null;
}

// 재활용 센터 정보를 위한 타입 정의
interface RecyclingCenter {
  objID: string;
  positnNm: string;
  positnRdnmAddr?: string;
  bscTelnoCn?: string;
  clctItemCn?: string;
  prkMthdExpln?: string; // 주차 방법 정보
  monSalsHrExplnCn?: string; // 월요일 영업시간
  tuesSalsHrExplnCn?: string; // 화요일 영업시간
  wedSalsHrExplnCn?: string; // 수요일 영업시간
  thurSalsHrExplnCn?: string; // 목요일 영업시간
  friSalsHrExplnCn?: string; // 금요일 영업시간
  satSalsHrExplnCn?: string; // 토요일 영업시간
  sunSalsHrExplnCn?: string; // 일요일 영업시간
  point?: number | null; // 재활용 센터의 포인트 정보
}

// 포인트 정보를 위한 타입 정의
interface PointInfo {
  objName: string;
  amount: number | null;
  centerPoint?: number | null; // renewalCenter의 point 정보
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
  prediction
}) => {
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedObjID, setSelectedObjID] = useState<string | null>(null);
  const [pointInfo, setPointInfo] = useState<PointInfo | null>(null);
  const {
    toast
  } = useToast();

  // 예측 결과에 따른 포인트 정보 조회
  useEffect(() => {
    if (prediction && prediction.length > 0) {
      const fetchPointInfo = async () => {
        try {
          // 최상위 예측 결과 가져오기
          const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
          const topPrediction = sortedPredictions[0];

          // 예측된 objName으로 포인트 정보 조회 (bigObject 테이블)
          const { data: objData, error: objError } = await supabase
            .from('bigObject')
            .select('objName, amount')
            .eq('objName', topPrediction.className);

          // renewalCenter 테이블에서 포인트 정보 조회
          const { data: centerData, error: centerError } = await supabase
            .from('renewalcenter')
            .select('objID, point')
            .eq('objID', topPrediction.className);

          if (objError && centerError) {
            console.error('포인트 정보 조회 오류:', objError, centerError);
          } else {
            // 포인트 정보 설정
            const pointData = {
              objName: topPrediction.className,
              amount: objData && objData.length > 0 ? objData[0].amount : null,
              centerPoint: centerData && centerData.length > 0 ? centerData[0].point : null
            };
            
            setPointInfo(pointData);
          }
        } catch (error) {
          console.error('포인트 정보 조회 오류:', error);
        }
      };

      fetchPointInfo();
    }
  }, [prediction]);

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
          const {
            data,
            error
          } = await supabase.from('renewalcenter').select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln, monSalsHrExplnCn, tuesSalsHrExplnCn, wedSalsHrExplnCn, thurSalsHrExplnCn, friSalsHrExplnCn, satSalsHrExplnCn, sunSalsHrExplnCn, point').eq('objID', predictedObjID);
          
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
            let query = supabase.from('renewalcenter').select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln, monSalsHrExplnCn, tuesSalsHrExplnCn, wedSalsHrExplnCn, thurSalsHrExplnCn, friSalsHrExplnCn, satSalsHrExplnCn, sunSalsHrExplnCn, point');
            if (topPrediction.className === "볼펜") {
              query = query.or(`clctItemCn.ilike.%볼펜%,clctItemCn.ilike.%필기구%`);
            } else if (topPrediction.className === "커피컵") {
              query = query.or(`clctItemCn.ilike.%커피컵%,clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%`);
            } else if (topPrediction.className === "종이컵") {
              query = query.or(`clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%,clctItemCn.ilike.%종이%`);
            }
            const limit = topPrediction.className === "볼펜" ? 5 : 3;
            query = query.limit(limit);
            const {
              data: fallbackData,
              error: fallbackError
            } = await query;
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

  // 구글 맵에서 위치 보기 기능
  const openGoogleMaps = (address: string) => {
    if (!address) return;

    // 주소를 URL 인코딩하여 구글 맵 URL 생성
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    // 새 탭에서 구글 맵 열기
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  // 전화 걸기 기능 추가
  const makePhoneCall = (phoneNumber: string) => {
    if (!phoneNumber) return;

    // 전화번호에서 괄호와 하이픈 등 특수문자 제거
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');

    // tel: 프로토콜을 사용하여 전화 걸기
    window.location.href = `tel:${cleanPhoneNumber}`;
  };

  // 영업시간 요약 함수 생성
  const renderBusinessHours = (center: RecyclingCenter) => {
    const hours = [
      { day: '월', hours: center.monSalsHrExplnCn },
      { day: '화', hours: center.tuesSalsHrExplnCn },
      { day: '수', hours: center.wedSalsHrExplnCn },
      { day: '목', hours: center.thurSalsHrExplnCn },
      { day: '금', hours: center.friSalsHrExplnCn },
      { day: '토', hours: center.satSalsHrExplnCn },
      { day: '일', hours: center.sunSalsHrExplnCn }
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

  if (!prediction) return null;

  // 확률 기준으로 내림차순 정렬
  const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);

  // 가장 높은 확률의 예측 결과
  const topPrediction = sortedPredictions[0];

  // 포인트 정보 계산
  const totalPoint = pointInfo ? (pointInfo.amount !== null ? pointInfo.amount : 0) + 
                               (pointInfo.centerPoint !== null ? pointInfo.centerPoint : 0) : 0;
  const hasPoint = totalPoint > 0 || (pointInfo && (pointInfo.amount !== null || pointInfo.centerPoint !== null));

  return <div className="absolute inset-0 bg-black/50 backdrop-blur-sm p-4 flex flex-col justify-end">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <h2 className="text-xl font-bold text-center mb-2">분석 결과</h2>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{topPrediction.className}</div>
            <div className="text-xl font-semibold">{Math.round(topPrediction.probability * 100)}%</div>
          </div>
          
          {/* 포인트 정보 표시 추가 */}
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
        
        {/* 재활용 센터 정보 추가 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Building className="text-blue-600 dark:text-blue-400 w-5 h-5" />
            <h3 className="font-semibold">
              {topPrediction.className === "볼펜" ? "볼펜 수거 가능 재활용 센터" : "인근 재활용 센터"}
            </h3>
          </div>
          
          {isLoading ? <p className="text-gray-600 dark:text-gray-400 text-center py-2">재활용 센터 정보를 불러오는 중...</p> : recyclingCenters.length > 0 ? <ul className="space-y-3">
              {recyclingCenters.map(center => <li key={center.objID} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                  <div className="font-semibold text-lg text-green-700 dark:text-green-500 cursor-pointer hover:text-green-600 hover:underline" onClick={() => center.positnRdnmAddr && openGoogleMaps(center.positnNm + ' ' + center.positnRdnmAddr)}>
                    {center.positnNm || "이름 없는 센터"} 
                    {center.objID === selectedObjID && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">정확히 일치</span>}
                    {topPrediction.className === "볼펜" && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">볼펜 전문 수거</span>}
                  </div>
                  
                  {/* 센터 포인트 정보 표시 */}
                  {center.point !== null && center.point > 0 && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 mt-0.5 flex items-center">
                      <Coins className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span>포인트: {center.point}</span>
                    </div>
                  )}
                  
                  {/* 나머지 센터 정보 표시 */}
                  {center.positnRdnmAddr && <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 cursor-pointer hover:text-blue-500" onClick={() => openGoogleMaps(center.positnRdnmAddr || '')} />
                      <span className="cursor-pointer hover:text-blue-500 hover:underline" onClick={() => openGoogleMaps(center.positnRdnmAddr || '')}>
                        {center.positnRdnmAddr}
                      </span>
                    </div>}
                  
                  {center.bscTelnoCn && <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-blue-600" />
                      <span className="cursor-pointer hover:text-blue-600 hover:underline" onClick={() => makePhoneCall(center.bscTelnoCn || '')}>
                        {center.bscTelnoCn}
                      </span>
                    </div>}
                  
                  {center.prkMthdExpln && <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      🚗 <span className="font-medium">주차:</span> {center.prkMthdExpln}
                    </div>}
                  
                  {/* 영업시간 정보 추가 */}
                  {renderBusinessHours(center)}
                </li>)}
            </ul> : <p className="text-gray-600 dark:text-gray-400 text-center py-2">
              '{topPrediction.className}'에 대한 재활용 센터 정보가 없습니다.
            </p>}
        </div>
        
        {/* 포인트 정보 테이블로 표시 (별도 섹션) */}
        {pointInfo && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>항목</TableHead>
                  <TableHead className="text-right">수거 수수료 (포인트)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{pointInfo.objName}</TableCell>
                  <TableCell className="text-right">
                    {hasPoint ? (
                      <div>
                        {pointInfo.amount !== null && (
                          <div>기본 수수료: {pointInfo.amount}</div>
                        )}
                        {pointInfo.centerPoint !== null && pointInfo.centerPoint > 0 && (
                          <div>센터 추가 수수료: {pointInfo.centerPoint}</div>
                        )}
                        <div className="font-bold mt-1 pt-1 border-t">합계: {totalPoint}</div>
                      </div>
                    ) : "수수료 없음"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>;
};

export default PredictionResults;
