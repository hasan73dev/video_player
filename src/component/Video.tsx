import { FaPlay,FaPause,FaVolumeUp, FaVolumeOff } from "react-icons/fa";
import { useState,useRef,useEffect } from "react";
import { RiFullscreenFill,RiFullscreenExitLine } from "react-icons/ri";
import { FaVolumeLow,FaVolumeXmark} from "react-icons/fa6";
import v1 from "../videos/test.mp4"
let lastTime:number;
export default function Video() {
    const video = useRef<HTMLVideoElement>(null)
    const input = useRef<HTMLInputElement>(null)
    const volumeDiv = useRef<HTMLDivElement>(null)
    const videoControlsContainerDiv = useRef<HTMLDivElement>(null)
    const fullScreenDiv = useRef<HTMLDivElement>(null)
    const timeline = useRef<HTMLDivElement>(null)
    const [isPlaying,setIsPlaying] = useState<boolean>(false)
    const [isFull,setIsFull] = useState<boolean>(false)
    const [durationValue,setDurationValue] =  useState("0:00")
    const [allDuration,setAllDuration] = useState("")
    const startAndPause = () =>{
        if(video.current?.paused){
            video.current?.play()
            setIsPlaying(prev => !prev)
            return
        }
        video.current?.pause();
        setIsPlaying(prev => !prev)
        lastTime = Date.now()
        videoControlsContainerDiv.current!.style.opacity = "1"
        fullScreenDiv.current!.style.cursor = "default"
        
    }
    const fullAndExit = () =>{
      if(document.fullscreenElement === null){
        fullScreenDiv.current?.requestFullscreen()
 
      }
      else{
        document.exitFullscreen()
      }
      setIsFull(prev => !prev)
    }

    
    const duration = (time:number) =>{
      let second:string | number = Math.floor(time % 60)
      if(second < 10){
       second = second.toString()
       second = "0" + second
      }
      const minute = Math.floor((time / 60) % 60)
      const hour  = Math.floor(time / 3600)
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastTime;
      if (elapsedTime > 2500) { 
        lastTime = currentTime + currentTime;
        videoControlsContainerDiv.current!.style.opacity = "0"
        fullScreenDiv.current!.style.cursor = "none"

      }
   
      return hour === 0 ? `${minute}:${second}` : `${hour}:${minute}:${second}`
    

    }
    const changeIcons = () =>{
   
      input.current?.style.setProperty("--sound",input.current.value)

     if(+input.current!.value < 0.3 && +input.current!.value !==0){
 
        volumeDiv.current!.dataset.volume = "low"

      }
      else if(+input.current!.value >0.3){
          volumeDiv.current!.dataset.volume = "full"

      }
      else if(+input.current!.value === 0){
      
     volumeDiv.current!.dataset.volume = "off"

        
      }
      videoControlsContainerDiv.current!.style.opacity = "1"
        fullScreenDiv.current!.style.cursor = "default"
    }
    const changeVolume = () =>{
      video.current!.volume = +input.current?.value!
      video.current!.muted = false;
      changeIcons()
      console.log(video.current?.duration)
       

    }
    const forwardOrBackward = (time:number) =>{
      console.log("gdssd")
        video.current!.currentTime += time
        
      
    }
    const cases = (e:KeyboardEvent) =>{
        switch(e.key.toLowerCase()){
         case " ":
         case "k":
            startAndPause();
            break;
          case "f":
          fullAndExit()
          break;
          case "m":
            mute();
            break;
          case "arrowright":
            forwardOrBackward(5)
            break; 
          case "arrowleft":
            forwardOrBackward(-5)
            break;

        }
        videoControlsContainerDiv.current!.style.opacity = "1"
        fullScreenDiv.current!.style.cursor = "default"
        lastTime = Date.now()

    }
    const mute = () =>{
      video.current!.muted = !video.current?.muted
      video.current?.muted ?  input.current!.value = "0" 
      : input.current!.value = video.current?.volume.toString()! 
      
    changeIcons()
    }

    const opacity = (e:any) =>{ 
        lastTime = Date.now()
        videoControlsContainerDiv.current!.style.opacity = "1"
        fullScreenDiv.current!.style.cursor = "default"
      

    }
    const jump = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) =>{
      const position = (e.nativeEvent.offsetX / timeline.current!.offsetWidth) * video.current!.duration
        video.current!.currentTime = position;
      }
    useEffect(() =>{
        document.addEventListener("keydown",cases)
        video.current!.volume = +input.current?.value!

   
        return () =>{
          document.removeEventListener("keydown",cases);
           console.log("giddi")

        }
    },[])
    

  return (
    
    <div style={{color:"white",display:"flex",justifyContent:"center"}}>
        <div  ref={fullScreenDiv}  className="video" style={{position:"relative",width:"77%",display:"flex"}}>
      <video  onMouseMove={(e) => opacity(e)} onLoadedData={() =>{
        setAllDuration(duration(video.current!.duration))
      }} onTimeUpdate={() => { 
        const present = video.current!.currentTime / video.current!.duration;
        timeline.current?.style.setProperty("--progress",present.toString())
        setDurationValue(duration(video.current!.currentTime))
      
      }} onDoubleClick={() => fullAndExit()} onClick={() => startAndPause()}  ref={video} width="100%" height="100%"  >
        <source src={v1}  type="video/mp4"/>
      </video>
    
    <div ref={videoControlsContainerDiv} style={{position:"absolute",bottom:"0",left:"0",right:"0",fontSize:"20px"}} className="video-controls-container">
    <div onClick={(e) => jump(e)} ref={timeline} className="timeline">
    </div>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
   <div style={{display:"flex",gap:"20px",padding:"8.5px"}}>
    <div style={{cursor:"pointer",display:"flex",alignItems:"center"}} onClick={() =>startAndPause()}> {isPlaying  ?  <FaPause />  : <FaPlay/>  } </div> 
   <div ref = {volumeDiv} data-volume = "full" className="volume-container" style={{display:"flex",alignItems:"center"}}>
   <div onClick={() => mute()}>
   <FaVolumeUp  className="volume-full"/>
    <FaVolumeLow className="volume-low"/>
    <FaVolumeXmark className="volume-off"/>
    </div>
   <div style={{display:"flex",alignItems:"center",marginLeft:"8px"}}><input ref={input}  onChange={() => changeVolume()} className="volume-slider" min = "0" max = "1" step = "any" type="range" /></div> 
    <div style={{display:"flex",gap:"5px",marginLeft:"10px",position:"relative",top:"-2px"}}>
      <div>{durationValue}</div>/
      <div>{allDuration}</div>
    </div>
    
    </div>
   </div>
   <div style={{display:"flex",gap:"20px",padding:"8.5px"}}>
   <div></div>
    <div style={{cursor:"pointer"}} onClick={() => fullAndExit()} >{isFull ? <RiFullscreenExitLine/> : <RiFullscreenFill/> } </div>
   </div>
    </div>
    </div>
    </div>
 
    </div>
  )
}

