import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import RequestCreationScreen from './screens/RequestCreationScreen';
import PhotoCaptureScreen from './screens/PhotoCaptureScreen';

// Define the screen types
type Screen = 'home' | 'request-creation' | 'photo-capture' | 'submission-complete';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const navigateTo = (screen: Screen, request?: any) => {
    setCurrentScreen(screen);
    if (request) {
      setSelectedRequest(request);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen navigateTo={navigateTo} />;
      case 'request-creation':
        return <RequestCreationScreen navigateTo={navigateTo} />;
      case 'photo-capture':
        return <PhotoCaptureScreen navigateTo={navigateTo} request={selectedRequest} />;
      case 'submission-complete':
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">送信完了</h1>
              <p className="text-gray-600 mb-6">「依頼者の確認を待っています」</p>
              <button
                onClick={() => navigateTo('home')}
                className="bg-indigo text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors w-full"
              >
                ホームへ戻る
              </button>
            </div>
          </div>
        );
      default:
        return <HomeScreen navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {renderScreen()}
    </div>
  );
}

export default App;