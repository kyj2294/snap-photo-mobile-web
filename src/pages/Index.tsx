
import React, { useCallback } from 'react';
import Camera from '@/components/Camera';
import ThemeToggle from '@/components/ThemeToggle';
import NavigationBar from '@/components/NavigationBar';
import { MapPin, ImageIcon } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

const Index = () => {
  const {
    location,
    loading
  } = useLocation();

  // 갤러리에서 이미지 선택 핸들러
  const handleGallerySelect = useCallback(() => {
    // 파일 선택 다이얼로그 생성
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    // 파일 선택 이벤트 핸들러
    input.onchange = e => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // 선택한 파일을 처리할 수 있는 로직 추가 가능
        console.log('Selected file:', files[0]);
        // 여기에서 파일을 처리하는 로직을 추가할 수 있습니다
      }
    };
  }, []);
  
  return <div className="min-h-screen flex flex-col dark:bg-gray-900 bg-gray-100 transition-colors duration-300 pb-20">
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white p-6 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold text-center">RecycLens</h1>
        <p className="text-sm opacity-90 text-center mt-1">이미지 인식 기반 재활용 가이드</p>
      
        {/* 위치 정보 표시 */}
        {location && (
          <div className="mt-3 flex items-center justify-center text-xs opacity-75">
            <MapPin className="w-3 h-3 mr-1" />
            <span>
              {typeof location.address === 'string' 
                ? location.address 
                : location.address?.city 
                  ? `${location.address.city}${location.address.city_district ? ` ${location.address.city_district}` : ''}`
                  : '위치 정보 사용 가능'}
            </span>
          </div>
        )}
        
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-2xl border border-white/20 dark:border-white/5 shadow-xl overflow-hidden p-4">
          <Camera />
        </div>
        
        {/* 갤러리에서 선택 버튼 */}
        <button onClick={handleGallerySelect} className="w-full max-w-md py-4 flex items-center justify-center gap-2 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-xl border border-green-100 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
          <ImageIcon size={20} />
          <span>갤러리에서 선택</span>
        </button>
      </main>
      
      {/* 하단 네비게이션 바 */}
      <NavigationBar />
    </div>;
};

export default Index;
