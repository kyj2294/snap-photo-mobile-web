
import { useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import { useToast } from "@/hooks/use-toast";

export interface Prediction {
  className: string;
  probability: number;
}

// 모델 URL을 절대 경로로 명확하게 설정
const MODEL_URL = "/model/model.json";
const METADATA_URL = "/model/metadata.json";

export function useImageClassifier() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);
  const [modelLoadAttempted, setModelLoadAttempted] = useState(false);
  const [modelLoadAttempts, setModelLoadAttempts] = useState(0);
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
        
        // 모델 로드 시도
        const loadedModel = await tmImage.load(MODEL_URL, METADATA_URL);
        console.log("모델 로드 완료!");
        
        setModel(loadedModel);
        
        toast({
          title: "모델 로드 완료",
          description: "이미지 분류 모델이 성공적으로 로드되었습니다.",
          variant: "default"
        });
      } catch (error) {
        console.error("Error loading model:", error);
        
        // 모델 로드 실패 시 사용자에게 알림
        if (modelLoadAttempts < 2) { // 최대 2번까지 시도 (배포 환경에서 시도 횟수 줄임)
          setModelLoadAttempts(prev => prev + 1);
          toast({
            title: "모델 로드 재시도 중",
            description: "모델 로드에 실패했습니다. 다시 시도합니다.",
            variant: "default"
          });
          
          // 재시도 전 약간의 지연 시간 설정
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
        description: "이미지 분류 모델이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.",
        variant: "default"
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
        description: `가장 높은 확률: ${predictions[0].className} (${(predictions[0].probability * 100).toFixed(2)}%)`,
        variant: "default"
      });
      
      return predictions;
    } catch (error) {
      console.error("Error classifying image:", error);
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

  // 모델 다시 로드 함수 추가 - 사용자가 수동으로 재시도할 수 있도록
  const reloadModel = () => {
    if (!modelLoading) {
      setModel(null);
      setModelLoadAttempted(false);
      setModelLoadAttempts(0);
      // 모델 로드는 useEffect에서 자동으로 시작됨
    }
  };

  return {
    model,
    modelLoading,
    modelLoadAttempted,
    predicting,
    prediction,
    setPrediction,
    classifyImage,
    reloadModel
  };
}
