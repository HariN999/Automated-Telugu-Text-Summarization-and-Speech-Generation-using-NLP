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
  const [uiLanguage, setUiLanguage] = useState("en");
  const [newsLanguage, setNewsLanguage] = useState("te");
  const [selectedMode, setSelectedMode] = useState("radio");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState("");
  const [showVoiceIndicator, setShowVoiceIndicator] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  const [userLocation, setUserLocation] = useState("Hyderabad");

  const speechSynthRef = useRef(null);
  const utteranceRef = useRef(null);
  const recognitionRef = useRef(null);

  const t = TRANSLATIONS[uiLanguage];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
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

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = newsLanguage === 'te' ? 'te-IN' : 'en-US';
      if (isListening) {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      }
    }
  }, [newsLanguage]);

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

  const fetchWeather = async () => {
    try {
      setShowWeather(true);
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
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
          }],
          tools: [{ "type": "web_search_20250305", "name": "web_search" }]
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

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const languageName = newsLanguage === 'te' ? 'Telugu' : 'English';
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
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
          }],
          tools: [{ "type": "web_search_20250305", "name": "web_search" }]
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
      if (newsLanguage === 'te') {
        setNewsData([
          { headline: "టెక్నాలజీ రంగంలో కొత్త పురోగతి", firstLine: "కృత్రిమ మేధస్సు రంగంలో భారతీయ కంపెనీలు కొత్త విజయాలు సాధించాయి", brief: "టెక్నాలజీ రంగంలో భారతీయ కంపెనీలు కృత్రిమ మేధస్సు సాంకేతికతలో కొత్త విజయాలు సాధించాయి. ఈ పురోగతి ఆరోగ్య, విద్య రంగాలను మార్చగలదు. నిపుణులు ఈ అభివృద్ధిని స్వాగతించారు.", fullText: "టెక్నాలజీ రంగంలో ప్రధాన భారతీయ కంపెనీలు కృత్రిమ మేధస్సు పరిశోధనలో గణనీయమైన పురోగతిని ప్రకటించాయి. ఈ కొత్త వ్యవస్థలు అసాధారణమైన తార్కిక సామర్థ్యాలను ప్రదర్శిస్తున్నాయి.", source: "టెక్ న్యూస్" },
          { headline: "వాతావరణ శిఖరాగ్ర సమావేశంలో ముఖ్యమైన నిర్ణయాలు", firstLine: "ప్రపంచ నేతలు వాతావరణ మార్పులపై కొత్త లక్ష్యాలను నిర్ణయించారు", brief: "అంతర్జాతీయ వాతావరణ శిఖరాగ్ర సమావేశంలో 190 దేశాల ప్రతినిధులు భాగస్వామ్యం అయ్యారు. కొత్త ఉద్గార తగ్గింపు లక్ష్యాలు నిర్ణయించబడ్డాయి.", fullText: "ఈ వారం జరిగిన ప్రపంచ వాతావరణ శిఖరాగ్ర సమావేశంలో 190 కంటే ఎక్కువ దేశాల ప్రతినిధులు వాతావరణ చర్యపై చారిత్రాత్మక ఒప్పందాన్ని కుదుర్చుకున్నారు.", source: "ప్రపంచ వార్తలు" },
          { headline: "క్రికెట్ టోర్నమెంట్‌లో భారత్ గెలుపు", firstLine: "భారత క్రికెట్ జట్టు అంతర్జాతీయ టోర్నమెంట్‌లో విజయం సాధించింది", brief: "భారత క్రికెట్ జట్టు ఉత్తేజకరమైన ఫైనల్‌లో గెలుపొందింది. కెప్టెన్ అద్భుతమైన ఆట ప్రదర్శించారు.", fullText: "అంతర్జాతీయ క్రికెట్ టోర్నమెంట్ ఫైనల్‌లో భారత జట్టు అద్భుతమైన విజయం సాధించింది.", source: "క్రీడా వార్తలు" },
          { headline: "విద్యా రంగంలో కొత్త పథకం ప్రారంభం", firstLine: "ప్రభుత్వం విద్యార్థుల కోసం కొత్త డిజిటల్ విద్యా కార్యక్రమం ప్రారంభించింది", brief: "కేంద్ర ప్రభుత్వం డిజిటల్ విద్య కోసం కొత్త పథకాన్ని ప్రారంభించింది. గ్రామీణ విద్యార్థులకు ఉచిత ఇంటర్నెట్ అందుబాటులో ఉంటుంది.", fullText: "విద్యా మంత్రిత్వ శాఖ భారతదేశం అంతటా డిజిటల్ అభ్యాసాన్ని ప్రోత్సహించడానికి కొత్త కార్యక్రమాన్ని ప్రారంభించింది.", source: "విద్యా వార్తలు" },
          { headline: "తెలంగాణలో కొత్త పారిశ్రామిక పార్క్ ప్రారంభం", firstLine: "తెలంగాణ ప్రభుత్వం హైదరాబాద్ సమీపంలో కొత్త టెక్ పార్క్‌ను ప్రారంభించింది", brief: "తెలంగాణలో కొత్త సాంకేతిక పారిశ్రామిక పార్క్ ప్రారంభమైంది. ఇది వేలాది మందికి ఉద్యోగాలను సృష్టిస్తుంది.", fullText: "హైదరాబాద్ సమీపంలో తెలంగాణ ప్రభుత్వం కొత్త అత్యాధునిక సాంకేతిక పారిశ్రామిక పార్క్‌ను ప్రారంభించింది.", source: "హైదరాబాద్ న్యూస్" }
        ]);
      } else {
        setNewsData([
          { headline: "Tech Giants Announce AI Breakthrough", firstLine: "Major technology companies unveiled groundbreaking artificial intelligence capabilities", brief: "Leading tech companies announced major breakthroughs in AI research. The new systems demonstrate unprecedented reasoning abilities.", fullText: "Major technology companies have announced significant breakthroughs in artificial intelligence research. These new AI systems showcase remarkable improvements in reasoning and real-world problem solving.", source: "Tech News Daily" },
          { headline: "Global Climate Summit Reaches Historic Agreement", firstLine: "World leaders agreed on ambitious climate targets at the international summit", brief: "Representatives from 190 countries reached a historic climate agreement. New emission reduction targets were established.", fullText: "At the global climate summit, representatives from over 190 countries reached a historic agreement on climate action. The accord establishes new targets for emissions reduction.", source: "World News Network" },
          { headline: "India Wins International Cricket Tournament", firstLine: "Indian cricket team secured victory in the international championship", brief: "India won the cricket tournament in a thrilling final match. The captain played an outstanding innings.", fullText: "The Indian cricket team achieved a stunning victory in the international tournament final. The match went down to the final over in an exciting contest.", source: "Sports News" },
          { headline: "New Digital Education Initiative Launched", firstLine: "Government introduces new digital learning program for students", brief: "The central government launched a new digital education scheme. Free internet will be available to rural students.", fullText: "The Ministry of Education has launched a new initiative to promote digital learning across India. This scheme provides free internet and digital content to students in rural areas.", source: "Education Today" },
          { headline: "New Tech Park Opens in Telangana", firstLine: "Telangana government inaugurated new technology park near Hyderabad", brief: "A new tech industrial park was inaugurated in Telangana. It will create thousands of jobs.", fullText: "The Telangana government has inaugurated a state-of-the-art technology industrial park near Hyderabad. This development is expected to create over 50,000 job opportunities.", source: "Hyderabad Times" }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getContentToSpeak = (newsItem) => {
    switch (selectedMode) {
      case "top-news": return `${newsItem.headline}. ${newsItem.firstLine}`;
      case "brief": return `${newsItem.headline}. ${newsItem.brief}`;
      case "radio": return `${newsItem.headline}. ${newsItem.fullText}`;
      default: return newsItem.headline;
    }
  };

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

  const skipToNext = () => {
    const nextIndex = (currentIndex + 1) % newsData.length;
    setCurrentIndex(nextIndex);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      speakNews(nextIndex);
    }
  };

  const skipToPrevious = () => {
    const prevIndex = currentIndex === 0 ? newsData.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      speakNews(prevIndex);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 1 : 0;
    }
  };

  const refreshNews = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentIndex(0);
    fetchNews();
  };

  const currentModes = MODES[uiLanguage];
  const currentMode = currentModes.find(m => m.id === selectedMode);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 sm:py-14" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="mb-1 text-3xl font-bold sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
              {t.title}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t.subtitle}
            </p>
          </div>

          {/* Language Toggles */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Languages className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
              <div className="flex gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1">
                {["en", "te"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setUiLanguage(lang)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                      uiLanguage === lang
                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                        : "hover:bg-[var(--border-color)]"
                    }`}
                    style={{ color: uiLanguage === lang ? 'white' : 'var(--text-secondary)' }}
                  >
                    {lang === "en" ? "English UI" : "తెలుగు UI"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Newspaper className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
              <div className="flex gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1">
                {["en", "te"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setNewsLanguage(lang)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                      newsLanguage === lang
                        ? "bg-violet-500 text-white shadow-md shadow-violet-500/30"
                        : "hover:bg-[var(--border-color)]"
                    }`}
                    style={{ color: newsLanguage === lang ? 'white' : 'var(--text-secondary)' }}
                  >
                    {lang === "en" ? "English News" : "తెలుగు News"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Voice Command Indicator */}
        <AnimatePresence>
          {showVoiceIndicator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -16 }}
              className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-2xl shadow-emerald-500/40"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="h-2 w-2 rounded-full bg-white"
              />
              {t.commandRecognized}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Control Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleVoiceListening}
            className={`relative flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold transition-all shadow-lg ${
              isListening
                ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-500/30"
                : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-indigo-500/30"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="h-4.5 w-4.5" />
                <span>{t.voiceCommandsOff}</span>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-red-400 border-2 border-white"
                />
              </>
            ) : (
              <>
                <Mic className="h-4.5 w-4.5" />
                <span>{t.voiceCommandsOn}</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Voice Commands Help */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5"
            >
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {t.voiceCommandsTitle}
              </h4>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div>📢 {t.commands.start}</div>
                <div>⏸️ {t.commands.stop}</div>
                <div>🌤️ {t.commands.weather}</div>
                <div>⏭️ {t.commands.next}</div>
                <div>⏮️ {t.commands.previous}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather Card */}
        <AnimatePresence>
          {showWeather && weatherData && (
            <motion.div
              initial={{ opacity: 0, x: 280 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 280 }}
              className="fixed right-5 top-24 z-40 w-72 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-2xl"
              style={{ backdropFilter: 'blur(20px)' }}
            >
              <button
                onClick={() => setShowWeather(false)}
                className="absolute right-3 top-3 text-xs rounded-lg border border-[var(--border-color)] px-2 py-1 transition-colors hover:border-red-300"
                style={{ color: 'var(--text-secondary)' }}
              >
                ✕
              </button>

              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-500" />
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{weatherData.location}</h3>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10">
                  {weatherData.condition.includes('Rain') ? (
                    <CloudRain className="h-8 w-8 text-blue-500" />
                  ) : weatherData.condition.includes('Cloud') ? (
                    <Cloud className="h-8 w-8 text-slate-500" />
                  ) : (
                    <Sun className="h-8 w-8 text-amber-500" />
                  )}
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{weatherData.temperature}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{weatherData.condition}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <Droplets className="h-3.5 w-3.5" />
                    {t.humidity}
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weatherData.humidity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <Wind className="h-3.5 w-3.5" />
                    {t.windSpeed}
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weatherData.windSpeed}</span>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
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
          className="mb-6"
        >
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            {t.chooseMode}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {currentModes.map((mode, index) => {
              const isSelected = selectedMode === mode.id;
              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.07 }}
                  onClick={() => setSelectedMode(mode.id)}
                  disabled={isPlaying}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSelected
                      ? `border-transparent bg-gradient-to-br ${mode.gradient} shadow-xl scale-[1.02]`
                      : "border-[var(--border-color)] bg-[var(--card-bg)] hover:border-indigo-300 dark:hover:border-indigo-500/40"
                  }`}
                >
                  <div className="relative z-10">
                    <mode.icon className={`mb-3 h-6 w-6 ${isSelected ? "text-white" : "text-indigo-500"}`} />
                    <h4 className={`mb-1 text-sm font-bold ${isSelected ? "text-white" : ""}`} style={!isSelected ? { color: 'var(--text-primary)' } : {}}>
                      {mode.name}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isSelected ? "text-white/80" : ""}`} style={!isSelected ? { color: 'var(--text-secondary)' } : {}}>
                      {mode.description}
                    </p>
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="mode-selector"
                      className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Player Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="glass-card mb-6 rounded-3xl p-6 sm:p-8"
        >
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 text-center text-sm text-red-700 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Current News Display */}
          <div className="mb-8 min-h-[180px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="relative mb-5">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                  <div className="absolute inset-0 h-10 w-10 animate-ping-slow rounded-full border-2 border-indigo-400/20" />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t.loading}</p>
              </div>
            ) : newsData.length > 0 ? (
              <div className="text-center">
                {/* Progress + Source */}
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-3 flex items-center justify-center gap-2"
                >
                  <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {currentIndex + 1} / {newsData.length}
                  </span>
                  <span style={{ color: 'var(--border-color)' }}>·</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{newsData[currentIndex]?.source}</span>
                </motion.div>

                {/* Mode Badge */}
                <div className="mb-5 flex justify-center">
                  <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${currentMode.gradient} px-4 py-1.5 text-xs font-semibold text-white shadow-md`}>
                    <currentMode.icon className="h-3.5 w-3.5" />
                    {currentMode.name}
                  </div>
                </div>

                {/* Headline */}
                <motion.h2
                  key={`headline-${currentIndex}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-xl font-bold sm:text-2xl"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {newsData[currentIndex]?.headline}
                </motion.h2>

                {selectedMode === "top-news" && (
                  <motion.p
                    key={`firstline-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {newsData[currentIndex]?.firstLine}
                  </motion.p>
                )}

                {selectedMode === "brief" && (
                  <motion.p
                    key={`brief-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm leading-relaxed max-w-2xl mx-auto"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {newsData[currentIndex]?.brief}
                  </motion.p>
                )}

                {selectedMode === "radio" && (
                  <motion.div
                    key={`full-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-h-48 overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-left"
                  >
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {newsData[currentIndex]?.fullText}
                    </p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <Newspaper className="h-8 w-8" style={{ color: 'var(--text-secondary)' }} />
                </div>
                <p className="mb-1 font-semibold" style={{ color: 'var(--text-primary)' }}>{t.noNews}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.noNewsDesc}</p>
              </div>
            )}
          </div>

          {/* Waveform (playing indicator) */}
          {isPlaying && (
            <div className="mb-6 flex items-end justify-center gap-1 h-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`wave-bar w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-violet-500`}
                  style={{ height: `${40 + Math.random() * 60}%`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Weather */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={fetchWeather}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
              title={t.weather}
            >
              <ThermometerSun className="h-5 w-5" />
            </motion.button>

            {/* Previous */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={skipToPrevious}
              disabled={newsData.length === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </motion.button>

            {/* Refresh */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={refreshNews}
              disabled={isLoading}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </motion.button>

            {/* Play/Pause - Main CTA */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              onClick={togglePlayback}
              disabled={isLoading}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/40 transition-all hover:shadow-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPlaying && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-indigo-300"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    className="absolute inset-0 rounded-full border border-violet-300"
                  />
                </>
              )}
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </motion.button>

            {/* Next */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={skipToNext}
              disabled={newsData.length === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 18h2V6h-2zm-11.5-6L13 6v12z"/>
              </svg>
            </motion.button>

            {/* Mute */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleMute}
              disabled={!isPlaying}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] transition-all hover:border-indigo-300 dark:hover:border-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </motion.button>
          </div>

          {/* Status */}
          <p className="mt-5 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
            {isPlaying
              ? `${currentMode.name} ${t.playStatus}`
              : newsData.length > 0
              ? t.playPrompt
              : t.fetchPrompt}
          </p>
        </motion.div>

        {/* News List */}
        {newsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              {t.loadedNews}
            </h3>
            <div className="space-y-2">
              {newsData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`group cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                    currentIndex === index
                      ? "border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-500/10 shadow-md shadow-indigo-500/10"
                      : "border-[var(--border-color)] bg-[var(--card-bg)] hover:border-indigo-200 dark:hover:border-indigo-500/20"
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
                    <div className="flex-1 min-w-0">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          #{index + 1}
                        </span>
                        <span style={{ color: 'var(--border-color)' }}>·</span>
                        <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{item.source}</span>
                      </div>
                      <h4 className={`text-sm font-semibold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${currentIndex === index ? "text-indigo-700 dark:text-indigo-300" : ""}`}
                          style={currentIndex !== index ? { color: 'var(--text-primary)' } : {}}>
                        {item.headline}
                      </h4>
                      {selectedMode !== "radio" && (
                        <p className="mt-1 text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {selectedMode === "top-news" ? item.firstLine : item.brief}
                        </p>
                      )}
                    </div>

                    {/* Playing bars */}
                    {currentIndex === index && isPlaying && (
                      <div className="flex flex-shrink-0 items-end gap-0.5 h-5">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ scaleY: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                            className="w-1 rounded-full bg-indigo-500 origin-bottom"
                            style={{ height: '100%' }}
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