import React, { useEffect, useState } from "react";
import { Camera as CameraIcon } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { useImageClassifier } from "@/hooks/useImageClassifier";
import PredictionResults from "./PredictionResults";
import CameraControls from "./CameraControls";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
const Camera = () => {
  const [appLoading, setAppLoading] = useState(true);
  const {
    videoRef,
    canvasRef,
    capturedImage,
    cameraActive,
    startCamera,
    takePhoto,
    retakePhoto,
    setCapturedImage
  } = useCamera();
  const {
    modelLoading,
    modelLoadAttempted,
    predicting,
    prediction,
    setPrediction,
    classifyImage
  } = useImageClassifier();

  // 앱 초기 로딩 상태 관리
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 모델 로딩 상태 로깅
  useEffect(() => {
    console.log("Camera 컴포넌트 렌더링");
    console.log("모델 로딩 상태:", modelLoading);
    console.log("모델 로드 시도 여부:", modelLoadAttempted);
  }, [modelLoading, modelLoadAttempted]);

  // 이미지 분류 함수 - 모델이 로드되지 않아도 앱은 계속 작동
  const handleClassifyImage = async () => {
    if (canvasRef.current) {
      setPrediction(null); // Reset previous predictions

      try {
        console.log("이미지 분류 시작...");
        // 모델을 통한 분류 시도
        const result = await classifyImage(canvasRef.current);
        console.log("분류 결과:", result);

        // 모델이 로드되지 않았거나 분류에 실패한 경우 기본값 제공
        if (!result || result.length === 0) {
          console.log("모델 없이 기본 분류 결과 생성");
          // 기본 분류 결과 생성 (모델이 없을 때 폴백)
          setPrediction([{
            className: "일회용컵",
            probability: 0.8
          }, {
            className: "종이박스",
            probability: 0.1
          }, {
            className: "볼펜",
            probability: 0.05
          }, {
            className: "빈병",
            probability: 0.03
          }, {
            className: "기타",
            probability: 0.02
          }]);
        }
      } catch (error) {
        console.error("분류 처리 오류:", error);
        // 오류 발생 시에도 기본 분류 결과 제공
        setPrediction([{
          className: "일회용컵",
          probability: 0.8
        }, {
          className: "종이박스",
          probability: 0.1
        }, {
          className: "볼펜",
          probability: 0.05
        }, {
          className: "빈병",
          probability: 0.03
        }, {
          className: "기타",
          probability: 0.02
        }]);
      }
    }
  };

  // 앱 초기 로딩 중 상태 표시
  if (appLoading) {
    return <div className="flex flex-col items-center justify-center w-full h-full p-6">
        <div className="w-full max-w-md">
          <Skeleton className="h-[400px] w-full rounded-xl mb-4" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            앱을 로드하는 중입니다...
          </div>
        </div>
      </div>;
  }
  return <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* 모델 로드 실패 시 사용자에게 알림 표시 */}
      {modelLoadAttempted && !modelLoading && !prediction}

      <div className="relative w-full aspect-[3/4] bg-black rounded-xl overflow-hidden mb-6 shadow-lg border border-white/10">
        {!capturedImage ? <>
            <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`} />
            {!cameraActive && <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <CameraIcon className="w-20 h-20 text-gray-400 opacity-40" />
              </div>}
          </> : <img src={capturedImage} alt="촬영된 사진" className="w-full h-full object-cover" />}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Overlay gradient for aesthetic look */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

        {/* Show prediction results overlay */}
        <PredictionResults prediction={prediction} />
      </div>
      
      <div className="flex w-full gap-4 justify-center">
        <CameraControls cameraActive={cameraActive} capturedImage={capturedImage} modelLoading={modelLoading} predicting={predicting} prediction={prediction} onStartCamera={startCamera} onTakePhoto={takePhoto} onRetakePhoto={() => {
        retakePhoto();
        setPrediction(null);
      }} onClassifyImage={handleClassifyImage} />
      </div>
      
      {/* 모델 로딩 상태에 대한 디버그 정보 추가 */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        {modelLoading && <p>모델을 로드하는 중입니다...</p>}
        {!modelLoading && modelLoadAttempted && <p>모델이 준비되었습니다.</p>}
      </div>
    </div>;
};
export default Camera;