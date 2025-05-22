
import React, { useCallback } from 'react';
import Camera from '@/components/Camera';
import ThemeToggle from '@/components/ThemeToggle';
import { MapPin, List, User, Camera as CameraIcon } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // 선택한 파일을 처리할 수 있는 로직 추가 가능
        console.log('Selected file:', files[0]);
        // 여기에서 파일을 처리하는 로직을 추가할 수 있습니다
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 bg-gray-100 transition-colors duration-300">
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white p-6 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold text-center">RecycLens</h1>
        <p className="text-sm opacity-90 text-center mt-1">이미지 인식 기반 재활용 가이드</p>
      
        {/* 위치 정보 표시 */}
        <div className="mt-3 flex items-center justify-center text-xs opacity-75">
          <MapPin className="w-3 h-3 mr-1" />
          {loading ? (
            <span>위치 확인 중...</span>
          ) : location?.address?.city ? (
            <span>{location.address.city} {location.address.city_district || ''}</span>
          ) : (
            <span>위치 정보 없음</span>
          )}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-2xl border border-white/20 dark:border-white/5 shadow-xl overflow-hidden p-4">
          <Camera />
        </div>
        
        {/* 갤러리에서 선택 버튼 */}
        <button 
          onClick={handleGallerySelect}
          className="w-full max-w-md py-4 flex items-center justify-center gap-2 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-xl border border-green-100 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <ImageIcon size={20} />
          <span>갤러리에서 선택</span>
        </button>
      </main>
      
      {/* 하단 네비게이션 바 */}
      <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 fixed bottom-0 w-full">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center p-2 text-green-600 dark:text-green-400">
            <CameraIcon className="w-6 h-6" />
            <span className="text-xs mt-1">촬영</span>
          </Link>
          
          <Link to="/activity" className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
            <List className="w-6 h-6" />
            <span className="text-xs mt-1">활동</span>
          </Link>
          
          <Link to="/mypage" className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">내정보</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Index;
