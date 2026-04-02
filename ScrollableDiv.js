import React, { useEffect, useRef } from 'react';
import './ScrollableDiv.css';

function ScrollableDiv({children, turnWheel=false, hideScrollHint=false, hintZIndex=100, localStorageKeyPrefix='rjsc-scrollable-div'}) {
  const localStorageKey = localStorageKeyPrefix+'_ScrollableDiv_hint_hidden';
  const [hiddenHint, setHiddenHint] = React.useState(false);

  useEffect(() => {
    const savedHidden = localStorage.getItem(localStorageKey) === 'true';
    setHiddenHint(savedHidden);
  }, []);

  const handleHideHint = () => {
    console.log('handleHideHint');
    setHiddenHint(true);
    localStorage.setItem(localStorageKey, 'true');
  };


  const [mouseOver, setMouseOver] = React.useState(false);

  const ref = useRef(null);
  const onWheelHandler = (e) => {
    if(!turnWheel) return;
    e.preventDefault();
    if (ref.current) {
        let initialScroll = ref.current.scrollLeft;
        ref.current.scrollLeft += e.deltaY;
        ref.current.scrollLeft += e.deltaX;
        // if(initialScroll !== ref.current.scrollLeft) e.preventDefault();
    }
  };

  useEffect(() => {
    if(!turnWheel) return;
    const tabBarContainer = ref.current;
    if (tabBarContainer) {
        tabBarContainer.addEventListener('wheel', onWheelHandler);
    }
    return () => {
        if (tabBarContainer) {
            tabBarContainer.removeEventListener('wheel', onWheelHandler);
        }
    };
  }, []);

  return ( 
    <div ref={ref} className='ScrollableDiv position-relative'>
      { (!hideScrollHint && !hiddenHint)  &&
      <div className='d-none d-sm-block position-absolute bg-light text-dark p-2 border shadow-sm' style={{bottom: '0', left: '0', zIndex:hintZIndex, opacity:mouseOver?1:0.25, transition:'opacity 0.5s', cursor:'help'}} onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}>
        <span className={'material-symbols-outlined fs-6 '+(mouseOver?'mx-2':'mx-0')}>west</span>
        <span className='border rounded p-1 bg-white'><span className='material-symbols-outlined fs-6 mx-1'>shift</span> <small className={mouseOver?'':'d-none'} style={{verticalAlign:'top'}}>SHIFT</small></span>
        <span className={'material-symbols-outlined fs-6 '+(mouseOver?'mx-2':'mx-0')}>add</span>
        <span className='border rounded p-1 bg-white'><span className='material-symbols-outlined fs-6 mx-1'>mouse</span> <small className={mouseOver?'':'d-none'} style={{verticalAlign:'top'}}>RUEDITA</small></span>
        <span className={'material-symbols-outlined fs-6 '+(mouseOver?'mx-2':'mx-0')}>east</span>
        { mouseOver &&
        <button className='btn btn-sm btn-light d-none d-sm-inline ms-2' onClick={handleHideHint}>Ocultar</button>
        }
      </div>
      }
      <div style={{width: 'max-content'}}>
        {children}
      </div>
    </div>
  )
}

export default ScrollableDiv