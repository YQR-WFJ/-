/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from 'motion/react';
import { 
  Home, 
  TrendingUp, 
  Settings, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown,
  Flower2,
  Battery,
  Zap,
  Bluetooth,
  X,
  Star,
  Sun,
  CloudRain,
  Waves,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceArea,
  Dot
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Tab = 'today' | 'chat' | 'trend' | 'hub';
type SubPage = 'main' | 'log';
type HRVStatus = 'calm' | 'balanced' | 'stress-light' | 'stress-medium';

interface HRVDataPoint {
  date: string;
  time?: string;
  score: number;
  hasIntervention?: boolean;
  summary?: string;
  scoreChange?: string;
  duration?: string;
  mode?: string;
  params?: { freq: string; width: string; intensity: string };
  feedback?: string;
}

// --- Components ---

const TypewriterText = ({ text, speed = 30, onComplete }: { text: string, speed?: number, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

const StatusRing = ({ status, isIntervening = false }: { status: HRVStatus, isIntervening?: boolean }) => {
  const colors = {
    'calm': 'from-[#E8DDD0] to-[#F5E6D3]',
    'balanced': 'from-[#C8D8E4] to-[#D8E4EE]',
    'stress-light': 'from-[#D0E8E0] to-[#E0F0E8]',
    'stress-medium': 'from-[#F5D0C0] to-[#FAE0D0]',
  };

  const text = {
    'calm': '今天的你，很平静',
    'balanced': '状态稳定，继续保持',
    'stress-light': '有一点紧绷，深呼吸',
    'stress-medium': '今天的你，需要休息一下',
  };

  return (
    <div className="relative flex items-center justify-center w-72 h-72">
      <motion.div 
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br opacity-60 blur-md",
          colors[status]
        )}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className={cn(
          "relative w-full h-full rounded-full bg-gradient-to-br flex flex-col items-center justify-center p-10 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]",
          colors[status]
        )}
        animate={{ 
          borderRadius: ["50% 50% 50% 50%", "48% 52% 50% 48%", "52% 48% 52% 50%", "50% 50% 50% 50%"],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {!isIntervening && (
            <motion.span 
              key={status}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-xl font-medium text-gray-700 leading-relaxed tracking-tight"
            >
              {text[status]}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const MetricItem = ({ label, value, direction }: { label: string, value: string, direction: 'up' | 'down' | 'stable' }) => (
  <motion.div 
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex flex-col items-center gap-2 cursor-default"
  >
    <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">{label}</span>
    <div className="flex flex-col items-center bg-white/50 px-3 py-2 rounded-xl shadow-sm border border-white/80 min-w-[80px] backdrop-blur-sm">
      <span className="text-sm font-bold text-gray-700">{value}</span>
      <div className="flex items-center mt-1">
        {direction === 'up' && <ArrowUp className="w-3 h-3 text-emerald-500" />}
        {direction === 'down' && <ArrowDown className="w-3 h-3 text-[#C8D8E4]" />}
        {direction === 'stable' && <div className="w-2 h-0.5 bg-gray-300 rounded-full" />}
      </div>
    </div>
  </motion.div>
);

const RippleBreathing = ({ phase, count }: { phase: 'inhale' | 'hold' | 'exhale', count: number }) => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Ripple Layers */}
      <AnimatePresence>
        {phase === 'inhale' && (
          <motion.div
            key="ripple"
            className="absolute inset-0 rounded-full border border-[#C8D8E4]/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C8D8E4] to-[#A8C8D8] shadow-[0_0_40px_rgba(200,216,228,0.4)]"
        animate={{
          scale: phase === 'inhale' ? [1, 1.6] : phase === 'hold' ? 1.6 : [1.6, 1],
        }}
        transition={{
          duration: phase === 'inhale' ? 4 : phase === 'hold' ? 7 : 8,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative flex flex-col items-center">
        <span className="text-4xl font-light text-white drop-shadow-sm">
          {count}
        </span>
      </div>
    </div>
  );
};

const FeedbackModal = ({ onComplete }: { onComplete: (emotion: string) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[32px] p-8 w-full max-w-[320px] shadow-2xl border border-gray-50 flex flex-col items-center"
    >
      <div className="flex w-full h-16 rounded-full overflow-hidden mb-8 shadow-inner">
        <div className="flex-1 bg-gradient-to-br from-[#F5D0C0] to-[#FAE0D0]" />
        <div className="flex-1 bg-gradient-to-br from-[#C8D8E4] to-[#D8E4EE]" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">舒缓已完成</h3>
      <p className="text-sm text-gray-400 text-center mb-10 leading-relaxed">
        微澜发现，你的心率变异性提升了 12%，<br/>现在的你就像雨后的森林。
      </p>

      <div className="flex gap-6">
        {[
          { icon: <Sun className="w-6 h-6" />, label: '☀️', id: 'happy' },
          { icon: <CloudRain className="w-6 h-6" />, label: '🌧️', id: 'sad' },
          { icon: <Star className="w-6 h-6" />, label: '⭐', id: 'star' }
        ].map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onComplete(item.id)}
            className="w-14 h-14 rounded-full bg-[#FAF8F5] flex items-center justify-center text-2xl shadow-sm border border-gray-100"
          >
            {item.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// --- Main Pages ---

interface TodayPageProps {
  onStartIntervention: () => void;
}

const TodayPage: React.FC<TodayPageProps> = ({ onStartIntervention }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const ringY = useTransform(scrollY, [0, 300], [0, -40]);
  const metricsY = useTransform(scrollY, [0, 300], [0, -20]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide pb-24 snap-y snap-proximity scroll-smooth">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center px-8 pt-6 min-h-full snap-start"
      >
        <header className="w-full flex justify-between items-center mb-10 sticky top-0 py-2 bg-[#FAF8F5]/80 backdrop-blur-md z-10 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8DDD0] flex items-center justify-center shadow-inner">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-400">微澜 Lumina</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex items-center gap-1 text-[#B8A898]"
            >
              <Battery className="w-4 h-4" />
              <span className="text-[10px] font-bold">18%</span>
            </motion.div>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center w-full py-8">
          <motion.div
            style={{ y: ringY }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#E8DDD0]/15 blur-3xl rounded-full -z-10" />
            <StatusRing status="stress-medium" />
          </motion.div>

          <motion.div 
            style={{ y: metricsY }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.4 }
              }
            }}
            className="grid grid-cols-3 w-full max-w-xs mt-16 gap-4"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <MetricItem label="SDNN" value="42ms" direction="up" />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <MetricItem label="LF/HF" value="1.2" direction="down" />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <MetricItem label="STRESS" value="68" direction="down" />
            </motion.div>
          </motion.div>
        </div>

        <div className="w-full max-w-xs mt-12 pb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="mb-8 p-5 bg-gradient-to-r from-[#F5D0C0]/40 to-[#FAE0D0]/40 rounded-[28px] border border-[#F5D0C0]/60 flex items-start gap-3 relative overflow-hidden group shadow-sm backdrop-blur-sm"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-0.5"
            >
              <AlertCircle className="w-4 h-4 text-[#B8A898]" />
            </motion.div>
            <div className="flex-1">
              <p className="text-[11px] text-gray-600 leading-relaxed text-left font-medium">
                检测到连续高压状态，微澜建议现在进行一次 5 分钟的节律舒缓。
              </p>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl font-sans" />
          </motion.div>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onClick={onStartIntervention}
            whileHover={{ scale: 1.02, backgroundColor: '#f0e6da' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 bg-[#E8DDD0] text-gray-700 font-semibold rounded-[24px] shadow-lg shadow-[#E8DDD0]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            开始舒缓
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* New Insight Section to justify scrolling & add texture */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-xs mt-12 mb-12 p-6 bg-white rounded-[32px] border border-gray-50 shadow-sm snap-start"
        >
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-[#B8A898]" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">今日微澜洞察</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p className="text-[11px] text-gray-500 leading-relaxed">相比昨天同一时段，你的自律神经平衡度提升了 8.2%。</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8D8E4] mt-1.5 shrink-0" />
              <p className="text-[11px] text-gray-500 leading-relaxed">建议在下午三点前增加一次深呼吸训练，以维持早间的活力。</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const InterventionFlow = ({ onExit }: { onExit: () => void }) => {
  const [node, setNode] = useState(1);
  const [messages, setMessages] = useState<{ role: 'agent', content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(1);
  const [cycle, setCycle] = useState(0);

  const flow = [
    { id: 1, text: "你好。我感觉到你现在的呼吸频率有些急促，就像被风吹乱的湖面。" },
    { id: 2, text: "请保持安静坐姿，我们将进行5秒的状态深度采集，请闭上眼睛。" },
    { id: 4, text: "采集完成了。你的迷走神经张力处于低位。我为你准备了'4-7-8'节律呼吸方案，这能帮助你的身体重新找回平衡。" },
    { id: 5, text: "准备好了吗？我们开始吧。" }
  ];

  useEffect(() => {
    const current = flow.find(f => f.id === node);
    if (current) {
      setIsTyping(true);
      setMessages(prev => [...prev, { role: 'agent', content: current.text }]);
    }
  }, [node]);

  useEffect(() => {
    if (node === 5 && !isTyping) {
      let isMounted = true;
      const runBreathing = async () => {
        for (let c = 0; c < 4; c++) {
          if (!isMounted) return;
          setCycle(c);
          
          setPhase('inhale');
          for (let i = 1; i <= 4; i++) {
            if (!isMounted) return;
            setCount(i);
            await new Promise(r => setTimeout(r, 1000));
          }
          
          setPhase('hold');
          for (let i = 1; i <= 7; i++) {
            if (!isMounted) return;
            setCount(i);
            await new Promise(r => setTimeout(r, 1000));
          }
          
          setPhase('exhale');
          for (let i = 1; i <= 8; i++) {
            if (!isMounted) return;
            setCount(i);
            await new Promise(r => setTimeout(r, 1000));
          }
        }
        if (isMounted) setShowFeedback(true);
      };
      runBreathing();
      return () => { isMounted = false; };
    }
  }, [node, isTyping]);

  const dragY = useMotionValue(0);
  const pullOpacity = useTransform(dragY, [0, 150], [0.3, 1]);
  const pullScale = useTransform(dragY, [0, 150], [1, 1.2]);

  return (
    <motion.div 
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (info.offset.y > 150) {
          onExit();
        }
      }}
      style={{ y: dragY }}
      className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col overflow-hidden shadow-2xl"
    >
      {/* Pull Indicator Handle */}
      <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
        <motion.div 
          style={{ opacity: pullOpacity }}
          className="w-12 h-1.5 bg-gray-200 rounded-full" 
        />
      </div>

      {/* Edge Glow */}
      <motion.div 
        className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(232,221,208,0.2)]"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <header className="px-8 pt-12 pb-6 flex justify-between items-center">
        <button onClick={onExit} className="text-gray-300 hover:text-gray-500 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#E8DDD0]" />
          <span className="text-xs font-medium text-gray-400">微流介入中</span>
        </div>
      </header>

      <div className="flex-1 px-8 overflow-y-auto pb-32">
        <div className="space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start max-w-[90%]"
            >
              <div className="bg-white rounded-[24px] rounded-tl-none p-5 shadow-sm border border-gray-100">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {idx === messages.length - 1 ? (
                    <TypewriterText 
                      text={msg.content} 
                      onComplete={() => {
                        setIsTyping(false);
                        if (node === 2) setTimeout(() => setNode(4), 5000);
                      } } 
                    />
                  ) : (
                    msg.content
                  )}
                </p>
              </div>
            </motion.div>
          ))}

          {node === 2 && !isTyping && (
            <div className="flex flex-col items-center py-12">
              <motion.div 
                className="w-16 h-16 rounded-full border-2 border-[#C8D8E4] border-t-transparent animate-spin"
              />
              <p className="mt-4 text-xs text-gray-400 font-medium tracking-widest uppercase">深度采集中</p>
            </div>
          )}

          {node === 4 && !isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center pt-8"
            >
              <button 
                onClick={() => setNode(5)}
                className="py-4 px-12 bg-[#C8D8E4] text-gray-700 font-semibold rounded-2xl shadow-md active:scale-95 transition-all"
              >
                好的
              </button>
            </motion.div>
          )}

          {node === 5 && !isTyping && !showFeedback && (
            <div className="flex flex-col items-center py-10">
              <RippleBreathing phase={phase} count={count} />
              <div className="mt-12 text-center">
                <p className="text-lg text-gray-600 font-medium">
                  {phase === 'inhale' ? '吸气' : phase === 'hold' ? '保持' : '呼气'}
                </p>
                <p className="text-xs text-gray-400 mt-2">第 {cycle + 1} / 4 组</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center p-8"
          >
            <FeedbackModal onComplete={onExit} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        style={{ y: useTransform(dragY, [0, 150], [0, 20]), opacity: useTransform(dragY, [0, 50], [1, 0]) }}
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
      >
        <motion.div
           animate={{ y: [0, 5, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-4 h-4 text-gray-200" />
        </motion.div>
        <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em] font-bold">下拉以提前结束</p>
      </motion.div>
    </motion.div>
  );
};

const TrendPage: React.FC<{ onNavigateToLog: () => void }> = ({ onNavigateToLog }) => {
  const [selectedPoint, setSelectedPoint] = useState<HRVDataPoint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');

  const data: HRVDataPoint[] = [
    { date: '04-01', score: 65 },
    { date: '04-02', score: 72 },
    { 
      date: '04-03', 
      time: '14:20',
      score: 58, 
      hasIntervention: true, 
      summary: "那天你有些焦虑，微流介入结合呼引导提升了迷走神经张力。干预后，你的副交感神经活性明显增强，心率平稳度提升了 18%。", 
      scoreChange: "58 → 72",
      duration: "15 min",
      mode: "taVNS 深度调控",
      params: { freq: "25Hz", width: "200μs", intensity: "Level 4" },
      feedback: "☀️"
    },
    { date: '04-04', score: 78 },
    { 
      date: '04-05', 
      time: '22:15',
      score: 52, 
      hasIntervention: true, 
      summary: "深夜的呼吸训练帮你找回了深度睡眠的节奏。通过 VNS 刺激，你的入睡潜伏期缩短，睡眠质量评分从 45 提升至 78。", 
      scoreChange: "52 → 68",
      duration: "20 min",
      mode: "助眠节律引导",
      params: { freq: "10Hz", width: "150μs", intensity: "Level 2" },
      feedback: "⭐"
    },
    { date: '04-06', score: 82 },
    { date: '04-07', score: 75 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 pt-12 pb-24 h-full overflow-y-auto"
    >
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">我的变化</h1>
          <p className="text-xs text-gray-400 mt-1">自律神经活力洞察</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-full">
          <button 
            onClick={() => setPeriod('7d')}
            className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold transition-all", period === '7d' ? "bg-white text-gray-700 shadow-sm" : "text-gray-400")}
          >
            7天
          </button>
          <button 
            onClick={() => setPeriod('30d')}
            className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold transition-all", period === '30d' ? "bg-white text-gray-700 shadow-sm" : "text-gray-400")}
          >
            30天
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 h-72 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#ccc' }} 
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#ccc' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
            />
            <ReferenceArea y1={50} y2={80} {...({ fill: "#E8F5E9", fillOpacity: 0.4, stroke: "none" } as any)} />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#C8D8E4" 
              strokeWidth={3} 
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.hasIntervention) {
                  return (
                    <g key={payload.date} onClick={() => setSelectedPoint(payload)} className="cursor-pointer">
                      <circle cx={cx} cy={cy} r={8} fill="#E8DDD0" />
                      <foreignObject x={cx - 10} y={cy - 10} width={20} height={20}>
                        <div className="flex items-center justify-center w-full h-full">
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                      </foreignObject>
                    </g>
                  );
                }
                return <Dot {...props} r={4} fill="#C8D8E4" stroke="none" />;
              }}
              activeDot={{ r: 6, fill: '#C8D8E4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <AnimatePresence mode="wait">
        {selectedPoint ? (
          <motion.div 
            key={selectedPoint.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => setIsDetailOpen(true)}
            className="bg-[#E8DDD0]/20 rounded-[24px] p-6 border border-[#E8DDD0]/40 cursor-pointer active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#B8A898]" />
                <span className="text-xs font-bold text-gray-700 tracking-wider">{selectedPoint.date} 调控档案</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B8A898] group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
              {selectedPoint.summary}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8DDD0]/30">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">活力评分变化</span>
                <span className="text-sm font-mono font-bold text-emerald-600">{selectedPoint.scoreChange}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">干预时长</span>
                <span className="text-sm font-medium text-gray-700">{selectedPoint.duration}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ y: -4 }}
            onClick={onNavigateToLog}
            className="bg-white rounded-[32px] p-8 border border-gray-100 flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center mb-4 group-hover:bg-[#E8DDD0]/20 transition-colors">
              <ClipboardList className="w-8 h-8 text-[#B8A898]" />
            </div>
            <h4 className="text-sm font-bold text-gray-700 mb-2">调控历史档案</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed max-w-[200px]">
              点击查看完整时空日志，回溯每一次微澜介入的深度调控详情
            </p>
            <div className="mt-6 flex items-center gap-1 text-[10px] font-bold text-[#B8A898] uppercase tracking-widest">
              立即进入
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDetailOpen && selectedPoint && (
          <RegulationDetailOverlay 
            data={selectedPoint} 
            onBack={() => setIsDetailOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className="mt-10">
        <h3 className="text-sm font-bold text-gray-800 mb-6 tracking-wider">精力流向洞察</h3>
        <div className="relative h-40 w-full bg-white rounded-[24px] p-6 border border-gray-50 flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C8D8E4]" />
              <span className="text-[10px] text-gray-400 font-bold">微流介入</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E8DDD0]" />
              <span className="text-[10px] text-gray-400 font-bold">节律引导</span>
            </div>
          </div>
          
          <div className="flex-1 mx-8 relative h-full">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <path d="M 0 20 Q 50 20 100 40" stroke="#C8D8E4" strokeWidth="12" fill="none" opacity="0.3" />
              <path d="M 0 60 Q 50 60 100 40" stroke="#E8DDD0" strokeWidth="8" fill="none" opacity="0.3" />
            </svg>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-bold">压力缓解</span>
            <span className="text-xl font-light text-gray-700">82%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RegulationDetailOverlay = ({ data, onBack }: { data: HRVDataPoint, onBack: () => void }) => {
  const dragY = useMotionValue(0);
  const pullOpacity = useTransform(dragY, [0, 150], [0.3, 1]);

  return (
    <motion.div 
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (info.offset.y > 150) {
          onBack();
        }
      }}
      style={{ y: dragY }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[70] bg-[#FAF8F5] flex flex-col shadow-2xl"
    >
      <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
        <motion.div 
          style={{ opacity: pullOpacity }}
          className="w-12 h-1.5 bg-gray-200 rounded-full" 
        />
      </div>
      <header className="px-8 pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">调控详情报告</h1>
        </div>
        <div className="px-3 py-1 bg-[#E8DDD0]/30 rounded-full">
          <span className="text-[10px] font-bold text-[#B8A898] uppercase tracking-widest">{data.date}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-8">
        {/* Summary Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#E8DDD0] flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">{data.mode}</h3>
              <p className="text-[10px] text-gray-400">{data.time} 开始 · 持续 {data.duration}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed italic">
            "{data.summary}"
          </p>
        </div>

        {/* Physiological Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[24px] border border-gray-50 shadow-sm">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">活力评分提升</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-gray-800">{data.scoreChange?.split(' → ')[1]}</span>
              <span className="text-[10px] text-emerald-500 font-bold">+{Number(data.scoreChange?.split(' → ')[1]) - Number(data.scoreChange?.split(' → ')[0])}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-gray-50 shadow-sm">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">主观情绪反馈</span>
            <span className="text-2xl">{data.feedback}</span>
          </div>
        </div>

        {/* Technical Parameters */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">taVNS 刺激参数</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-300 font-medium">频率</span>
              <span className="text-sm font-bold text-gray-700">{data.params?.freq}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-300 font-medium">脉宽</span>
              <span className="text-sm font-bold text-gray-700">{data.params?.width}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-300 font-medium">强度</span>
              <span className="text-sm font-bold text-gray-700">{data.params?.intensity}</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8D8E4]" />
              <span className="text-[10px] text-gray-400 font-bold">迷走神经激活波形 (模拟)</span>
            </div>
            <div className="h-12 flex items-end gap-1 px-2">
              {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [10, 30, 15, 40, 20][i % 5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  className="flex-1 bg-[#C8D8E4]/30 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Agent Insight */}
        <div className="bg-[#E8DDD0]/10 rounded-[32px] p-8 border border-[#E8DDD0]/20">
          <div className="flex items-center gap-2 mb-4">
            <Waves className="w-4 h-4 text-[#B8A898]" />
            <span className="text-xs font-bold text-[#B8A898]">微澜 Lumina 的深度分析</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            通过本次 {data.mode}，我们观察到你的 SDNN 指数在干预中段出现了明显的“阶梯式”上升，这表明你的自主神经系统对特定频率的微电流介入非常敏感。建议在下次感到类似紧绷感时，尝试将强度提升至 Level 5。
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const HubPage: React.FC<{ onNavigateToLog: () => void }> = ({ onNavigateToLog }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 pt-12 pb-24 h-full overflow-y-auto"
    >
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-800">智联中心</h1>
        <p className="text-xs text-gray-400 mt-1">设备管理与偏好设定</p>
      </header>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 mb-8 flex flex-col items-center">
        <div className="relative w-40 h-40 mb-6">
          <div className="absolute inset-0 rounded-full border border-dashed border-gray-100 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full bg-[#FAF8F5] flex items-center justify-center">
            <Bluetooth className="w-12 h-12 text-[#C8D8E4]" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">颈舒 VNS-1</h3>
        <p className="text-xs text-emerald-500 font-bold mt-1 tracking-widest uppercase">已连接</p>
        
        <div className="w-full mt-10 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-medium">电极贴片寿命</span>
            <span className="text-xs font-mono font-bold text-gray-700">85%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              className="h-full bg-[#C8D8E4]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <HubItem label="微澜语音风格" value="温柔治愈" />
        <HubItem label="主动关心频率" value="适中" />
        <HubItem label="微流强度上限" value="Level 4" />
        <HubItem label="查看完整时空日志" value="" isLink onClick={onNavigateToLog} />
      </div>
    </motion.div>
  );
};

const LogPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const dragY = useMotionValue(0);
  const pullOpacity = useTransform(dragY, [0, 150], [0.3, 1]);
  
  const logs = [
    { id: 1, time: '今天 14:20', mode: 'taVNS 深度调控', emotion: '☀️', summary: '干预后心率平稳度提升 15%，压力指数下降。', color: 'bg-[#C8D8E4]' },
    { id: 2, time: '昨天 22:15', mode: '助眠节律引导', emotion: '⭐', summary: '成功引导进入深度睡眠状态，SDNN 显著提升。', color: 'bg-[#E8DDD0]' },
    { id: 3, time: '04-05 09:30', mode: '晨间唤醒介入', emotion: '☀️', summary: '激活交感神经活性，提升晨间精力值。', color: 'bg-[#D0E8E0]' },
    { id: 4, time: '04-04 18:45', mode: 'taVNS 快速舒缓', emotion: '🌧️', summary: '工作高压后的即时干预，缓解了明显的紧绷感。', color: 'bg-[#F5D0C0]' },
  ];

  return (
    <motion.div 
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (info.offset.y > 150) {
          onBack();
        }
      }}
      style={{ y: dragY }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-[60] bg-[#FAF8F5] flex flex-col shadow-2xl"
    >
      <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
        <motion.div 
          style={{ opacity: pullOpacity }}
          className="w-12 h-1.5 bg-gray-200 rounded-full" 
        />
      </div>
      <header className="px-8 pt-12 pb-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">时空日志</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-8 border-l border-gray-100 pb-2">
            <div className={cn("absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full", log.color)} />
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{log.time}</span>
                <span className="text-lg">{log.emotion}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-700 mb-2">{log.mode}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{log.summary}</p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Waves className="w-2.5 h-2.5 text-gray-400" />
                </div>
                <span className="text-[10px] text-gray-400">微澜已留痕</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ChatPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'chat' | 'data' | 'guide' | 'strategy'>('chat');
  const [messages, setMessages] = useState([
    { role: 'agent', content: '你好，我是微澜。今天感觉怎么样？我们可以聊聊你的心情，或者查看你的健康建议。' }
  ]);

  const sections = [
    { id: 'chat', label: '对话', icon: <Waves className="w-4 h-4" /> },
    { id: 'data', label: '私密数据', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'guide', label: '干预建议', icon: <Flower2 className="w-4 h-4" /> },
    { id: 'strategy', label: 'taVNS策略', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-[#FAF8F5]"
    >
      <header className="px-8 pt-12 pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">微澜 Lumina</h1>
        <div className="flex gap-4 mt-6 border-b border-gray-100">
          {sections.map((s) => (
            <button 
              key={s.id}
              onClick={() => setActiveSection(s.id as any)}
              className={cn(
                "pb-3 text-xs font-bold tracking-wider transition-all relative",
                activeSection === s.id ? "text-[#B8A898]" : "text-gray-300"
              )}
            >
              <div className="flex items-center gap-1.5">
                {s.icon}
                {s.label}
              </div>
              {activeSection === s.id && (
                <motion.div layoutId="chat-nav" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B8A898]" />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <AnimatePresence mode="wait">
          {activeSection === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === 'agent' ? "justify-start" : "justify-end")}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    m.role === 'agent' ? "bg-white text-gray-700 rounded-tl-none border border-gray-50" : "bg-[#E8DDD0] text-gray-700 rounded-tr-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === 'data' && (
            <motion.div 
              key="data"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm">
                <h4 className="text-sm font-bold text-gray-700 mb-4">个人健康画像</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">平均 HRV 基线</span>
                    <span className="text-sm font-mono font-bold text-gray-700">45 ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">压力耐受度</span>
                    <span className="text-sm font-bold text-emerald-500">良好</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">敏感调控模式</span>
                    <span className="text-sm font-bold text-gray-700">taVNS 深度模式</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-300 text-center px-6">
                所有数据均经过端到端加密，仅存储于您的本地设备中。
              </p>
            </motion.div>
          )}

          {activeSection === 'guide' && (
            <motion.div 
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm">
                <h4 className="text-sm font-bold text-gray-700 mb-3">轻中度抑郁障碍干预建议</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  基于您的近期 HRV 趋势，微澜建议：<br/><br/>
                  1. **规律性 taVNS 刺激**：每日早晚各进行一次 15 分钟的深度调控，有助于稳定自律神经系统。<br/><br/>
                  2. **认知重构对话**：当感到情绪低落时，尝试与我进行文字交流，我会引导您进行正向思考。<br/><br/>
                  3. **光照与运动**：建议每日进行 20 分钟户外散步，配合颈环的节律引导。
                </p>
              </div>
            </motion.div>
          )}

          {activeSection === 'strategy' && (
            <motion.div 
              key="strategy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm">
                <h4 className="text-sm font-bold text-gray-700 mb-3">taVNS 电刺激策略</h4>
                <div className="space-y-6">
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl">
                    <h5 className="text-xs font-bold text-gray-700 mb-2">深度迷走神经刺激 (Deep VNS)</h5>
                    <p className="text-[10px] text-gray-400 leading-relaxed">频率: 25Hz | 脉宽: 200μs<br/>适用于显著情绪低落或焦虑状态，通过高频微电流激活耳甲艇迷走神经分支。</p>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl">
                    <h5 className="text-xs font-bold text-gray-700 mb-2">节律性微电流调控 (Rhythmic VNS)</h5>
                    <p className="text-[10px] text-gray-400 leading-relaxed">频率: 10Hz | 脉宽: 150μs<br/>配合呼吸节律进行同步刺激，旨在建立长期的自律神经平衡。</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activeSection === 'chat' && (
        <div className="px-8 pb-10">
          <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-lg border border-gray-50">
            <button className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-gray-400">
              <Waves className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder="与微澜聊聊..." 
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 px-2"
            />
            <button className="w-10 h-10 rounded-full bg-[#E8DDD0] flex items-center justify-center text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const HubItem = ({ label, value, isLink = false, onClick }: { label: string, value: string, isLink?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[20px] p-5 flex justify-between items-center border border-gray-50 shadow-sm active:scale-[0.98] transition-all"
  >
    <span className="text-sm text-gray-700 font-medium">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">{value}</span>
      {isLink && <ChevronRight className="w-4 h-4 text-gray-300" />}
    </div>
  </button>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [subPage, setSubPage] = useState<SubPage>('main');
  const [isIntervening, setIsIntervening] = useState(false);

  return (
    <div className="max-w-md mx-auto h-screen bg-[#FAF8F5] relative overflow-hidden flex flex-col shadow-2xl">
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && <TodayPage key="today" onStartIntervention={() => setIsIntervening(true)} />}
          {activeTab === 'chat' && <ChatPage key="chat" />}
          {activeTab === 'trend' && <TrendPage key="trend" onNavigateToLog={() => setSubPage('log')} />}
          {activeTab === 'hub' && <HubPage key="hub" onNavigateToLog={() => setSubPage('log')} />}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isIntervening && (
          <InterventionFlow onExit={() => setIsIntervening(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {subPage === 'log' && (
          <LogPage onBack={() => setSubPage('main')} />
        )}
      </AnimatePresence>

      {!isIntervening && (
        <nav className="h-24 bg-white/80 backdrop-blur-md border-t border-gray-50 flex items-center justify-around px-6 pb-4">
          <NavButton 
            active={activeTab === 'today'} 
            onClick={() => { setActiveTab('today'); setSubPage('main'); }} 
            icon={<Home className="w-6 h-6" />} 
            label="今日" 
          />
          <NavButton 
            active={activeTab === 'chat'} 
            onClick={() => { setActiveTab('chat'); setSubPage('main'); }} 
            icon={<Waves className="w-6 h-6" />} 
            label="微澜" 
          />
          <NavButton 
            active={activeTab === 'trend'} 
            onClick={() => { setActiveTab('trend'); setSubPage('main'); }} 
            icon={<TrendingUp className="w-6 h-6" />} 
            label="洞察" 
          />
          <NavButton 
            active={activeTab === 'hub'} 
            onClick={() => { setActiveTab('hub'); setSubPage('main'); }} 
            icon={<Settings className="w-6 h-6" />} 
            label="智联" 
          />
        </nav>
      )}
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <motion.button 
    onClick={onClick}
    whileTap={{ scale: 0.9 }}
    className={cn(
      "flex flex-col items-center gap-1.5 transition-all relative px-2 py-1 rounded-xl",
      active ? "text-[#B8A898]" : "text-gray-300"
    )}
  >
    <div className={cn("transition-all duration-300", active && "scale-110")}>
      {icon}
    </div>
    <span className="text-[10px] font-bold tracking-wider">{label}</span>
    {active && (
      <motion.div 
        layoutId="nav-indicator"
        className="absolute -bottom-2 w-1 h-1 rounded-full bg-[#B8A898]"
      />
    )}
  </motion.button>
);
