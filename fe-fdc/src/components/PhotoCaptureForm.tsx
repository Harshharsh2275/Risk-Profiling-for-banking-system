"use client"

import type React from "react"
import { useRef, useState, useCallback, useEffect } from "react"
import { Camera, ChevronLeft, RefreshCw, Check, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { PhotoCapture, RegistrationData } from "@/types"

interface PhotoCaptureFormProps {
  onSubmit: (data: Partial<RegistrationData>) => void
  onBack: () => void
  initialData?: PhotoCapture
}

const base64ToFile = (base64String, filename) => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const PhotoCaptureForm: React.FC<PhotoCaptureFormProps> = ({ onSubmit, onBack, initialData }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(
    initialData?.photo ? URL.createObjectURL(initialData.photo) : null
  )
  const [photoFile, setPhotoFile] = useState<File | null>(initialData?.photo || null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setStream(null)
      setCameraActive(false)
    }
  }, [stream])

  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream first
      if (stream) {
        stopCamera()
      }

      console.log("Requesting camera access...")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })

      console.log("Camera access granted, tracks:", mediaStream.getVideoTracks().length)

      if (videoRef.current) {
        // Set srcObject directly
        videoRef.current.srcObject = mediaStream

        // Set up event listeners for proper video loading sequence
        videoRef.current.onloadedmetadata = async () => {
          console.log("Video metadata loaded")

          // Set state before attempting to play
          setCameraActive(true)
          setStream(mediaStream)
          setCameraError(null)

          // Use a small timeout to ensure the state is updated before playing
          setTimeout(async () => {
            if (videoRef.current) {
              try {
                // Check if video element is still connected to the DOM
                if (document.contains(videoRef.current)) {
                  await videoRef.current.play()
                  console.log("Video playback started successfully")
                } else {
                  console.warn("Video element is no longer in the DOM")
                  mediaStream.getTracks().forEach((track) => track.stop())
                }
              } catch (err) {
                console.error("Error playing video:", err)
                setCameraError("Failed to start video playback")
                mediaStream.getTracks().forEach((track) => track.stop())
              }
            }
          }, 100)
        }

        videoRef.current.onerror = (e) => {
          console.error("Video element error:", e)
          setCameraError("Error with video element")
          if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop())
          }
        }
      } else {
        console.error("Video ref is null")
        setCameraError("Video element not found")
      }
    } catch (err) {
      console.error("Error accessing the camera:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setCameraError(`Could not access camera: ${errorMessage}. Please ensure camera permissions are enabled.`)
      setCameraActive(false)
    }
  }, [stream, stopCamera])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
  
      if (!video.videoWidth || !video.videoHeight) {
        toast.error("Camera feed is not active. Please start the camera.");
        return;
      }
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        
        // Convert to File object
        const file = base64ToFile(imageDataUrl, "recent_photograph.jpg");
        
        // Store both formats - URL string for display, File for submission
        setCapturedImage(imageDataUrl);
        setPhotoFile(file);
        
        stopCamera();
        toast.success("Photo captured successfully!");
      } else {
        toast.error("Failed to capture photo: Canvas context unavailable");
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setPhotoFile(null)
    startCamera()
  }, [startCamera])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ photo: { photo: photoFile } });
    if (capturedImage && photoFile) {
    } else {
      toast.error("Please capture your photo before proceeding");
    }
  };

  useEffect(() => {
    // Check if the browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Your browser doesn't support camera access")
      return
    }

    // Add a small delay before starting camera to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      // Auto-start camera if initialData doesn't have an image
      if (!initialData?.photo) {
        startCamera()
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      stopCamera()
    }
  }, [startCamera, stopCamera, initialData])

  useEffect(() => {
    if (videoRef.current && cameraActive) {
      console.log(
        "Video element is active:",
        "Width:",
        videoRef.current.offsetWidth,
        "Height:",
        videoRef.current.offsetHeight,
        "Video Width:",
        videoRef.current.videoWidth,
        "Video Height:",
        videoRef.current.videoHeight,
        "Display style:",
        window.getComputedStyle(videoRef.current).display,
      )
    }
  }, [cameraActive])

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      // Check if video element is actually visible in the DOM
      const videoElement = videoRef.current
      const isVisible = !!(
        videoElement.offsetWidth ||
        videoElement.offsetHeight ||
        videoElement.getClientRects().length
      )
      console.log("Video element visibility check:", isVisible)

      if (!isVisible) {
        console.warn("Video element appears to be hidden in the DOM")
      }
    }
  }, [cameraActive])

  // Clean up image URL object when component unmounts
  useEffect(() => {
    return () => {
      if (capturedImage && capturedImage.startsWith('blob:')) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-section">
        <div className="space-y-8">
          <div className="text-center mb-6">
            <div className="bg-brand-light/10 p-3 inline-block rounded-full mb-2">
              <Camera className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-medium">Photo Verification</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Please capture a clear photo of your face for identity verification
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-4">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <>
                  {/* Always render the video element but control visibility with CSS */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    disablePictureInPicture
                    className={`absolute inset-0 w-full h-full object-cover ${cameraActive && stream ? "block" : "hidden"}`}
                  />

                  {/* Show placeholder when camera is not active */}
                  <div
                    className={`flex flex-col items-center justify-center h-full p-6 text-center ${cameraActive && stream ? "hidden" : "block"}`}
                  >
                    {cameraError ? (
                      <div className="text-destructive space-y-2">
                        <XCircle className="h-10 w-10 mx-auto mb-2" />
                        <p className="font-medium">{cameraError}</p>
                        <p className="text-sm text-muted-foreground">
                          Please check your browser permissions and try again
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="font-medium">Camera is not active</p>
                        <p className="text-sm text-muted-foreground">Click the button below to start your camera</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!cameraError && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 z-10">
                  {capturedImage ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={retakePhoto}
                      className="bg-white/80 backdrop-blur-sm hover:bg-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Retake
                    </Button>
                  ) : cameraActive ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={capturePhoto}
                      className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Capture
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={startCamera}
                      className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Start Camera
                    </Button>
                  )}
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={onBack} className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button type="submit" className="flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}