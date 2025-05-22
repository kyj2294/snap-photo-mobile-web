
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AddressData {
  city: string;
  city_district?: string;
  [key: string]: any; // 기타 가능한 필드들을 위한 인덱스 시그니처
}

interface LocationState {
  loading: boolean;
  location: {
    latitude: number | null;
    longitude: number | null;
    address: AddressData;
  };
  error: string | null;
}

export function useLocation() {
  const [locationState, setLocationState] = useState<LocationState>({
    loading: true,
    location: {
      latitude: null,
      longitude: null,
      address: {
        city: "",
        city_district: ""
      }
    },
    error: null
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const getAddress = async (lat: number, lng: number) => {
      try {
        // 카카오 API 사용이 이상적이지만, 여기서는 간단한 역지오코딩 서비스 사용
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ko`
        );
        
        if (!response.ok) throw new Error("주소 변환 실패");
        
        const data = await response.json();
        
        // 행정동까지만 표시 (한국어 주소 체계)
        let addressData: AddressData = {
          city: "알 수 없는 위치",
          city_district: ""
        };
        
        console.log("위치 데이터:", data);
        
        if (data.address) {
          // 한국 지역 주소 체계에 맞게 처리
          const city = data.address.city || data.address.town || data.address.county || "";
          const district = data.address.suburb || data.address.neighbourhood || data.address.quarter || "";
          
          addressData = {
            city: city || "알 수 없는 위치",
            city_district: district || ""
          };
        }
        
        setLocationState({
          loading: false,
          location: {
            latitude: lat,
            longitude: lng,
            address: addressData
          },
          error: null
        });
      } catch (error) {
        console.error("역지오코딩 에러:", error);
        setLocationState(prev => ({
          ...prev,
          loading: false,
          location: {
            ...prev.location,
            address: {
              city: "위치 확인 불가",
              city_district: ""
            }
          }
        }));
      }
    };

    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setLocationState({
          loading: false,
          location: { latitude: null, longitude: null, address: "위치 정보 지원 불가" },
          error: "이 브라우저는 위치 정보를 지원하지 않습니다."
        });
        toast({
          title: "위치 정보 오류",
          description: "이 브라우저는 위치 정보를 지원하지 않습니다.",
          variant: "destructive",
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getAddress(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage;
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "위치 정보 권한이 거부되었습니다.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "위치 정보를 사용할 수 없습니다.";
              break;
            case error.TIMEOUT:
              errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
              break;
            default:
              errorMessage = "알 수 없는 오류가 발생했습니다.";
          }
          
          setLocationState({
            loading: false,
            location: { latitude: null, longitude: null, address: "위치 확인 불가" },
            error: errorMessage
          });
          
          toast({
            title: "위치 정보 오류",
            description: errorMessage,
            variant: "destructive",
          });
        }
      );
    };

    getCurrentLocation();
  }, [toast]);

  return locationState;
}
