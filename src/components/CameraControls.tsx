
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, Upload, RefreshCw, Loader2, Search } from "lucide-react";
import { Prediction } from "@/hooks/useImageClassifier";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CameraControlsProps {
  cameraActive: boolean;
  capturedImage: string | null;
  modelLoading: boolean;
  predicting: boolean;
  prediction: Prediction[] | null;
  onStartCamera: () => void;
  onTakePhoto: () => void;
  onRetakePhoto: () => void;
  onClassifyImage: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  cameraActive,
  capturedImage,
  modelLoading,
  predicting,
  prediction,
  onStartCamera,
  onTakePhoto,
  onRetakePhoto,
  onClassifyImage
}) => {
  const { toast } = useToast();
  const [isCheckingPoints, setIsCheckingPoints] = React.useState(false);
  const [pointAmount, setPointAmount] = React.useState<number | null>(null);
  const [centerPoint, setCenterPoint] = React.useState<number | null>(null);

  // 확률 기준으로 내림차순 정렬
  const sortedPredictions = prediction ? [...prediction].sort((a, b) => b.probability - a.probability) : null;

  // 가장 높은 확률의 예측 결과
  const hasTopPrediction = sortedPredictions && sortedPredictions.length > 0;
  const topPrediction = hasTopPrediction ? sortedPredictions[0] : null;

  const checkPoints = async () => {
    if (!topPrediction) return;
    
    setIsCheckingPoints(true);
    try {
      // 오류 처리 개선 - 데이터베이스 연결에 실패해도 앱은 계속 작동
      try {
        // bigObject 테이블에서 포인트 정보 조회
        const { data: objData, error: objError } = await supabase
          .from('bigObject')
          .select('objName, amount')
          .eq('objName', topPrediction.className)
          .single();
        
        if (objData) {
          setPointAmount(objData.amount);
        }
        
        // renewalCenter 테이블에서 포인트 정보 조회
        const { data: centerData, error: centerError } = await supabase
          .from('renewalcenter')
          .select('objID, point')
          .eq('objID', topPrediction.className)
          .single();
        
        if (centerData) {
          setCenterPoint(centerData.point);
        }
      
        toast({
          title: "포인트 조회 결과",
          description: `${topPrediction.className}: ${(objData?.amount || 0) + (centerData?.point || 0)} 포인트`,
          variant: "default"
        });
      } catch (dbError) {
        console.error('포인트 조회 오류 (DB):', dbError);
        toast({
          title: "포인트 조회 결과",
          description: "수수료 없음 (데이터베이스 연결 실패)",
        });
      }
    } catch (error) {
      console.error('포인트 조회 오류:', error);
      toast({
        title: "오류 발생",
        description: "포인트 정보를 조회하는 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingPoints(false);
    }
  };

  if (!cameraActive && !capturedImage) {
    return <Button onClick={onStartCamera} disabled={modelLoading} className="h-16 w-full text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none shadow-md">
        {modelLoading ? <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            모델 로드중...
          </> : <>
            <CameraIcon className="mr-2 h-6 w-6" />
            사진 찍기
          </>}
      </Button>;
  }
  if (cameraActive) {
    return <Button onClick={onTakePhoto} className="h-20 w-20 rounded-full flex items-center justify-center bg-white dark:bg-white border-4 border-green-500 dark:border-green-400 shadow-lg hover:scale-105 transition-transform duration-200" variant="outline">
        <div className="w-14 h-14 bg-green-500 rounded-full"></div>
      </Button>;
  }
  if (capturedImage) {
    // 분석 결과가 있는 경우
    if (prediction && prediction.length > 0) {
      return <div className="grid grid-cols-2 gap-4 w-full">
          <Button onClick={onRetakePhoto} variant="outline" className="h-12 flex-1 text-md">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 찍기
          </Button>
          
          <Button 
            className="h-12 flex-1 bg-green-600 hover:bg-green-700"
            onClick={checkPoints}
            disabled={isCheckingPoints}
          >
            {isCheckingPoints ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                포인트 조회
              </>
            )}
          </Button>
        </div>;
    }

    // 분석 전 상태
    return <div className="grid grid-cols-2 gap-4 w-full">
        <Button onClick={onRetakePhoto} variant="outline" className="h-16 flex-1 text-lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          다시 찍기
        </Button>
        <Button onClick={onClassifyImage} disabled={predicting} className="h-16 flex-1 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
          {predicting ? <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              분석중...
            </> : topPrediction ? <div className="flex flex-col items-center justify-center w-full">
              <span className="text-sm font-bold">{topPrediction.className}</span>
              <span className="text-xs">{Math.round(topPrediction.probability * 100)}%</span>
            </div> : <>
              <Upload className="mr-2 h-5 w-5" />
              분석하기
            </>}
        </Button>
      </div>;
  }
  return null;
};
export default CameraControls;
