
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, Upload, RefreshCw, Loader2 } from "lucide-react";
import { Prediction } from "@/hooks/useImageClassifier";

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
  if (!cameraActive && !capturedImage) {
    return (
      <Button 
        onClick={onStartCamera}
        disabled={modelLoading}
        className="h-16 w-full text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none shadow-md shadow-purple-900/20 dark:shadow-purple-500/10"
      >
        {modelLoading ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            모델 로드중...
          </>
        ) : (
          <>
            <CameraIcon className="mr-2 h-6 w-6" />
            사진 찍기
          </>
        )}
      </Button>
    );
  }
  
  if (cameraActive) {
    return (
      <Button 
        onClick={onTakePhoto}
        className="h-20 w-20 rounded-full flex items-center justify-center bg-white dark:bg-white border-4 border-blue-500 dark:border-blue-400 shadow-lg hover:scale-105 transition-transform duration-200"
        variant="outline"
      >
        <div className="w-14 h-14 bg-red-500 rounded-full"></div>
      </Button>
    );
  }
  
  if (capturedImage) {
    // Sort predictions by probability in descending order
    const sortedPredictions = prediction ? [...prediction].sort((a, b) => b.probability - a.probability) : null;
    
    // Show top prediction if available
    const hasTopPrediction = sortedPredictions && sortedPredictions.length > 0;
    const topPrediction = hasTopPrediction ? sortedPredictions[0] : null;
    
    return (
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button 
          onClick={onRetakePhoto}
          variant="outline"
          className="h-16 flex-1 text-lg bg-black/10 backdrop-blur-md border border-white/20 text-white dark:text-gray-200 hover:bg-black/20 shadow-md"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          다시 찍기
        </Button>
        <Button 
          onClick={onClassifyImage}
          disabled={predicting}
          className="h-16 flex-1 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-md shadow-blue-900/20 dark:shadow-blue-500/10"
        >
          {predicting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              분석중...
            </>
          ) : topPrediction ? (
            <div className="flex flex-col items-center justify-center w-full">
              <span className="text-sm font-bold">{topPrediction.className}</span>
              <span className="text-xs">{Math.round(topPrediction.probability * 100)}%</span>
            </div>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              분류하기
            </>
          )}
        </Button>
      </div>
    );
  }
  
  return null;
};

export default CameraControls;
