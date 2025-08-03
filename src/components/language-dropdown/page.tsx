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
import Cookies from 'js-cookie';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { GiWorld } from 'react-icons/gi';

export default function LanguageSelector() {
  const [languages] = useState([
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [googleInitialized, setGoogleInitialized] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initAttempts = useRef<number>(0);
  const maxInitAttempts = 10;

  // Initialize with saved language preference or default to 'en'
  useEffect(() => {
    const savedLanguage =
      typeof window !== 'undefined'
        ? localStorage.getItem('preferredLanguage') ||
          Cookies.get('preferredLanguage')
        : null;

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

      // Remove any existing translate element
      const existingElement = document.getElementById(
        'google_translate_element'
      );
      if (existingElement) {
        existingElement.remove();
      }

      // Create new translate element
      const translateElement = document.createElement('div');
      translateElement.id = 'google_translate_element';
      translateElement.style.display = 'none';
      document.body.appendChild(translateElement);

      // Initialize Google Translate
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: languages.map((lang) => lang.code).join(','),
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }

      console.log('Google Translate initialized successfully');
      setGoogleInitialized(true);
      return true;
    } catch (error) {
      console.error('Error initializing Google Translate:', error);
      return false;
    }
  };

  // Load Google Translate script
  const loadGoogleTranslateScript = () => {
    console.log('Loading Google Translate script...');

    // Check if script is already loaded
    const existingScript = document.querySelector(
      'script[src*="translate.google.com"]'
    );
    if (existingScript) {
      console.log('Google Translate script already exists');
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onload = () => {
      console.log('Google Translate script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Google Translate script');
    };
    document.head.appendChild(script);
  };

  // Initialize Google Translate
  useEffect(() => {
    // Load the script first
    loadGoogleTranslateScript();

    const initGoogleTranslate = () => {
      if (initAttempts.current >= maxInitAttempts) {
        console.error(
          'Maximum Google Translate initialization attempts reached'
        );
        return;
      }

      initAttempts.current += 1;
      console.log(
        `Attempt ${initAttempts.current} to initialize Google Translate`
      );

      if (createTranslateElement()) {
        // Apply saved language preference on initial load
        if (selectedLanguage !== 'en') {
          setTimeout(() => {
            selectLanguage(selectedLanguage);
          }, 1000);
        }
      } else {
        // If initialization fails, try again after a delay
        setTimeout(initGoogleTranslate, 1000 * initAttempts.current);
      }
    };

    // Set up the callback
    window.googleTranslateElementInit = initGoogleTranslate;

    // Check if Google Translate is already available
    if (isGoogleTranslateAvailable()) {
      console.log('Google Translate already available, initializing...');
      initGoogleTranslate();
    } else {
      // Try to initialize after a delay in case the script is already loaded
      setTimeout(() => {
        if (isGoogleTranslateAvailable() && !googleInitialized) {
          console.log('Google Translate became available, initializing...');
          initGoogleTranslate();
        }
      }, 2000);
    }

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        delete window.googleTranslateElementInit;
      }
    };
  }, [languages, selectedLanguage, googleInitialized]);

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
    console.log(`Attempting to change language to: ${languageCode}`);

    if (!googleInitialized) {
      console.log('Google Translate not initialized, storing preference only');
      localStorage.setItem('preferredLanguage', languageCode);
      Cookies.set('preferredLanguage', languageCode, { expires: 365 });
      setSelectedLanguage(languageCode);
      return;
    }

    localStorage.setItem('preferredLanguage', languageCode);
    Cookies.set('preferredLanguage', languageCode, { expires: 365 });
    setSelectedLanguage(languageCode);

    // Method 1: Using the combo box
    const trySelectWithComboBox = (attempts = 0) => {
      const select = document.querySelector(
        '.goog-te-combo'
      ) as HTMLSelectElement;
      if (select) {
        console.log('Found Google Translate combo box, changing value...');
        select.value = languageCode;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      } else if (attempts < 5) {
        console.log(
          `Combo box not found, retrying... (attempt ${attempts + 1})`
        );
        setTimeout(
          () => trySelectWithComboBox(attempts + 1),
          500 * (attempts + 1)
        );
        return false;
      }
      return false;
    };

    if (trySelectWithComboBox()) {
      console.log('Language changed via combo box');
      return;
    }

    // Method 2: Direct cookie manipulation as fallback
    try {
      const newTransValue = `/en/${languageCode}`;
      const currentTransCookie = Cookies.get('googtrans');

      console.log(`Current translation cookie: ${currentTransCookie}`);
      console.log(`Setting new translation cookie: ${newTransValue}`);

      if (currentTransCookie !== newTransValue) {
        // Set the Google Translate cookies
        Cookies.set('googtrans', newTransValue, { path: '/' });

        // Also try setting with domain
        try {
          Cookies.set('googtrans', newTransValue, {
            path: '/',
            domain: `.${window.location.hostname}`,
          });
        } catch (e) {
          console.log('Could not set cookie with domain, using path only');
        }

        // Reload the page to apply the translation
        console.log('Reloading page to apply translation...');
        window.location.reload();
      } else {
        console.log('Translation cookie already set to desired value');
      }
    } catch (error) {
      console.error('Error setting translation cookie:', error);
    }
  };

  const changeLanguage = (languageCode: string) => {
    if (languageCode === selectedLanguage) return;
    console.log(`Language change requested: ${languageCode}`);
    setIsDropdownOpen(false);

    setTimeout(() => {
      selectLanguage(languageCode);
    }, 50);
  };

  return (
    <>
      <div className='relative' ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className='flex cursor-pointer items-center gap-1 self-stretch'
          aria-expanded={isDropdownOpen}
          aria-label='Select language'
        >
          <GiWorld size={24} />
        </button>

        {isDropdownOpen && (
          <div className='absolute top-8 right-0 backdrop-blur-md shadow-lg py-3 z-50 w-[106px]'>
            <ul className='flex flex-col w-full'>
              {languages.map((language) => (
                <li
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`w-full text-[#3f2a16] px-4 py-2 hover:bg-[#fafafa52] text-sm flex justify-between items-center gap-2 cursor-pointer ${
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
