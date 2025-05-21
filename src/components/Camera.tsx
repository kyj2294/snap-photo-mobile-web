
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "카메라 접근 오류",
        description: "카메라에 접근할 수 없습니다. 권한을 확인해주세요.",
        variant: "destructive",
      });
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
      
      // Play capture sound or add visual feedback
      toast({
        title: "사진 촬영 완료",
        description: "사진이 촬영되었습니다.",
      });
      
      // Stop the camera after taking the photo
      stopCamera();
    }
  };

  const handleUpload = () => {
    toast({
      title: "업로드 중",
      description: "사진을 업로드하는 중입니다...",
    });
    
    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "업로드 완료",
        description: "사진이 성공적으로 업로드되었습니다.",
      });
      
      // Reset the state to allow taking a new photo
      setCapturedImage(null);
    }, 1500);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Clean up the camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden mb-4">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CameraIcon className="w-16 h-16 text-gray-400" />
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
      </div>
      
      <div className="flex w-full gap-4 justify-center">
        {!cameraActive && !capturedImage && (
          <Button 
            onClick={startCamera}
            className="h-16 w-full text-lg bg-blue-500 hover:bg-blue-600"
          >
            사진 찍기
          </Button>
        )}
        
        {cameraActive && (
          <Button 
            onClick={takePhoto}
            className="h-16 w-full text-lg bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center"
          >
            <div className="w-12 h-12 bg-white rounded-full border-4 border-blue-500"></div>
          </Button>
        )}
        
        {capturedImage && (
          <>
            <Button 
              onClick={retakePhoto}
              className="h-16 flex-1 text-lg bg-blue-500 hover:bg-blue-600"
            >
              사진 찍기
            </Button>
            <Button 
              onClick={handleUpload}
              className="h-16 flex-1 text-lg bg-blue-500 hover:bg-blue-600"
            >
              업로드
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Camera;
