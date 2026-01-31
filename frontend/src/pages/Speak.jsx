import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radio, 
  FileText, 
  Newspaper, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Loader2, 
  RefreshCw,
  Mic,
  MicOff,
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  MapPin,
  Languages
} from "lucide-react";

const MODES = {
  en: [
    {
      id: "radio",
      name: "Radio Mode",
      icon: Radio,
      description: "Full news articles - Listen like radio broadcast",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "brief",
      name: "Brief Mode",
      icon: FileText,
      description: "Title + Few lines - Quick overview",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "top-news",
      name: "Top 5 News",
      icon: Newspaper,
      description: "Only title + First line",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
    },
  ],
  te: [
    {
      id: "radio",
      name: "రేడియో మోడ్",
      icon: Radio,
      description: "పూర్తి వార్తా కథనాలు - రేడియోలా వినండి",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "brief",
      name: "సంక్షిప్త మోడ్",
      icon: FileText,
      description: "శీర్షిక + కొన్ని పంక్తులు - త్వరగా తెలుసుకోండి",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "top-news",
      name: "టాప్ 5 వార్తలు",
      icon: Newspaper,
      description: "శీర్షిక + మొదటి పంక్తి మాత్రమే",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
    },
  ]
};

const TRANSLATIONS = {
  en: {
    title: "AI News Radio",
    subtitle: "Voice-powered news in Telugu & English",
    voiceCommandsOn: "Voice Commands ON",
    voiceCommandsOff: "Voice Commands OFF",
    voiceCommandsTitle: "Voice Commands:",
    chooseMode: "Choose Listening Mode",
    loadedNews: "Loaded News Items",
    loading: "Fetching latest news...",
    noNews: "No News Available",
    noNewsDesc: "Click refresh to fetch latest headlines",
    playStatus: "playing...",
    playPrompt: "Press play to start listening",
    fetchPrompt: "Fetch news to begin",
    weather: "Weather",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    commands: {
      start: '"news" or "start" - Start playing news',
      stop: '"stop" or "pause" - Stop playback',
      weather: '"weather" - Get weather update',
      next: '"next" - Next news',
      previous: '"previous" - Previous news',
    },
    commandRecognized: "Command Recognized!",
  },
  te: {
    title: "AI న్యూస్ రేడియో",
    subtitle: "తెలుగు & ఇంగ్లీష్ వార్తలు స్వరంతో",
    voiceCommandsOn: "వాయిస్ కమాండ్స్ ఆన్",
    voiceCommandsOff: "వాయిస్ కమాండ్స్ ఆఫ్",
    voiceCommandsTitle: "వాయిస్ కమాండ్స్:",
    chooseMode: "మోడ్ ఎంచుకోండి",
    loadedNews: "లోడ్ చేసిన వార్తలు",
    loading: "తాజా వార్తలు లోడ్ అవుతున్నాయి...",
    noNews: "వార్తలు లేవు",
    noNewsDesc: "తాజా వార్తలు పొందడానికి రిఫ్రెష్ క్లిక్ చేయండి",
    playStatus: "ప్లే అవుతోంది...",
    playPrompt: "ప్లే క్లిక్ చేసి వినడం ప్రారంభించండి",
    fetchPrompt: "వార్తలు పొందడానికి రిఫ్రెష్ చేయండి",
    weather: "వాతావరణం",
    humidity: "తేమ",
    windSpeed: "గాలి వేగం",
    commands: {
      start: '"న్యూస్" లేదా "వార్తలు" - వార్తలు ప్రారంభించు',
      stop: '"స్టాప్" లేదా "ఆపు" - వార్తలు ఆపు',
      weather: '"వాతావరణం" - వాతావరణ సమాచారం',
      next: '"తర్వాత" - తర్వాత వార్త',
      previous: '"మునుపటి" - మునుపటి వార్త',
    },
    commandRecognized: "కమాండ్ గుర్తించబడింది!",
  }
};

const VOICE_COMMANDS = {
  START: ['news', 'న్యూస్', 'వార్తలు', 'start'],
  STOP: ['stop', 'స్టాప్', 'ఆపు', 'pause'],
  WEATHER: ['weather', 'వాతావరణం', 'వెదర్'],
  NEXT: ['next', 'తర్వాత', 'నెక్స్ట్'],
  PREVIOUS: ['previous', 'మునుపటి', 'back'],
};

function BilingualNewsRadio() {
  // Language and UI
  const [uiLanguage, setUiLanguage] = useState("en"); // Interface language
  const [newsLanguage, setNewsLanguage] = useState("te"); // News content language
  
  // Core states
  const [selectedMode, setSelectedMode] = useState("radio");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  // Voice control states
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState("");
  const [showVoiceIndicator, setShowVoiceIndicator] = useState(false);

  // Weather states
  const [weatherData, setWeatherData] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  const [userLocation, setUserLocation] = useState("Hyderabad");

  // Refs
  const speechSynthRef = useRef(null);
  const utteranceRef = useRef(null);
  const recognitionRef = useRef(null);

  const t = TRANSLATIONS[uiLanguage];

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      // Set recognition language based on news language
      recognitionRef.current.lang = newsLanguage === 'te' ? 'te-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript.toLowerCase())
          .join('');
        
        setVoiceCommand(transcript);
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          setTimeout(() => {
            if (isListening) {
              recognitionRef.current?.start();
            }
          }, 1000);
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current?.start();
        }
      };
    }

    return () => {
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
    };
  }, [newsLanguage]);

  // Update recognition language when news language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = newsLanguage === 'te' ? 'te-IN' : 'en-US';
      
      // Restart if currently listening
      if (isListening) {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      }
    }
  }, [newsLanguage]);

  // Handle voice commands
  const handleVoiceCommand = (transcript) => {
    const lowerTranscript = transcript.toLowerCase();

    if (VOICE_COMMANDS.START.some(cmd => lowerTranscript.includes(cmd))) {
      setShowVoiceIndicator(true);
      setTimeout(() => setShowVoiceIndicator(false), 2000);
      
      if (newsData.length === 0) {
        fetchNews();
      } else if (!isPlaying) {
        togglePlayback();
      }
    }

    if (VOICE_COMMANDS.STOP.some(cmd => lowerTranscript.includes(cmd))) {
      setShowVoiceIndicator(true);
      setTimeout(() => setShowVoiceIndicator(false), 2000);
      
      if (isPlaying) {
        togglePlayback();
      }
    }

    if (VOICE_COMMANDS.WEATHER.some(cmd => lowerTranscript.includes(cmd))) {
      setShowVoiceIndicator(true);
      setTimeout(() => setShowVoiceIndicator(false), 2000);
      fetchWeather();
    }

    if (VOICE_COMMANDS.NEXT.some(cmd => lowerTranscript.includes(cmd))) {
      setShowVoiceIndicator(true);
      setTimeout(() => setShowVoiceIndicator(false), 2000);
      skipToNext();
    }

    if (VOICE_COMMANDS.PREVIOUS.some(cmd => lowerTranscript.includes(cmd))) {
      setShowVoiceIndicator(true);
      setTimeout(() => setShowVoiceIndicator(false), 2000);
      skipToPrevious();
    }
  };

  // Toggle voice listening
  const toggleVoiceListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      setShowWeather(true);
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Get current weather information for ${userLocation}, India. Return ONLY valid JSON with no preamble:
{
  "location": "City name",
  "temperature": "temperature in celsius",
  "condition": "weather condition",
  "humidity": "humidity percentage",
  "windSpeed": "wind speed",
  "description": "brief weather description in ${newsLanguage === 'te' ? 'Telugu' : 'English'}"
}`
            }
          ],
          tools: [
            {
              "type": "web_search_20250305",
              "name": "web_search"
            }
          ]
        }),
      });

      const data = await response.json();
      const textContent = data.content
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n");

      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setWeatherData(parsed);
        speakWeather(parsed);
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
      const fallbackWeather = {
        location: userLocation,
        temperature: "28°C",
        condition: "Partly Cloudy",
        humidity: "65%",
        windSpeed: "12 km/h",
        description: newsLanguage === 'te' 
          ? "ఈరోజు వాతావరణం ఆహ్లాదకరంగా ఉంది"
          : "Today's weather is pleasant"
      };
      setWeatherData(fallbackWeather);
      speakWeather(fallbackWeather);
    }
  };

  // Speak weather information
  const speakWeather = (weather) => {
    window.speechSynthesis.cancel();
    
    const weatherText = newsLanguage === 'te'
      ? `${weather.location} వాతావరణం. ఉష్ణోగ్రత ${weather.temperature}. ${weather.description}`
      : `${weather.location} weather. Temperature ${weather.temperature}. ${weather.description}`;
    
    const utterance = new SpeechSynthesisUtterance(weatherText);
    utterance.lang = newsLanguage === 'te' ? 'te-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  // Fetch news
  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const languageName = newsLanguage === 'te' ? 'Telugu' : 'English';
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Search for latest ${languageName} news from India. Get top 5 news items. For each news item provide in ${languageName}:
1. headline (main title in ${languageName})
2. firstLine (opening line in ${languageName} - for top news mode)
3. brief (2-3 sentence summary in ${languageName})
4. fullText (complete article in ${languageName} for radio mode)
5. source (news source name)

Return ONLY valid JSON with no preamble:
{
  "news": [
    {
      "headline": "News title in ${languageName}",
      "firstLine": "First line in ${languageName}",
      "brief": "Brief summary in ${languageName}",
      "fullText": "Full article in ${languageName}",
      "source": "Source name"
    }
  ]
}`
            }
          ],
          tools: [
            {
              "type": "web_search_20250305",
              "name": "web_search"
            }
          ]
        }),
      });

      const data = await response.json();
      const textContent = data.content
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n");

      const jsonMatch = textContent.match(/\{[\s\S]*"news"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setNewsData(parsed.news || []);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      
      // Fallback data based on language
      if (newsLanguage === 'te') {
        setNewsData([
          {
            headline: "టెక్నాలజీ రంగంలో కొత్త పురోగతి",
            firstLine: "కృత్రిమ మేధస్సు రంగంలో భారతీయ కంపెనీలు కొత్త విజయాలు సాధించాయి",
            brief: "టెక్నాలజీ రంగంలో భారతీయ కంపెనీలు కృత్రిమ మేధస్సు సాంకేతికతలో కొత్త విజయాలు సాధించాయి. ఈ పురోగతి ఆరోగ్య, విద్య రంగాలను మార్చగలదు. నిపుణులు ఈ అభివృద్ధిని స్వాగతించారు.",
            fullText: "టెక్నాలజీ రంగంలో ప్రధాన భారతీయ కంపెనీలు కృత్రిమ మేధస్సు పరిశోధనలో గణనీయమైన పురోగతిని ప్రకటించాయి. ఈ కొత్త వ్యవస్థలు అసాధారణమైన తార్కిక సామర్థ్యాలను ప్రదర్శిస్తున్నాయి. నిపుణులు ఇది ఆరోగ్య సంరక్షణ, విద్య, శాస్త్రీయ పరిశోధన వంటి అనేక రంగాలను మార్చగలదని సూచిస్తున్నారు.",
            source: "టెక్ న్యూస్"
          },
          {
            headline: "వాతావరణ శిఖరాగ్ర సమావేశంలో ముఖ్యమైన నిర్ణయాలు",
            firstLine: "ప్రపంచ నేతలు వాతావరణ మార్పులపై కొత్త లక్ష్యాలను నిర్ణయించారు",
            brief: "అంతర్జాతీయ వాతావరణ శిఖరాగ్ర సమావేశంలో 190 దేశాల ప్రతినిధులు భాగస్వామ్యం అయ్యారు. కొత్త ఉద్గార తగ్గింపు లక్ష్యాలు నిర్ణయించబడ్డాయి. పునరుత్పాదక శక్తి కోసం గణనీయమైన నిధులు కేటాయించబడ్డాయి.",
            fullText: "ఈ వారం జరిగిన ప్రపంచ వాతావరణ శిఖరాగ్ర సమావేశంలో 190 కంటే ఎక్కువ దేశాల ప్రతినిధులు వాతావరణ చర్యపై చారిత్రాత్మక ఒప్పందాన్ని కుదుర్చుకున్నారు. ఈ ఒప్పందం ఉద్గారాల తగ్గింపు కోసం కొత్త లక్ష్యాలను నిర్ణయిస్తుంది.",
            source: "ప్రపంచ వార్తలు"
          },
          {
            headline: "క్రికెట్ టోర్నమెంట్‌లో భారత్ గెలుపు",
            firstLine: "భారత క్రికెట్ జట్టు అంతర్జాతీయ టోర్నమెంట్‌లో విజయం సాధించింది",
            brief: "భారత క్రికెట్ జట్టు ఉత్తేజకరమైన ఫైనల్‌లో గెలుపొందింది. కెప్టెన్ అద్భుతమైన ఆట ప్రదర్శించారు. అభిమానులు దేశవ్యాప్తంగా జరుపుకున్నారు.",
            fullText: "అంతర్జాతీయ క్రికెట్ టోర్నమెంట్ ఫైనల్‌లో భారత జట్టు అద్భుతమైన విజయం సాధించింది. చివరి ఓవర్ల వరకు సాగిన ఉత్తేజకరమైన పోరులో భారత్ గెలిచింది.",
            source: "క్రీడా వార్తలు"
          },
          {
            headline: "విద్యా రంగంలో కొత్త పథకం ప్రారంభం",
            firstLine: "ప్రభుత్వం విద్యార్థుల కోసం కొత్త డిజిటల్ విద్యా కార్యక్రమం ప్రారంభించింది",
            brief: "కేంద్ర ప్రభుత్వం డిజిటల్ విద్య కోసం కొత్త పథకాన్ని ప్రారంభించింది. గ్రామీణ విద్యార్థులకు ఉచిత ఇంటర్నెట్ అందుబాటులో ఉంటుంది.",
            fullText: "విద్యా మంత్రిత్వ శాఖ భారతదేశం అంతటా డిజిటల్ అభ్యాసాన్ని ప్రోత్సహించడానికి కొత్త కార్యక్రమాన్ని ప్రారంభించింది. ఈ పథకం గ్రామీణ ప్రాంతాల్లోని విద్యార్థులకు ఉచిత ఇంటర్నెట్ అందిస్తుంది.",
            source: "విద్యా వార్తలు"
          },
          {
            headline: "తెలంగాణలో కొత్త పారిశ్రామిక పార్క్ ప్రారంభం",
            firstLine: "తెలంగాణ ప్రభుత్వం హైదరాబాద్ సమీపంలో కొత్త టెక్ పార్క్‌ను ప్రారంభించింది",
            brief: "తెలంగాణలో కొత్త సాంకేతిక పారిశ్రామిక పార్క్ ప్రారంభమైంది. ఇది వేలాది మందికి ఉద్యోగాలను సృష్టిస్తుంది.",
            fullText: "హైదరాబాద్ సమీపంలో తెలంగాణ ప్రభుత్వం కొత్త అత్యాధునిక సాంకేతిక పారిశ్రామిక పార్క్‌ను ప్రారంభించింది. ఈ అభివృద్ధి 50,000 కంటే ఎక్కువ ఉద్యోగాలను సృష్టిస్తుంది.",
            source: "హైదరాబాద్ న్యూస్"
          }
        ]);
      } else {
        setNewsData([
          {
            headline: "Tech Giants Announce AI Breakthrough",
            firstLine: "Major technology companies unveiled groundbreaking artificial intelligence capabilities",
            brief: "Leading tech companies announced major breakthroughs in AI research. The new systems demonstrate unprecedented reasoning abilities. Experts suggest this could transform healthcare and education.",
            fullText: "Major technology companies have announced significant breakthroughs in artificial intelligence research. These new AI systems showcase remarkable improvements in reasoning and real-world problem solving. Experts believe this advancement could revolutionize multiple industries including healthcare, education, and scientific research.",
            source: "Tech News Daily"
          },
          {
            headline: "Global Climate Summit Reaches Historic Agreement",
            firstLine: "World leaders agreed on ambitious climate targets at the international summit",
            brief: "Representatives from 190 countries reached a historic climate agreement. New emission reduction targets were established. Significant funding committed to renewable energy projects.",
            fullText: "At the global climate summit, representatives from over 190 countries reached a historic agreement on climate action. The accord establishes new targets for emissions reduction and commits significant funding to renewable energy projects. Scientists have praised this as a crucial step forward.",
            source: "World News Network"
          },
          {
            headline: "India Wins International Cricket Tournament",
            firstLine: "Indian cricket team secured victory in the international championship",
            brief: "India won the cricket tournament in a thrilling final match. The captain played an outstanding innings. Fans celebrated across the country.",
            fullText: "The Indian cricket team achieved a stunning victory in the international tournament final. The match went down to the final over in an exciting contest. The captain played a decisive innings that led India to triumph.",
            source: "Sports News"
          },
          {
            headline: "New Digital Education Initiative Launched",
            firstLine: "Government introduces new digital learning program for students",
            brief: "The central government launched a new digital education scheme. Free internet will be available to rural students. The program will benefit millions.",
            fullText: "The Ministry of Education has launched a new initiative to promote digital learning across India. This scheme provides free internet and digital content to students in rural areas. Millions of students are expected to benefit from this program.",
            source: "Education Today"
          },
          {
            headline: "New Tech Park Opens in Telangana",
            firstLine: "Telangana government inaugurated new technology park near Hyderabad",
            brief: "A new tech industrial park was inaugurated in Telangana. It will create thousands of jobs. Many international companies have shown interest.",
            fullText: "The Telangana government has inaugurated a state-of-the-art technology industrial park near Hyderabad. This development is expected to create over 50,000 job opportunities in the next three years. Several international technology companies have already booked space in the facility.",
            source: "Hyderabad Times"
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get content based on mode
  const getContentToSpeak = (newsItem) => {
    switch (selectedMode) {
      case "top-news":
        return `${newsItem.headline}. ${newsItem.firstLine}`;
      case "brief":
        return `${newsItem.headline}. ${newsItem.brief}`;
      case "radio":
        return `${newsItem.headline}. ${newsItem.fullText}`;
      default:
        return newsItem.headline;
    }
  };

  // Speak news
  const speakNews = (index) => {
    if (index >= newsData.length) {
      setIsPlaying(false);
      setCurrentIndex(0);
      return;
    }

    const newsItem = newsData[index];
    const textToSpeak = getContentToSpeak(newsItem);

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = newsLanguage === 'te' ? 'te-IN' : 'en-US';
    utterance.rate = selectedMode === "radio" ? 0.95 : 0.9;
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onend = () => {
      const nextIndex = index + 1;
      if (nextIndex < newsData.length && isPlaying) {
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          speakNews(nextIndex);
        }, 1000);
      } else {
        setIsPlaying(false);
        setCurrentIndex(0);
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", event);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Toggle playback
  const togglePlayback = () => {
    if (newsData.length === 0) {
      fetchNews();
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakNews(currentIndex);
    }
  };

  // Skip to next
  const skipToNext = () => {
    const nextIndex = (currentIndex + 1) % newsData.length;
    setCurrentIndex(nextIndex);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      speakNews(nextIndex);
    }
  };

  // Skip to previous
  const skipToPrevious = () => {
    const prevIndex = currentIndex === 0 ? newsData.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      speakNews(prevIndex);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 1 : 0;
    }
  };

  // Refresh news
  const refreshNews = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentIndex(0);
    fetchNews();
  };

  const currentModes = MODES[uiLanguage];
  const currentMode = currentModes.find(m => m.id === selectedMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <div className="text-center sm:text-left">
            <h1 className="mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl sm:text-5xl font-bold text-transparent">
              {t.title}
            </h1>
            <p className="text-slate-300 text-lg">
              {t.subtitle}
            </p>
          </div>

          {/* Language Toggles */}
          <div className="flex flex-col gap-2">
            {/* UI Language */}
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-slate-400" />
              <div className="flex gap-1 rounded-full border border-white/10 bg-slate-800/50 p-1 backdrop-blur-sm">
                <button
                  onClick={() => setUiLanguage("en")}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    uiLanguage === "en"
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  English UI
                </button>
                <button
                  onClick={() => setUiLanguage("te")}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    uiLanguage === "te"
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  తెలుగు UI
                </button>
              </div>
            </div>

            {/* News Language */}
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-slate-400" />
              <div className="flex gap-1 rounded-full border border-white/10 bg-slate-800/50 p-1 backdrop-blur-sm">
                <button
                  onClick={() => setNewsLanguage("en")}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    newsLanguage === "en"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  English News
                </button>
                <button
                  onClick={() => setNewsLanguage("te")}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    newsLanguage === "te"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  తెలుగు News
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Voice Command Indicator */}
        <AnimatePresence>
          {showVoiceIndicator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="fixed top-4 right-4 z-50 rounded-full bg-green-500 px-6 py-3 text-white shadow-2xl shadow-green-500/50"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="h-3 w-3 rounded-full bg-white"
                />
                <span className="font-semibold">{t.commandRecognized}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Control Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleVoiceListening}
            className={`relative flex items-center gap-3 rounded-full px-8 py-4 font-semibold shadow-2xl transition-all ${
              isListening
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/50"
                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-500/50"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="h-6 w-6" />
                <span>{t.voiceCommandsOff}</span>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-400"
                />
              </>
            ) : (
              <>
                <Mic className="h-6 w-6" />
                <span>{t.voiceCommandsOn}</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Voice Commands Help */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 backdrop-blur-sm"
          >
            <h4 className="mb-3 font-semibold text-white">{t.voiceCommandsTitle}</h4>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-300">
              <div>📢 {t.commands.start}</div>
              <div>⏸️ {t.commands.stop}</div>
              <div>🌤️ {t.commands.weather}</div>
              <div>⏭️ {t.commands.next}</div>
              <div>⏮️ {t.commands.previous}</div>
            </div>
          </motion.div>
        )}

        {/* Weather Card */}
        <AnimatePresence>
          {showWeather && weatherData && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-4 top-24 z-40 w-80 rounded-2xl border border-white/20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 backdrop-blur-xl shadow-2xl"
            >
              <button
                onClick={() => setShowWeather(false)}
                className="absolute right-3 top-3 text-white/60 hover:text-white"
              >
                ✕
              </button>
              
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                <h3 className="text-xl font-bold text-white">{weatherData.location}</h3>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="rounded-full bg-white/10 p-4">
                  {weatherData.condition.includes('Rain') ? (
                    <CloudRain className="h-12 w-12 text-blue-300" />
                  ) : weatherData.condition.includes('Cloud') ? (
                    <Cloud className="h-12 w-12 text-slate-300" />
                  ) : (
                    <Sun className="h-12 w-12 text-yellow-300" />
                  )}
                </div>
                <div>
                  <div className="text-4xl font-bold text-white">{weatherData.temperature}</div>
                  <div className="text-slate-300">{weatherData.condition}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    {t.humidity}
                  </span>
                  <span className="font-semibold text-white">{weatherData.humidity}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    {t.windSpeed}
                  </span>
                  <span className="font-semibold text-white">{weatherData.windSpeed}</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white/10 p-3 text-sm text-slate-200">
                {weatherData.description}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="mb-4 text-center text-xl font-semibold text-white">
            {t.chooseMode}
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            {currentModes.map((mode, index) => {
              const isSelected = selectedMode === mode.id;

              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => setSelectedMode(mode.id)}
                  disabled={isPlaying}
                  className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSelected
                      ? `border-transparent bg-gradient-to-br ${mode.gradient} shadow-2xl scale-105`
                      : "border-white/10 bg-slate-800/30 hover:border-white/20 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="relative z-10">
                    <mode.icon
                      className={`mb-3 h-8 w-8 transition-colors ${
                        isSelected ? "text-white" : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    <h4 className="mb-1 text-lg font-bold text-white">
                      {mode.name}
                    </h4>
                    <p className="text-sm text-slate-300">
                      {mode.description}
                    </p>
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="mode-selector"
                      className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Player Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 rounded-3xl border border-white/10 bg-slate-800/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Current News Display */}
          <div className="mb-8 min-h-[180px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="mb-4 h-16 w-16 animate-spin text-blue-400" />
                <p className="text-lg text-slate-300">{t.loading}</p>
              </div>
            ) : newsData.length > 0 ? (
              <div className="text-center">
                {/* Progress */}
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-3 flex items-center justify-center gap-2"
                >
                  <span className="text-sm font-medium text-blue-400">
                    {currentIndex + 1} / {newsData.length}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-sm text-slate-400">{newsData[currentIndex]?.source}</span>
                </motion.div>

                {/* Mode Badge */}
                <motion.div
                  className="mb-4 flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${currentMode.gradient} px-4 py-2 text-sm font-semibold text-white shadow-lg`}>
                    <currentMode.icon className="h-4 w-4" />
                    {currentMode.name}
                  </div>
                </motion.div>

                {/* Headline */}
                <motion.h2
                  key={`headline-${currentIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-2xl sm:text-3xl font-bold text-white"
                >
                  {newsData[currentIndex]?.headline}
                </motion.h2>

                {/* Content based on mode */}
                {selectedMode === "top-news" && (
                  <motion.p
                    key={`firstline-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg text-slate-300"
                  >
                    {newsData[currentIndex]?.firstLine}
                  </motion.p>
                )}

                {selectedMode === "brief" && (
                  <motion.p
                    key={`brief-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg text-slate-300 max-w-3xl mx-auto"
                  >
                    {newsData[currentIndex]?.brief}
                  </motion.p>
                )}

                {selectedMode === "radio" && (
                  <motion.div
                    key={`full-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-h-64 overflow-y-auto rounded-xl bg-slate-900/50 p-6 text-left"
                  >
                    <p className="text-slate-300 leading-relaxed">
                      {newsData[currentIndex]?.fullText}
                    </p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Newspaper className="mb-4 h-20 w-20 text-slate-600" />
                <p className="mb-2 text-xl font-semibold text-slate-400">
                  {t.noNews}
                </p>
                <p className="text-slate-500">
                  {t.noNewsDesc}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Weather Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchWeather}
              className="rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-3 sm:p-4 text-white shadow-xl shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50"
              title={t.weather}
            >
              <ThermometerSun className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>

            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipToPrevious}
              disabled={newsData.length === 0}
              className="rounded-full bg-slate-700/50 p-3 sm:p-4 text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </motion.button>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshNews}
              disabled={isLoading}
              className="rounded-full bg-slate-700/50 p-3 sm:p-4 text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 sm:h-6 sm:w-6 ${isLoading ? "animate-spin" : ""}`} />
            </motion.button>

            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={togglePlayback}
              disabled={isLoading}
              className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-2xl shadow-purple-500/50 transition-all hover:shadow-purple-500/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPlaying && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-4 border-white"
                />
              )}
              
              {isPlaying ? (
                <Pause className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              ) : (
                <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" />
              )}
            </motion.button>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipToNext}
              disabled={newsData.length === 0}
              className="rounded-full bg-slate-700/50 p-3 sm:p-4 text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 18h2V6h-2zm-11.5-6L13 6v12z"/>
              </svg>
            </motion.button>

            {/* Mute Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              disabled={!isPlaying}
              className="rounded-full bg-slate-700/50 p-3 sm:p-4 text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </motion.button>
          </div>

          {/* Status Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-slate-400">
              {isPlaying
                ? `${currentMode.name} ${t.playStatus}`
                : newsData.length > 0
                ? t.playPrompt
                : t.fetchPrompt}
            </p>
          </motion.div>
        </motion.div>

        {/* News List */}
        {newsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="mb-4 text-xl font-semibold text-white">
              {t.loadedNews}
            </h3>
            <div className="space-y-3">
              {newsData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className={`group cursor-pointer rounded-xl border p-4 sm:p-5 transition-all ${
                    currentIndex === index
                      ? "scale-[1.02] border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-blue-500/20 shadow-lg shadow-purple-500/20"
                      : "border-white/10 bg-slate-800/30 hover:border-white/20 hover:bg-slate-800/50"
                  }`}
                  onClick={() => {
                    setCurrentIndex(index);
                    if (isPlaying) {
                      window.speechSynthesis.cancel();
                      speakNews(index);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-medium text-blue-400">
                          #{index + 1}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{item.source}</span>
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {item.headline}
                      </h4>
                      {selectedMode !== "radio" && (
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {selectedMode === "top-news" ? item.firstLine : item.brief}
                        </p>
                      )}
                    </div>
                    
                    {/* Playing indicator */}
                    {currentIndex === index && isPlaying && (
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              scaleY: [1, 1.5, 1],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            className="h-4 w-1 rounded-full bg-purple-400"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BilingualNewsRadio;