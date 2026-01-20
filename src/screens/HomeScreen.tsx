import React, { useState } from 'react';

// Mock data for requests
const mockRequests = [
  {
    id: 1,
    title: '駅前の混雑',
    reward: 300,
    distance: 120,
    location: { lat: 35.6895, lng: 139.6917 },
    status: 'open', // 'open', 'in-progress', 'completed'
    description: '駅前の混雑状況がわかる写真1枚ください'
  },
  {
    id: 2,
    title: 'コンビニ前の様子',
    reward: 200,
    distance: 350,
    location: { lat: 35.6905, lng: 139.6927 },
    status: 'open',
    description: 'コンビニ前の様子を確認したいです'
  },
  {
    id: 3,
    title: '公園の桜',
    reward: 500,
    distance: 900,
    location: { lat: 35.6885, lng: 139.6907 },
    status: 'in-progress',
    description: '満開の桜を撮影してほしいです'
  }
];

const HomeScreen: React.FC<{ navigateTo: (screen: any, request?: any) => void }> = ({ navigateTo }) => {
  const [showList, setShowList] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-status-open'; // 受付中 (Blue)
      case 'in-progress': return 'bg-status-in-progress'; // 対応中 (Orange)
      case 'completed': return 'bg-status-completed'; // 写真到着 (Green)
      default: return 'bg-status-open';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo">KokoPic</h1>
        <div className="flex space-x-4">
          <button className="relative">
            <span className="text-gray-600">🔔</span>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </button>
          <button className="text-gray-600">👤</button>
        </div>
      </header>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-200">
        {/* Mock map with pins */}
        <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
          <div className="text-gray-500">🌍  地図（フル画面）</div>
        </div>
        
        {/* Mock pins for requests */}
        {mockRequests.map((request) => (
          <div 
            key={request.id}
            className={`absolute ${getStatusColor(request.status)} w-6 h-6 rounded-full flex items-center justify-center text-white text-xs transform -translate-x-1/2 -translate-y-1/2 cursor-pointer`}
            style={{ left: `${20 + request.id * 20}%`, top: `${30 + request.id * 15}%` }}
            onClick={() => setSelectedRequest(request)}
          >
            ●
          </div>
        ))}
        
        {/* Current location indicator */}
        <div className="absolute bg-blue-500 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '50%' }}></div>
      </div>

      {/* Request List Panel */}
      <div className={`bg-white shadow-lg transition-transform duration-300 ${showList ? 'h-2/5' : 'h-1/5'}`}>
        <div 
          className="flex justify-center py-2 cursor-pointer"
          onClick={() => setShowList(!showList)}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        <div className="px-4 pb-4">
          <h2 className="font-semibold mb-2">{showList ? '近くの依頼一覧' : '📍 近くの依頼一覧 ▼'}</h2>
          
          {showList && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mockRequests.map((request) => (
                <div 
                  key={request.id}
                  className="p-3 border rounded-lg flex justify-between items-center bg-white shadow-sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    navigateTo('photo-capture', request);
                  }}
                >
                  <div>
                    <div className="font-medium">{request.title}（¥{request.reward}）</div>
                    <div className="text-sm text-gray-500">距離: {request.distance}m</div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(request.status)}`}></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="absolute bottom-20 right-4 bg-indigo text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-xl hover:bg-indigo-700 transition-colors"
        onClick={() => navigateTo('request-creation')}
      >
        ➕
      </button>

      {/* Selected Request Popup */}
      {selectedRequest && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-2">{selectedRequest.title}</h3>
            <p className="text-gray-600 mb-4">{selectedRequest.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-indigo-600 font-semibold">報酬: ¥{selectedRequest.reward}</span>
              <span className="text-gray-500">距離: {selectedRequest.distance}m</span>
            </div>
            <div className="flex space-x-3">
              <button 
                className="flex-1 py-2 bg-gray-200 rounded-lg"
                onClick={() => setSelectedRequest(null)}
              >
                閉じる
              </button>
              <button 
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg"
                onClick={() => {
                  navigateTo('photo-capture', selectedRequest);
                  setSelectedRequest(null);
                }}
              >
                撮影する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;