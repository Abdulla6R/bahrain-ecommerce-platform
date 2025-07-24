'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Card,
  Group,
  Stack,
  ActionIcon,
  Text,
  Badge,
  Button,
  Image,
  Indicator,
  Transition,
  Paper,
  Progress,
  Overlay
} from '@mantine/core';
import {
  IconHeart,
  IconShare,
  IconZoomIn,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconDownload,
  IconMaximize,
  IconPlay,
  IconPause,
  IconStar
} from '@tabler/icons-react';

interface ProductImage {
  id: string;
  url: string;
  altEn: string;
  altAr?: string;
  isVideo?: boolean;
  thumbnail?: string;
}

interface SwipeableProductGalleryProps {
  images: ProductImage[];
  locale: string;
  productName: string;
  productPrice?: number;
  productRating?: number;
  onImageSelect?: (imageId: string) => void;
  autoPlay?: boolean;
  showThumbnails?: boolean;
  enableZoom?: boolean;
}

interface SwipeState {
  currentIndex: number;
  startX: number;
  currentX: number;
  isDragging: boolean;
  startTime: number;
  velocity: number;
}

export function SwipeableProductGallery({
  images,
  locale,
  productName,
  productPrice,
  productRating,
  onImageSelect,
  autoPlay = false,
  showThumbnails = true,
  enableZoom = true
}: SwipeableProductGalleryProps) {
  const isRTL = locale === 'ar';
  const [swipeState, setSwipeState] = useState<SwipeState>({
    currentIndex: 0,
    startX: 0,
    currentX: 0,
    isDragging: false,
    startTime: 0,
    velocity: 0
  });
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate translate value based on current index and drag offset
  const translateX = useMemo(() => {
    const baseTranslate = -swipeState.currentIndex * 100;
    const dragOffset = swipeState.isDragging 
      ? (swipeState.currentX - swipeState.startX) / (galleryRef.current?.offsetWidth || 1) * 100
      : 0;
    
    return baseTranslate + dragOffset;
  }, [swipeState.currentIndex, swipeState.isDragging, swipeState.currentX, swipeState.startX]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isFullscreen && images.length > 1) {
      autoPlayTimerRef.current = setTimeout(() => {
        setSwipeState(prev => ({
          ...prev,
          currentIndex: (prev.currentIndex + 1) % images.length
        }));
      }, 4000);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [swipeState.currentIndex, isAutoPlaying, isFullscreen, images.length]);

  // Preload adjacent images for smooth swiping
  useEffect(() => {
    const preloadRange = 2; // Preload 2 images on each side
    const start = Math.max(0, swipeState.currentIndex - preloadRange);
    const end = Math.min(images.length - 1, swipeState.currentIndex + preloadRange);
    
    for (let i = start; i <= end; i++) {
      if (!loadedImages.has(i)) {
        const img = new window.Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(i));
        };
        img.src = images[i].url;
      }
    }
  }, [swipeState.currentIndex, images, loadedImages]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setSwipeState(prev => ({
      ...prev,
      startX: touch.clientX,
      currentX: touch.clientX,
      isDragging: true,
      startTime: Date.now(),
      velocity: 0
    }));
    
    // Pause auto-play while swiping
    setIsAutoPlaying(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeState.isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeState.startX;
    const deltaTime = Date.now() - swipeState.startTime;
    const velocity = deltaX / deltaTime;
    
    setSwipeState(prev => ({
      ...prev,
      currentX: touch.clientX,
      velocity
    }));

    // Prevent vertical scrolling while swiping horizontally
    if (Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  }, [swipeState.isDragging, swipeState.startX, swipeState.startTime]);

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.isDragging) return;

    const deltaX = swipeState.currentX - swipeState.startX;
    const containerWidth = galleryRef.current?.offsetWidth || 1;
    const threshold = containerWidth * 0.2; // 20% of container width
    const velocityThreshold = 0.5;

    let newIndex = swipeState.currentIndex;

    // Determine swipe direction and intensity
    if (Math.abs(deltaX) > threshold || Math.abs(swipeState.velocity) > velocityThreshold) {
      if (deltaX > 0 && !isRTL || deltaX < 0 && isRTL) {
        // Swipe right (or left in RTL) - go to previous image
        newIndex = Math.max(0, swipeState.currentIndex - 1);
      } else if (deltaX < 0 && !isRTL || deltaX > 0 && isRTL) {
        // Swipe left (or right in RTL) - go to next image
        newIndex = Math.min(images.length - 1, swipeState.currentIndex + 1);
      }
    }

    setSwipeState(prev => ({
      ...prev,
      currentIndex: newIndex,
      isDragging: false,
      currentX: 0,
      startX: 0,
      velocity: 0
    }));

    // Trigger haptic feedback on successful swipe
    if (newIndex !== swipeState.currentIndex && 'vibrate' in navigator) {
      navigator.vibrate([10]);
    }

    // Callback for image selection
    if (onImageSelect && newIndex !== swipeState.currentIndex) {
      onImageSelect(images[newIndex].id);
    }

    // Resume auto-play after a delay
    setTimeout(() => {
      if (autoPlay) setIsAutoPlaying(true);
    }, 3000);
  }, [
    swipeState.isDragging,
    swipeState.currentX,
    swipeState.startX,
    swipeState.currentIndex,
    swipeState.velocity,
    isRTL,
    images,
    onImageSelect,
    autoPlay
  ]);

  const handleThumbnailClick = (index: number) => {
    setSwipeState(prev => ({ ...prev, currentIndex: index }));
    setIsAutoPlaying(false);
    if (onImageSelect) {
      onImageSelect(images[index].id);
    }
  };

  const handleZoomToggle = (e: React.MouseEvent) => {
    if (!enableZoom) return;
    
    e.preventDefault();
    
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
    } else {
      const rect = imageContainerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomOrigin({ x, y });
      }
      setIsZoomed(true);
      setZoomLevel(2.5);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-BH' : 'en-BH', {
      style: 'currency',
      currency: 'BHD',
      minimumFractionDigits: 3
    }).format(amount);
  };

  const currentImage = images[swipeState.currentIndex];

  return (
    <>
      <Card withBorder padding={0} className="overflow-hidden">
        
        {/* Main Gallery */}
        <div
          ref={galleryRef}
          className="relative overflow-hidden"
          style={{ aspectRatio: '4/3' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Image Container */}
          <div
            className="flex transition-transform duration-300 ease-out h-full"
            style={{
              transform: `translateX(${translateX}%)`,
              width: `${images.length * 100}%`
            }}
          >
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative flex-shrink-0 w-full h-full"
                style={{ width: `${100 / images.length}%` }}
              >
                <div
                  ref={index === swipeState.currentIndex ? imageContainerRef : null}
                  className="relative w-full h-full overflow-hidden cursor-pointer"
                  onClick={handleZoomToggle}
                  style={{
                    transform: isZoomed && index === swipeState.currentIndex
                      ? `scale(${zoomLevel})`
                      : 'scale(1)',
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {image.isVideo ? (
                    <video
                      src={image.url}
                      poster={image.thumbnail}
                      className="w-full h-full object-cover"
                      controls={index === swipeState.currentIndex}
                      muted
                      loop
                    />
                  ) : (
                    <Image
                      src={image.url}
                      alt={isRTL && image.altAr ? image.altAr : image.altEn}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  )}
                  
                  {/* Loading Overlay */}
                  {!loadedImages.has(index) && (
                    <Overlay className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
                    </Overlay>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <ActionIcon
                className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10"
                size="lg"
                variant="filled"
                color="white"
                onClick={() => {
                  const newIndex = swipeState.currentIndex > 0 
                    ? swipeState.currentIndex - 1 
                    : images.length - 1;
                  setSwipeState(prev => ({ ...prev, currentIndex: newIndex }));
                }}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white'
                }}
              >
                {isRTL ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
              </ActionIcon>

              <ActionIcon
                className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10"
                size="lg"
                variant="filled"
                color="white"
                onClick={() => {
                  const newIndex = swipeState.currentIndex < images.length - 1 
                    ? swipeState.currentIndex + 1 
                    : 0;
                  setSwipeState(prev => ({ ...prev, currentIndex: newIndex }));
                }}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white'
                }}
              >
                {isRTL ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
              </ActionIcon>
            </>
          )}

          {/* Gallery Controls */}
          <div className="absolute top-4 right-4 z-10">
            <Group gap="xs">
              {enableZoom && (
                <ActionIcon
                  variant="filled"
                  color="white"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  onClick={handleZoomToggle}
                >
                  <IconZoomIn size={16} />
                </ActionIcon>
              )}
              
              <ActionIcon
                variant="filled"
                color="white"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={() => setIsFullscreen(true)}
              >
                <IconMaximize size={16} />
              </ActionIcon>

              <ActionIcon
                variant="filled"
                color="red"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <IconHeart size={16} />
              </ActionIcon>

              <ActionIcon
                variant="filled"
                color="blue"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <IconShare size={16} />
              </ActionIcon>
            </Group>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 z-10">
              <Badge
                variant="filled"
                color="dark"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
              >
                {swipeState.currentIndex + 1} / {images.length}
              </Badge>
            </div>
          )}

          {/* Auto-play Control */}
          {autoPlay && images.length > 1 && (
            <ActionIcon
              className="absolute bottom-4 right-4 z-10"
              variant="filled"
              color="white"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            >
              {isAutoPlaying ? <IconPause size={16} /> : <IconPlay size={16} />}
            </ActionIcon>
          )}

          {/* Progress Indicator for Auto-play */}
          {isAutoPlaying && images.length > 1 && (
            <Progress
              value={((swipeState.currentIndex + 1) / images.length) * 100}
              size="xs"
              color="orange"
              className="absolute bottom-0 left-0 right-0"
            />
          )}
        </div>

        {/* Product Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <Stack gap="xs">
            <Group justify="space-between" align="flex-end">
              <div>
                <Text c="white" fw={600} size="lg" lineClamp={1}>
                  {productName}
                </Text>
                {productRating && (
                  <Group gap="xs">
                    <IconStar size={16} fill="orange" color="orange" />
                    <Text c="white" size="sm">
                      {productRating.toFixed(1)}
                    </Text>
                  </Group>
                )}
              </div>
              {productPrice && (
                <Text c="white" fw={700} size="xl">
                  {formatCurrency(productPrice)}
                </Text>
              )}
            </Group>
          </Stack>
        </div>

        {/* Thumbnail Strip */}
        {showThumbnails && images.length > 1 && (
          <Paper p="xs" className="border-t">
            <Group gap="xs" justify="center">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative cursor-pointer rounded overflow-hidden transition-all duration-200 ${
                    index === swipeState.currentIndex 
                      ? 'ring-2 ring-orange-500 scale-110' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                  style={{ width: 50, height: 50 }}
                >
                  <Image
                    src={image.thumbnail || image.url}
                    alt={`${isRTL && image.altAr ? image.altAr : image.altEn} thumbnail`}
                    className="w-full h-full object-cover"
                  />
                  {image.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <IconPlay size={16} color="white" />
                    </div>
                  )}
                </div>
              ))}
            </Group>
          </Paper>
        )}
      </Card>

      {/* Fullscreen Modal */}
      <Transition mounted={isFullscreen} transition="fade" duration={300}>
        {(styles) => (
          <div
            style={{
              ...styles,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              zIndex: 9999
            }}
            onClick={() => setIsFullscreen(false)}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Close Button */}
              <ActionIcon
                className="absolute top-4 right-4 z-10"
                size="xl"
                variant="filled"
                color="white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <IconX size={24} />
              </ActionIcon>

              {/* Fullscreen Image */}
              <div
                className="max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                {currentImage.isVideo ? (
                  <video
                    src={currentImage.url}
                    className="max-w-full max-h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <Image
                    src={currentImage.url}
                    alt={isRTL && currentImage.altAr ? currentImage.altAr : currentImage.altEn}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>

              {/* Download Button */}
              <ActionIcon
                className="absolute bottom-4 right-4"
                size="xl"
                variant="filled"
                color="orange"
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = currentImage.url;
                  link.download = `${productName}_${swipeState.currentIndex + 1}`;
                  link.click();
                }}
              >
                <IconDownload size={20} />
              </ActionIcon>
            </div>
          </div>
        )}
      </Transition>

      {/* Swipe Gesture Styles */}
      <style jsx>{`
        .gallery-container {
          touch-action: pan-y pinch-zoom;
        }
        
        .gallery-image {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        /* Prevent text selection during swipe */
        .gallery-container * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </>
  );
}