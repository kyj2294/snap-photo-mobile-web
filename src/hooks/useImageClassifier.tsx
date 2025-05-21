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
  const { toast } = useToast();

  // Load the TeacherMachine model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        
        // 로컬 모델 파일 경로 사용 (public/model 폴더에 모델 파일을 넣은 경우)
        const modelJson = "/model/model.json";
        const metadataURL = "/model/metadata.json";
        
        // 모델 로드
        const loadedModel = await tmImage.load(modelJson, metadataURL);
        setModel(loadedModel);
        
        toast({
          title: "모델 로드 완료",
          description: "이미지 분류 모델이 성공적으로 로드되었습니다.",
        });
      } catch (error) {
        console.error("Error loading model:", error);
        toast({
          title: "모델 로드 오류",
          description: "이미지 분류 모델을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setModelLoading(false);
      }
    };
    
    loadModel();
    
    // Clean up function
    return () => {
      if (model) {
        // Clean up model if needed
      }
    };
  }, []);

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
    predicting,
    prediction,
    setPrediction,
    classifyImage
  };
}
