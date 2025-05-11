import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css';

const App = () => {
  const [showContent, setShowContent] = useState(false);
  const svgRef = useRef(null);
  const textRef = useRef(null);
  const [hoverEllie, setHoverEllie] = useState(false);
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useGSAP(() => {
    
    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      duration: 2,
      ease: "power4.easeInOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1,
      ease: "expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onComplete: () => {
        if (svgRef.current) {
          svgRef.current.style.display = "none"; 
        }
        setShowContent(true); 
      },
    });
  }, []);

 
  useEffect(() => {
    if (!showContent) return;
    
    gsap.fromTo(
      ".landing",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );

    gsap.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      ease: "expo.easeInOut",
    });
    
    gsap.to(".sky", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: 0.2,
      ease: "expo.easeInOut",
    });
    
    // Modified character animation to come from bottom without rotation
    gsap.fromTo(".character", 
      {
        y: "100%", // Start position below the screen
        scale: 1.4,
        rotate: 0, // No rotation
        transformOrigin: "center bottom",
      },
      {
        y: "0%", // End position
        scale: 1.4,
        bottom: "-25%", 
        rotate: 0, // Keep no rotation
        duration: 2,
        delay: 0.2,
        ease: "expo.easeInOut",
        transformOrigin: "center bottom",
      }
    );
    
    gsap.to(".text", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: 0.2,
      ease: "expo.easeInOut",
    });
  }, [showContent]);


  useEffect(() => {
    if (showContent) {
      const handleMouseMove = (e) => {
        const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
        if (textRef.current) {
          gsap.to(textRef.current, {
            x: `${xMove * 0.4}%`,
            duration: 0.5,
            ease: "power2.out"
          });
        }
        
        gsap.to(".sky", {
          x: xMove,
          duration: 0.5,
          ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [showContent]);

  useEffect(() => {
    if (!videoRef.current || !videoSectionRef.current) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
      
          if (videoRef.current) {
          
            videoRef.current.load();
            const playPromise = videoRef.current.play();
            
          
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error("Video play error:", error);
              });
            }
            setIsPlaying(true);
          }
        } else {
   
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(videoSectionRef.current);

    return () => {
      if (videoSectionRef.current) {
        observer.unobserve(videoSectionRef.current);
      }
    };
  }, [showContent]); 


  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };


  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error("Video play error:", error);
          });
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <>
      {!showContent && (
        <div
          ref={svgRef}
          className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-black"
        >
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id="viMask">
                <rect width="100%" height="100%" fill="black" />
                <g className="vi-mask-group">
                  <text
                    x="50%"
                    y="40%"
                    fontSize="90"
                    textAnchor="middle"
                    fill="white"
                    dominantBaseline="middle"
                    fontFamily="last"
                  >
                    THE
                  </text>
                  <text
                    x="50%"
                    y="55%"
                    fontSize="90"
                    textAnchor="middle"
                    fill="white"
                    dominantBaseline="middle"
                    fontFamily="last"
                  >
                    LAST
                  </text>
                  <text
                    x="50%"
                    y="70%"
                    fontSize="90"
                    textAnchor="middle"
                    fill="white"
                    dominantBaseline="middle"
                    fontFamily="last"
                  >
                    OF US
                  </text>
                </g>
              </mask>
            </defs>
            <image
              href="./bg1.png"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              mask="url(#viMask)"
            />
          </svg>
        </div>
      )}

      {showContent && (
        <div className="main w-full h-full rotate-[-10deg] scale-[1.7] transition-all duration-1000">
          <div className="landing overflow-hidden relative w-full h-screen bg-black flex flex-col">
            <div className="navbar absolute z-[100] top-0 left-0 w-full py-5 px-10">
              <div className="logo flex gap-5">
                <div className="lines flex flex-col gap-[4px]">
                  <div className="line w-12 h-1 bg-white"></div>
                  <div className="line w-8 h-1 bg-white"></div>
                  <div className="line w-6 h-1 bg-white"></div>
                </div>
                <h3 className="text-2xl -mt-[2px] leading-none text-white">Naughty Dog</h3>
              </div>
            </div>

            <div className="imagesdiv relative w-full h-screen overflow-hidden">
              <div className="absolute inset-0 bg-black z-0"></div>
              
              <div className="clock-base absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full z-10">
                <img 
                  className="sky w-full h-auto object-contain rotate-[-20deg] scale-[1.5]" 
                  src="./bg2.png" 
                  alt="Clock base" 
                />
                <div 
                  ref={textRef} 
                  className="text absolute flex flex-col top-0 left-1/2 -translate-x-1/2 mt-8 scale-[1.4] rotate-[-10deg]"
                >
                  <h1 className="text-[160px] leading-[130px] ">THE</h1>
                  <h1 className="text-[160px] leading-[130px] ">LAST</h1>
                  <h1 className="text-[160px] leading-[130px] ">OF US</h1>
                </div>
              </div>
              
              <div className="character-container absolute bottom-[-110px] left-1/2 transform -translate-x-1/2 z-20 w-[630px] flex justify-center overflow-hidden">
                <img 
                  className="character h-screen w-auto object-contain object-bottom scale-[2] rotate-0" 
                  src="./joel2.png" 
                  alt="Character" 
                />
              </div>
            </div>
            
            <div className="btmbar text-white w-full py-5 px-10 bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 z-[100]">
              <div className="flex gap-4 items-center">
                <i className="ri-arrow-down-line text-2xl"></i>
                <h3 className="text-[17px] font-sans">Scroll Down</h3>
              </div>
              <img 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[60px]" 
                src="./ps5.png" 
                alt="PS5 Logo" 
              />
            </div>
          </div>
          
          <div className="w-full h-screen flex bg-black items-center justify-center">
            <div className="cntnr flex text-white w-full h-[80%]">
              <div className="limg relative w-1/2 h-full flex items-center justify-center">
                <div 
                  className="image-wrapper w-[350px] h-[550px] relative flex items-center justify-center rounded-2xl overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoverEllie(true)}
                  onMouseLeave={() => setHoverEllie(false)}
                >
                  <img 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${hoverEllie ? 'opacity-0' : 'opacity-100'}`}
                    src="./ellie1.jpeg" 
                    alt="Ellie" 
                  />
                  <img 
                    className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${hoverEllie ? 'opacity-100' : 'opacity-0'}`}
                    src="./ellie2.jpeg" 
                    alt="Ellie" 
                  />
                </div>
              </div>
              <div className="rg w-[30%]">
                <h1 className="text-7xl">The Last Of Us</h1>
                <p className="mt-10 text-3xl">The Last of Us Part II is an award-winning action-adventure game by Naughty Dog, rebuilt for PlayStation 5 with enhanced visuals and immersive gameplay. Set in a post-apocalyptic world, it follows Joel and Ellie as they journey through a devastated America, facing danger and forming a powerful bond in the fight for survival.</p>
                <p className="mt-3 text-3xl">The PS5 version features rebuilt environments, improved character detail, smarter AI, and faster load times. With refined mechanics and cinematic storytelling.</p>
                <button className="mt-5 bg-yellow-500 py-6 px-10 text-4xl text-black">Download Now</button>
              </div>
            </div>
          </div>

          <div
            id="video-section"
            ref={videoSectionRef}
            className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-black"
          >
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="./video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video Controls */}
            <div className="video-controls absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex gap-6">
              {/* Play/Pause Button */}
              <button 
                onClick={togglePlayPause}
                className="flex items-center justify-center bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full w-16 h-16 transition-all duration-300"
              >
                {isPlaying ? (
                  <i className="ri-pause-fill text-4xl"></i>
                ) : (
                  <i className="ri-play-fill text-4xl"></i>
                )}
              </button>
              
              {/* Mute/Unmute Button */}
              <button 
                onClick={toggleMute}
                className="flex items-center justify-center bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full w-16 h-16 transition-all duration-300"
              >
                {isMuted ? (
                  <i className="ri-volume-mute-fill text-4xl"></i>
                ) : (
                  <i className="ri-volume-up-fill text-4xl"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;