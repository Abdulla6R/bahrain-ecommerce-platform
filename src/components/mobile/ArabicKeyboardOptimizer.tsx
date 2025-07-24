'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Paper,
  ActionIcon,
  Tooltip,
  Badge,
  Modal,
  ScrollArea,
  Text
} from '@mantine/core';
import {
  IconKeyboard,
  IconLanguage,
  IconBackspace,
  IconSpace,
  IconCheck,
  IconX,
  IconSettings
} from '@tabler/icons-react';

interface ArabicKeyboardOptimizerProps {
  locale: string;
  onLocaleChange?: (locale: 'ar' | 'en') => void;
  children: React.ReactNode;
}

interface VirtualKeyboardProps {
  isVisible: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  currentInputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

// Arabic keyboard layout
const arabicKeyboardLayout = [
  // Row 1
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  // Row 2
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  // Row 3
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
  // Row 4 (Special characters)
  ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '؟', '؛', '،']
];

// Arabic text prediction and common phrases for Bahrain market
const commonArabicPhrases = {
  shopping: [
    'أريد شراء',
    'السعر كم؟',
    'متوفر؟',
    'التوصيل مجاني؟',
    'دفع بالبنفت',
    'الضمان كم سنة؟',
    'مصنوع في البحرين',
    'حلال',
    'عضوي'
  ],
  location: [
    'المنامة',
    'المحرق',
    'الرفاع',
    'مدينة عيسى',
    'سترة',
    'الحد',
    'البديع',
    'جدحفص',
    'عالي',
    'الزلاق'
  ],
  common: [
    'شكرًا',
    'من فضلك',
    'عفوًا',
    'آسف',
    'ممتاز',
    'جيد جداً',
    'سريع',
    'آمن',
    'مضمون',
    'جودة عالية'
  ]
};

function VirtualKeyboard({ isVisible, onClose, onInsert, currentInputRef }: VirtualKeyboardProps) {
  const [shiftPressed, setShiftPressed] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'Shift') {
      setShiftPressed(!shiftPressed);
      return;
    }
    
    if (key === 'Backspace') {
      const input = currentInputRef.current;
      if (input) {
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const value = input.value;
        
        if (start === end && start > 0) {
          // Delete single character
          const newValue = value.slice(0, start - 1) + value.slice(end);
          input.value = newValue;
          setTimeout(() => {
            input.setSelectionRange(start - 1, start - 1);
          }, 0);
        } else if (start !== end) {
          // Delete selection
          const newValue = value.slice(0, start) + value.slice(end);
          input.value = newValue;
          setTimeout(() => {
            input.setSelectionRange(start, start);
          }, 0);
        }
        
        // Trigger input event for React
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }
      return;
    }

    if (key === 'Space') {
      onInsert(' ');
      return;
    }

    onInsert(shiftPressed && key.length === 1 ? key.toUpperCase() : key);
    
    // Update suggestions based on current input
    updateSuggestions();
  }, [shiftPressed, onInsert, currentInputRef]);

  const updateSuggestions = useCallback(() => {
    const input = currentInputRef.current;
    if (!input) return;

    const value = input.value;
    const words = value.split(' ');
    const currentWord = words[words.length - 1];

    if (currentWord.length >= 2) {
      const suggestions = [];
      
      // Check all phrase categories
      Object.values(commonArabicPhrases).flat().forEach(phrase => {
        if (phrase.includes(currentWord) || phrase.startsWith(currentWord)) {
          suggestions.push(phrase);
        }
      });

      setCurrentSuggestions(suggestions.slice(0, 3));
    } else {
      setCurrentSuggestions([]);
    }
  }, [currentInputRef]);

  const applySuggestion = useCallback((suggestion: string) => {
    const input = currentInputRef.current;
    if (!input) return;

    const value = input.value;
    const words = value.split(' ');
    words[words.length - 1] = suggestion;
    
    input.value = words.join(' ') + ' ';
    
    // Trigger input event for React
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    
    setCurrentSuggestions([]);
    input.focus();
  }, [currentInputRef]);

  if (!isVisible) return null;

  return (
    <Paper
      shadow="xl"
      p="md"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        maxHeight: '60vh'
      }}
    >
      <ScrollArea>
        <Stack gap="sm">
          {/* Header */}
          <Group justify="space-between" mb="xs">
            <Text fw={600}>لوحة المفاتيح العربية</Text>
            <ActionIcon onClick={onClose} variant="light" color="gray">
              <IconX size={16} />
            </ActionIcon>
          </Group>

          {/* Suggestions */}
          {currentSuggestions.length > 0 && (
            <Group gap="xs" mb="sm">
              <Text size="sm" c="dimmed">اقتراحات:</Text>
              {currentSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  size="xs"
                  variant="light"
                  color="blue"
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </Group>
          )}

          {/* Keyboard Layout */}
          <Stack gap="xs">
            {arabicKeyboardLayout.map((row, rowIndex) => (
              <Group key={rowIndex} justify="center" gap="xs">
                {row.map((key, keyIndex) => (
                  <Button
                    key={`${rowIndex}-${keyIndex}`}
                    variant="light"
                    color="gray"
                    size="sm"
                    onClick={() => handleKeyPress(key)}
                    style={{
                      minWidth: '36px',
                      height: '40px',
                      fontSize: '16px',
                      fontFamily: 'Cairo, Arial, sans-serif'
                    }}
                  >
                    {key}
                  </Button>
                ))}
              </Group>
            ))}

            {/* Action Row */}
            <Group justify="center" gap="xs" mt="sm">
              <Button
                variant="light"
                color="red"
                size="sm"
                onClick={() => handleKeyPress('Backspace')}
                style={{ minWidth: '60px' }}
              >
                <IconBackspace size={16} />
              </Button>
              
              <Button
                variant="light"
                color="blue"
                size="sm"
                onClick={() => handleKeyPress('Space')}
                style={{ minWidth: '100px' }}
              >
                مسافة
              </Button>
              
              <Button
                variant="light"
                color="green"
                size="sm"
                onClick={onClose}
                style={{ minWidth: '60px' }}
              >
                <IconCheck size={16} />
              </Button>
            </Group>
          </Stack>

          {/* Quick Phrases */}
          <Stack gap="xs" mt="md">
            <Text size="sm" fw={600} c="dimmed">عبارات سريعة:</Text>
            {Object.entries(commonArabicPhrases).map(([category, phrases]) => (
              <div key={category}>
                <Text size="xs" c="dimmed" mb={4} tt="capitalize">
                  {category === 'shopping' ? 'تسوق' : 
                   category === 'location' ? 'مواقع' : 'عام'}:
                </Text>
                <Group gap="xs">
                  {phrases.slice(0, 3).map((phrase, index) => (
                    <Badge
                      key={index}
                      variant="light"
                      color="orange"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onInsert(phrase + ' ')}
                    >
                      {phrase}
                    </Badge>
                  ))}
                </Group>
              </div>
            ))}
          </Stack>
        </Stack>
      </ScrollArea>
    </Paper>
  );
}

export function ArabicKeyboardOptimizer({ 
  locale, 
  onLocaleChange, 
  children 
}: ArabicKeyboardOptimizerProps) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [currentInputRef, setCurrentInputRef] = useState<React.RefObject<HTMLInputElement | HTMLTextAreaElement>>();
  const [inputEnhancement, setInputEnhancement] = useState(true);
  
  // Enhanced text input component with Arabic support
  const enhanceInputElement = useCallback((element: HTMLInputElement | HTMLTextAreaElement) => {
    if (!element || !inputEnhancement) return;

    // Set proper font for Arabic text
    element.style.fontFamily = locale === 'ar' 
      ? 'Cairo, Amiri, "Times New Roman", serif' 
      : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    // Adjust font size for Arabic (typically needs to be larger)
    if (locale === 'ar') {
      const currentSize = parseFloat(getComputedStyle(element).fontSize);
      element.style.fontSize = `${Math.max(currentSize * 1.1, 16)}px`;
      element.style.lineHeight = '1.8'; // Better line height for Arabic
      element.style.letterSpacing = '0.5px';
    }

    // Set text direction
    element.dir = locale === 'ar' ? 'rtl' : 'ltr';
    
    // Prevent iOS zoom on focus
    if (element.tagName.toLowerCase() === 'input') {
      element.style.fontSize = '16px';
    }

    // Add Arabic input method detection
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const value = target.value;
      
      // Auto-detect Arabic text and switch input method
      const arabicRegex = /[\u0600-\u06FF]/;
      if (arabicRegex.test(value) && locale !== 'ar') {
        onLocaleChange?.('ar');
      } else if (!arabicRegex.test(value) && locale === 'ar') {
        // Only switch to English if the entire text is in Latin script
        const latinRegex = /^[a-zA-Z0-9\s.,!?]*$/;
        if (latinRegex.test(value) && value.length > 3) {
          onLocaleChange?.('en');
        }
      }
    };

    element.addEventListener('input', handleInput);

    // Add keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+A to toggle Arabic keyboard
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowKeyboard(true);
        setCurrentInputRef({ current: element });
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('input', handleInput);
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [locale, onLocaleChange, inputEnhancement]);

  // Auto-enhance input elements
  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
    const cleanupFunctions: (() => void)[] = [];

    inputs.forEach((input) => {
      const cleanup = enhanceInputElement(input as HTMLInputElement | HTMLTextAreaElement);
      if (cleanup) cleanupFunctions.push(cleanup);
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [enhanceInputElement]);

  // Handle virtual keyboard text insertion
  const handleKeyboardInsert = useCallback((text: string) => {
    const input = currentInputRef?.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const value = input.value;

    const newValue = value.slice(0, start) + text + value.slice(end);
    input.value = newValue;
    
    // Set cursor position
    const newPosition = start + text.length;
    setTimeout(() => {
      input.setSelectionRange(newPosition, newPosition);
      input.focus();
    }, 0);

    // Trigger React's onChange
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  }, [currentInputRef]);

  return (
    <>
      {/* Enhanced children with Arabic support */}
      <div className={locale === 'ar' ? 'arabic-enhanced' : 'english-enhanced'}>
        {children}
      </div>

      {/* Floating Action Button for Virtual Keyboard */}
      {locale === 'ar' && (
        <Tooltip label="لوحة المفاتيح العربية" position="top">
          <ActionIcon
            size={48}
            radius="xl"
            variant="filled"
            color="orange"
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '20px',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(255, 165, 0, 0.3)'
            }}
            onClick={() => {
              setShowKeyboard(true);
              // Try to find active input
              const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
              if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                setCurrentInputRef({ current: activeElement });
              }
            }}
            className="sm:hidden"
          >
            <IconKeyboard size={24} />
          </ActionIcon>
        </Tooltip>
      )}

      {/* Language Toggle Button */}
      <Tooltip label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}>
        <ActionIcon
          variant="light"
          color="blue"
          size="lg"
          onClick={() => onLocaleChange?.(locale === 'ar' ? 'en' : 'ar')}
          style={{
            position: 'fixed',
            bottom: '160px',
            right: '20px',
            zIndex: 999
          }}
          className="sm:hidden"
        >
          <IconLanguage size={20} />
        </ActionIcon>
      </Tooltip>

      {/* Virtual Arabic Keyboard */}
      <VirtualKeyboard
        isVisible={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInsert={handleKeyboardInsert}
        currentInputRef={currentInputRef || { current: null }}
      />

      {/* Arabic Typography Styles */}
      <style jsx global>{`
        .arabic-enhanced input,
        .arabic-enhanced textarea {
          font-family: 'Cairo', 'Amiri', 'Times New Roman', serif !important;
          direction: rtl !important;
          text-align: right !important;
          line-height: 1.8 !important;
          letter-spacing: 0.5px !important;
        }
        
        .arabic-enhanced input::placeholder,
        .arabic-enhanced textarea::placeholder {
          text-align: right !important;
          font-family: 'Cairo', 'Amiri', sans-serif !important;
        }

        .english-enhanced input,
        .english-enhanced textarea {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          direction: ltr !important;
          text-align: left !important;
        }

        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .arabic-enhanced input,
          .arabic-enhanced textarea {
            font-size: 16px !important; /* Prevent zoom on iOS */
            -webkit-text-size-adjust: 100%;
          }
        }

        /* Android specific fixes */
        .android .arabic-enhanced input,
        .android .arabic-enhanced textarea {
          font-size: 16px !important;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .arabic-enhanced input,
          .arabic-enhanced textarea,
          .english-enhanced input,
          .english-enhanced textarea {
            border: 2px solid currentColor !important;
            background: white !important;
            color: black !important;
          }
        }

        /* Focus indicators */
        .arabic-enhanced input:focus,
        .arabic-enhanced textarea:focus {
          box-shadow: 0 0 0 2px var(--mantine-color-orange-6) !important;
          border-color: var(--mantine-color-orange-6) !important;
        }

        /* Arabic number formatting */
        .arabic-enhanced input[type="number"] {
          direction: ltr !important; /* Numbers should be LTR even in Arabic */
          text-align: left !important;
        }
      `}</style>
    </>
  );
}