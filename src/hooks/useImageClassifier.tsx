
import { useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import { useToast } from "@/hooks/use-toast";

export interface Prediction {
  className: string;
  probability: number;
}

// 모델 URL을 상대 경로로 수정 (기본 경로로부터의 상대 경로)
const MODEL_URL = "./model/model.json";
const METADATA_URL = "./model/metadata.json";

export function useImageClassifier() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);
  const [modelLoadAttempted, setModelLoadAttempted] = useState(false);
  const [modelLoadAttempts, setModelLoadAttempts] = useState(0);
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  // 모델 로드하기
  useEffect(() => {
    const loadModel = async () => {
      // 이미 모델이 로드되었거나 로드 시도 중이면 다시 시도하지 않음
      if (model || modelLoading || modelLoadAttempts >= 3) {
        return;
      }

      try {
        setModelLoading(true);
        setModelLoadAttempted(true);
        setModelLoadError(null);
        
        // 모델 파일의 존재 확인
        const modelResponse = await fetch(MODEL_URL);
        if (!modelResponse.ok) {
          throw new Error(`모델 파일을 찾을 수 없습니다: ${modelResponse.status}`);
        }
        
        // 모델 로드 시도
        const loadedModel = await tmImage.load(MODEL_URL, METADATA_URL);
        setModel(loadedModel);
        
        toast({
          title: "모델 로드 완료",
          description: "이미지 분류 모델이 성공적으로 로드되었습니다."
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setModelLoadError(errorMessage);
        
        // 모델 로드 실패 시 사용자에게 알림
        if (modelLoadAttempts < 2) { // 최대 2번까지 시도
          setModelLoadAttempts(prev => prev + 1);
          
          // 재시도 전에 약간의 지연 시간 설정
          setTimeout(loadModel, 2000);
        } else {
          toast({
            title: "모델 로드 오류",
            description: "이미지 분류 모델을 불러오는데 실패했습니다. 앱을 재시작해보세요.",
            variant: "destructive"
          });
        }
      } finally {
        setModelLoading(false);
      }
    };
    
    // 페이지 로드 후 약간의 지연 시간을 두고 모델 로드 시작
    const timer = setTimeout(() => {
      loadModel();
    }, 1000);
    
    // Clean up function
    return () => {
      clearTimeout(timer);
    };
  }, [model, modelLoading, modelLoadAttempts, toast]);

  const classifyImage = async (canvas: HTMLCanvasElement) => {
    if (!model) {
      toast({
        title: "모델이 로드되지 않음",
        description: "이미지 분류 모델이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요."
      });
      return null;
    }
    
    if (!canvas) {
      toast({
        title: "분류 오류",
        description: "이미지를 찾을 수 없습니다.",
        variant: "destructive"
      });
      return null;
    }

    try {
      setPredicting(true);
      
      // Classify the image
      const predictions = await model.predict(canvas);
      
      setPrediction(predictions);
      
      toast({
        title: "이미지 분류 완료",
        description: `가장 높은 확률: ${predictions[0].className} (${(predictions[0].probability * 100).toFixed(2)}%)`
      });
      
      return predictions;
    } catch (error) {
      toast({
        title: "분류 오류",
        description: "이미지 분류 중 오류가 발생했습니다.",
        variant: "destructive"
      });
      return null;
    } finally {
      setPredicting(false);
    }
  };

  // 모델 다시 로드 함수
  const reloadModel = () => {
    if (!modelLoading) {
      setModel(null);
      setModelLoadAttempted(false);
      setModelLoadAttempts(0);
      setModelLoadError(null);
    }
  };

  return {
    model,
    modelLoading,
    modelLoadAttempted,
    modelLoadError,
    predicting,
    prediction,
    setPrediction,
    classifyImage,
    reloadModel
  };
}
