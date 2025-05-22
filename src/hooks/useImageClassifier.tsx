
import { useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import { useToast } from "@/hooks/use-toast";

export interface Prediction {
  className: string;
  probability: number;
}

export function useImageClassifier() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);
  const [modelLoadAttempted, setModelLoadAttempted] = useState(false);
  const [modelLoadAttempts, setModelLoadAttempts] = useState(0);
  const { toast } = useToast();

  // Load the TeacherMachine model
  useEffect(() => {
    const loadModel = async () => {
      // 이미 모델이 로드되었거나 로드 시도 중이면 다시 시도하지 않음
      if (model || modelLoading || modelLoadAttempts >= 2) {
        return;
      }

      try {
        setModelLoading(true);
        setModelLoadAttempted(true);
        
        console.log("모델 로드 시도 #" + (modelLoadAttempts + 1));
        
        // 모델 URL 설정 (public/model 폴더의 모델 파일 경로)
        const modelURL = "/model/model.json";
        const metadataURL = "/model/metadata.json";

        console.log("모델 로드 경로:", modelURL, metadataURL);
        
        // 메타데이터 먼저 로드하여 검증
        const metadataResponse = await fetch(metadataURL);
        if (!metadataResponse.ok) {
          throw new Error(`메타데이터 파일을 로드할 수 없습니다: ${metadataResponse.status}`);
        }
        const metadata = await metadataResponse.json();
        console.log("메타데이터 로드 완료:", metadata);
        
        // 모델 로드 시도
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        console.log("모델 로드 완료!");
        
        setModel(loadedModel);
        
        toast({
          title: "모델 로드 완료",
          description: "이미지 분류 모델이 성공적으로 로드되었습니다.",
        });
      } catch (error) {
        console.error("Error loading model:", error);
        
        // 모델 로드 실패 시 사용자에게 알림
        if (modelLoadAttempts < 2) { // 최대 2번까지 시도
          setModelLoadAttempts(prev => prev + 1);
          toast({
            title: "모델 로드 재시도 중",
            description: "모델 로드에 실패했습니다. 다시 시도합니다.",
          });
        } else {
          toast({
            title: "모델 로드 오류",
            description: "이미지 분류 모델을 불러오는데 실패했습니다. 페이지를 새로고침 해보세요.",
            variant: "destructive",
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
    if (!model || !canvas) {
      toast({
        title: "분류 오류",
        description: "이미지 또는 모델을 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPredicting(true);
      
      // Classify the image
      const predictions = await model.predict(canvas);
      
      setPrediction(predictions);
      
      toast({
        title: "이미지 분류 완료",
        description: `가장 높은 확률: ${predictions[0].className} (${(predictions[0].probability * 100).toFixed(2)}%)`,
      });
      
      return predictions;
    } catch (error) {
      console.error("Error classifying image:", error);
      toast({
        title: "분류 오류",
        description: "이미지 분류 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return null;
    } finally {
      setPredicting(false);
    }
  };

  return {
    model,
    modelLoading,
    modelLoadAttempted,
    predicting,
    prediction,
    setPrediction,
    classifyImage
  };
}
