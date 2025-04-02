
import React, { useEffect, useRef } from 'react';

const SoundEffects = () => {
  const audioRefs = {
    select: useRef(null),
    win: useRef(null),
    lose: useRef(null),
    start: useRef(null),
    match: useRef(null)
  };
  
  // Exponer los métodos de reproducción globalmente
  useEffect(() => {
    window.playSoundEffect = (type) => {
      if (audioRefs[type]?.current) {
        audioRefs[type].current.currentTime = 0;
        audioRefs[type].current.play();
      }
    };
    
    return () => {
      window.playSoundEffect = null;
    };
  }, []);

  return (
    <div className="hidden">
      <audio ref={audioRefs.select} src="/sounds/select.mp3" preload="auto" />
      <audio ref={audioRefs.win} src="/sounds/win.mp3" preload="auto" />
      <audio ref={audioRefs.lose} src="/sounds/lose.mp3" preload="auto" />
      <audio ref={audioRefs.start} src="/sounds/start.mp3" preload="auto" />
      <audio ref={audioRefs.match} src="/sounds/match.mp3" preload="auto" />
    </div>
  );
};

export default SoundEffects;
