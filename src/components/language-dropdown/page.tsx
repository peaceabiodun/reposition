'use client';
declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import Cookies from 'js-cookie';
import { GoGlobe } from 'react-icons/go';
import { IoCheckmarkOutline } from 'react-icons/io5';

export default function LanguageSelector() {
  const [languages] = useState([
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },

    // Add more languages as needed
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [googleInitialized, setGoogleInitialized] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initAttempts = useRef<number>(0);
  const maxInitAttempts = 5; // Maximum number of initialization attempts

  // Initialize with saved language preference or default to 'en'
  useEffect(() => {
    // Check for saved preference in localStorage and cookies
    const savedLanguage =
      typeof window !== 'undefined'
        ? localStorage.getItem('preferredLanguage') ||
          Cookies.get('preferredLanguage')
        : null;

    // Set saved language if it exists and is in our language list, otherwise default to English
    if (
      savedLanguage &&
      languages.some((lang) => lang.code === savedLanguage)
    ) {
      setSelectedLanguage(savedLanguage);
    }
  }, [languages]);

  // Function to safely check if Google Translate is available
  const isGoogleTranslateAvailable = () => {
    return (
      typeof window !== 'undefined' &&
      window.google &&
      window.google.translate &&
      typeof window.google.translate.TranslateElement === 'function'
    );
  };

  // Function to create the Google Translate element
  const createTranslateElement = () => {
    try {
      if (!isGoogleTranslateAvailable()) {
        console.log('Google Translate not yet available, waiting...');
        return false;
      }

      // First, check if element already exists
      let translateElement = document.getElementById(
        'google_translate_element'
      );

      // If not, create it
      if (!translateElement) {
        translateElement = document.createElement('div');
        translateElement.id = 'google_translate_element';
        translateElement.style.display = 'none';
        document.body.appendChild(translateElement);
      }

      // Initialize Google Translate
      if (
        isGoogleTranslateAvailable() &&
        window.google &&
        window.google.translate
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: languages.map((lang) => lang.code).join(','),
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }

      setGoogleInitialized(true);
      return true;
    } catch (error) {
      console.error('Error initializing Google Translate:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!scriptLoaded) return;

    // Initialize Google Translate functionality
    const initGoogleTranslate = () => {
      if (initAttempts.current >= maxInitAttempts) {
        console.error(
          'Maximum Google Translate initialization attempts reached'
        );
        return;
      }

      initAttempts.current += 1;

      if (createTranslateElement()) {
        // Apply saved language preference on initial load
        if (selectedLanguage !== 'en') {
          setTimeout(() => {
            selectLanguage(selectedLanguage);
          }, 1000);
        }
      } else {
        // If initialization fails, try again after a delay
        setTimeout(initGoogleTranslate, 500 * initAttempts.current);
      }
    };

    // Add the callback to the window object
    window.googleTranslateElementInit = initGoogleTranslate;

    // Trigger initialization if script is already loaded
    if (isGoogleTranslateAvailable()) {
      initGoogleTranslate();
    }

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        delete window.googleTranslateElementInit;
      }
    };
  }, [languages, selectedLanguage, scriptLoaded]);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to directly select language from Google Translate
  const selectLanguage = (languageCode: string) => {
    if (!googleInitialized) {
      // Store preference but don't try to change language yet
      localStorage.setItem('preferredLanguage', languageCode);
      Cookies.set('preferredLanguage', languageCode, { expires: 365 });
      setSelectedLanguage(languageCode);
      return;
    }

    localStorage.setItem('preferredLanguage', languageCode);
    Cookies.set('preferredLanguage', languageCode, { expires: 365 });
    setSelectedLanguage(languageCode);

    // Try different methods to change the language

    // Method 1: Using the combo box
    const trySelectWithComboBox = (attempts = 0) => {
      const select = document.querySelector(
        '.goog-te-combo'
      ) as HTMLSelectElement;
      if (select) {
        select.value = languageCode;
        // Use both event approaches for better browser compatibility
        select.dispatchEvent(new Event('change', { bubbles: true }));

        // Also try with a more compatible approach
        const event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, false);
        select.dispatchEvent(event);

        return true;
      } else if (attempts < 3) {
        // Retry a few times with increasing delay
        setTimeout(
          () => trySelectWithComboBox(attempts + 1),
          300 * (attempts + 1)
        );
        return false;
      }
      return false;
    };

    if (trySelectWithComboBox()) return;

    // Method 2: Using the iframe approach as fallback
    try {
      const iframes = document.getElementsByClassName('goog-te-menu-frame');
      if (iframes && iframes.length > 0) {
        const iframe = iframes[0] as HTMLIFrameElement;
        if (iframe) {
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const languageLinks = iframeDoc.getElementsByTagName('a');

            for (let i = 0; i < languageLinks.length; i++) {
              const langText = languageLinks[i].textContent;
              const langMatch = languages.find(
                (lang) =>
                  langText?.includes(lang.name) && lang.code === languageCode
              );

              if (langMatch) {
                // Try to simulate a more natural click
                languageLinks[i].dispatchEvent(
                  new MouseEvent('mousedown', { bubbles: true })
                );
                languageLinks[i].dispatchEvent(
                  new MouseEvent('mouseup', { bubbles: true })
                );
                languageLinks[i].click();
                return;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error selecting language via iframe:', error);
    }

    // Method 3: Last resort - try to access the translation cookie directly
    try {
      // Force a reload if we've changed the language but the UI hasn't updated
      if (document.cookie.includes('googtrans')) {
        const currentTransCookie = Cookies.get('googtrans');
        const newTransValue = `/en/${languageCode}`;

        if (currentTransCookie !== newTransValue) {
          // Set the Google Translate cookies
          Cookies.set('googtrans', newTransValue, { path: '/' });
          Cookies.set('googtrans', newTransValue, {
            path: '/',
            domain: `.${window.location.hostname}`,
          });

          // Reload the page to apply the translation
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error setting translation cookie:', error);
    }
  };

  const changeLanguage = (languageCode: string) => {
    if (languageCode === selectedLanguage) return;
    setIsDropdownOpen(false);

    setTimeout(() => {
      selectLanguage(languageCode);
    }, 50);
  };

  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  // // Get language name from code
  // const getLanguageName = (code: string): string => {
  //   const language = languages.find((lang) => lang.code === code);
  //   return language ? language.name : 'English';
  // };

  const handleScriptLoad = () => {
    setScriptLoaded(true);

    // Double-check if Google Translate is available after script loads
    setTimeout(() => {
      if (
        isGoogleTranslateAvailable() &&
        !googleInitialized &&
        typeof window.googleTranslateElementInit === 'function'
      ) {
        window.googleTranslateElementInit();
      }
    }, 500);
  };

  const handleScriptError = () => {
    console.error('Failed to load Google Translate script');
  };

  return (
    <>
      <Script
        src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        strategy='lazyOnload'
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />

      <div className='relative' ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className='flex cursor-pointer items-center gap-1 self-stretch'
          aria-expanded={isDropdownOpen}
          aria-label='Select language'
        >
          <GoGlobe size={24} />
        </button>

        {isDropdownOpen && (
          <div className='absolute top-8 right-0 backdrop-blur-md shadow-lg  py-3 z-50 w-[106px]'>
            <ul className='flex flex-col w-full'>
              {languages.map((language) => (
                <li
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`w-full text-[#3f2a16] px-4 py-2 hover:bg-[#fafafa52] text-sm flex justify-between items-center gap-2 ${
                    selectedLanguage === language.code ? ' bg-[#fafafa52]' : ''
                  }`}
                >
                  <p className=''>{language.name}</p>
                  {selectedLanguage === language.code && (
                    <IoCheckmarkOutline size={16} className='text-[#572a0e]' />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Invisible container for Google Translate */}
      <div id='google_translate_element' style={{ display: 'none' }}></div>
    </>
  );
}
