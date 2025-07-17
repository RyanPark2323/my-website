import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { timelineData } from '../data/timelineData';

const Timeline = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigateToItem = (index) => {
    if (index < 0 || index >= timelineData.length || isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section className="mb-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-12 text-gray-800 text-center relative inline-block w-full">
        My Journey So Far
        <span className="absolute w-16 h-1 bg-green-500 -bottom-2 left-1/2 transform -translate-x-1/2"></span>
      </h2>
      
      <div className="relative h-96 overflow-hidden">
        <div className="absolute top-24 left-0 w-full h-1 bg-gray-300 z-10"></div>
        
        <div 
          className="absolute top-0 left-0 h-full flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 300 - 100}px)`
          }}
        >
          {timelineData.map((item, index) => (
            <div key={index} className="relative min-w-[250px] mx-12 pt-8 text-center z-20">
              <div 
                className={`absolute top-[92px] left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white shadow-lg cursor-pointer transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-green-600 scale-150' 
                    : 'bg-green-500 hover:scale-125'
                }`}
                onClick={() => navigateToItem(index)}
              ></div>
              
              <div className="font-bold text-green-500 mb-2 text-lg">{item.date}</div>
              
              <div className={`bg-white rounded-lg p-5 mt-8 shadow-lg transition-all duration-300 min-h-[150px] ${
                index === currentIndex ? 'transform translate-y-0 opacity-100' : 'transform translate-y-5 opacity-0'
              }`}>
                <h3 className="mb-2 text-gray-800 text-xl font-bold">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center mt-5">
        <button 
          className="bg-green-500 text-white px-5 py-2 rounded-full mx-2 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={() => navigateToItem(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="inline w-5 h-5" /> Previous
        </button>
        <button 
          className="bg-green-500 text-white px-5 py-2 rounded-full mx-2 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={() => navigateToItem(currentIndex + 1)}
          disabled={currentIndex === timelineData.length - 1}
        >
          Next <ChevronRight className="inline w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default Timeline;