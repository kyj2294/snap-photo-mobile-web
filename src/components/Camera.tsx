
import React, { useEffect } from "react";
import { Camera as CameraIcon } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { useImageClassifier } from "@/hooks/useImageClassifier";
import PredictionResults from "./PredictionResults";
import CameraControls from "./CameraControls";

const Camera = () => {
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
    predicting,
    prediction,
    setPrediction,
    classifyImage
  } = useImageClassifier();

  const handleClassifyImage = async () => {
    if (canvasRef.current) {
      setPrediction(null); // Reset previous predictions
      await classifyImage(canvasRef.current);
    }
  };

  // 카메라 컴포넌트가 마운트될 때 모델 로딩 상태를 콘솔에 기록
  useEffect(() => {
    console.log("Camera component mounted, modelLoading:", modelLoading);
  }, [modelLoading]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="relative w-full aspect-[3/4] bg-black rounded-xl overflow-hidden mb-6 shadow-lg border border-white/10">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <CameraIcon className="w-20 h-20 text-gray-400 opacity-40" />
              </div>
            )}
          </>
        ) : (
          <img
            src={capturedImage}
            alt="촬영된 사진"
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Overlay gradient for aesthetic look */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

        {/* Show prediction results overlay */}
        {prediction && <PredictionResults prediction={prediction} />}
      </div>
      
      <div className="flex w-full gap-4 justify-center">
        <CameraControls 
          cameraActive={cameraActive}
          capturedImage={capturedImage}
          modelLoading={modelLoading}
          predicting={predicting}
          prediction={prediction}
          onStartCamera={startCamera}
          onTakePhoto={takePhoto}
          onRetakePhoto={() => {
            retakePhoto();
            setPrediction(null);
          }}
          onClassifyImage={handleClassifyImage}
        />
      </div>
    </div>
  );
};

export default Camera;
