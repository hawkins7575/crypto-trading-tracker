import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X, Brain } from 'lucide-react';

const TradingJournal = ({ journals, onSaveJournal, onDeleteJournal, currentMonth, setCurrentMonth }) => {
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentJournal, setCurrentJournal] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: ''
  });
  const [editingJournal, setEditingJournal] = useState(null);

  // 달력 생성
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    let week = [];
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      if (currentDate > lastDay && week.length > 0 && week.length % 7 === 0) {
        break;
      }
      
      week.push(currentDate);
      
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    
    if (week.length > 0) {
      calendar.push(week);
    }
    
    return calendar;
  };

  // 날짜별 일지 가져오기
  const getJournalByDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return journals.find(journal => journal.date === dateStr);
  };

  // 날짜 클릭 처리
  const handleDateClick = (date) => {
    const journal = getJournalByDate(date);
    setSelectedDate(date);
    
    if (journal) {
      setCurrentJournal({
        title: journal.title,
        content: journal.content,
        mood: journal.mood,
        tags: journal.tags
      });
      setEditingJournal(journal);
    } else {
      setCurrentJournal({
        title: '',
        content: '',
        mood: 'neutral',
        tags: ''
      });
      setEditingJournal(null);
    }
    
    setShowJournalModal(true);
  };

  // 일지 저장
  const handleSaveJournal = () => {
    if (!selectedDate) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const journalData = {
      id: editingJournal ? editingJournal.id : Date.now(),
      date: dateStr,
      title: currentJournal.title || `${selectedDate.getMonth() + 1}/${selectedDate.getDate()} 매매일지`,
      content: currentJournal.content,
      mood: currentJournal.mood,
      tags: currentJournal.tags,
      createdAt: editingJournal ? editingJournal.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSaveJournal(journalData);
    setShowJournalModal(false);
    setCurrentJournal({ title: '', content: '', mood: 'neutral', tags: '' });
    setSelectedDate(null);
    setEditingJournal(null);
  };

  // 일지 삭제
  const handleDeleteJournal = () => {
    if (editingJournal && window.confirm('이 매매일지를 삭제하시겠습니까?')) {
      onDeleteJournal(editingJournal.id);
      setShowJournalModal(false);
      setCurrentJournal({ title: '', content: '', mood: 'neutral', tags: '' });
      setSelectedDate(null);
      setEditingJournal(null);
    }
  };

  // 월 변경
  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // 감정 이모지
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      very_good: '',
      good: '',
      neutral: '',
      bad: '',
      very_bad: ''
    };
    return moodEmojis[mood] || '';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">매매일지</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-lg font-semibold text-white min-w-40 text-center font-mono">
            {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="p-3 text-center font-semibold text-slate-500 bg-slate-700 rounded-lg text-sm tracking-wider">
            {day}
          </div>
        ))}
      </div>
      
      {/* 달력 */}
      <div className="grid grid-cols-7 gap-2">
        {generateCalendar().flat().map((date, index) => {
          const journal = getJournalByDate(date);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const hasJournal = !!journal;
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`p-3 min-h-20 border rounded-lg cursor-pointer hover:bg-slate-700 transition-all relative ${
                isCurrentMonth ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-700'
              } ${isToday ? 'ring-2 ring-blue-500' : ''} ${
                hasJournal ? 'bg-emerald-900/30 border-emerald-500' : ''
              }`}
            >
              <div className={`text-sm font-medium ${
                isCurrentMonth ? 'text-white' : 'text-slate-600'
              } ${isToday ? 'text-blue-400 font-bold' : ''}`}>
                {date.getDate()}
              </div>
              
              {hasJournal && (
                <div className="mt-1">
                  <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    {getMoodEmoji(journal.mood)}
                    <span className="truncate">{journal.title}</span>
                  </div>
                  {journal.tags && (
                    <div className="text-xs text-slate-400 truncate mt-1">
                      #{journal.tags.split(',')[0]}
                    </div>
                  )}
                </div>
              )}
              
              {isToday && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* 매매일지 작성/수정 모달 */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {selectedDate?.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {editingJournal && <span className="text-slate-400 text-base ml-2">(수정 모드)</span>}
              </h3>
              <button
                onClick={() => setShowJournalModal(false)}
                className="text-slate-400 hover:text-white p-2"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* 제목 */}
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">일지 제목</label>
              <input
                type="text"
                value={currentJournal.title}
                onChange={(e) => setCurrentJournal({...currentJournal, title: e.target.value})}
                placeholder="일지 제목을 입력하세요"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 감정/기분 */}
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-3 uppercase tracking-wider">오늘의 성과</label>
              <div className="grid grid-cols-5 gap-3">
                {[{
                  value: 'very_good', label: '대성공', emoji: '' 
                },
                {
                  value: 'good', label: '성공', emoji: '' 
                },
                {
                  value: 'neutral', label: '보통', emoji: '' 
                },
                {
                  value: 'bad', label: '아쉬움', emoji: '' 
                },
                {
                  value: 'very_bad', label: '실패', emoji: '' 
                }].map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setCurrentJournal({...currentJournal, mood: mood.value})}
                    className={`p-3 rounded-lg border text-sm flex flex-col items-center gap-2 transition-all ${
                      currentJournal.mood === mood.value 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 태그 */}
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">태그</label>
              <input
                type="text"
                value={currentJournal.tags}
                onChange={(e) => setCurrentJournal({...currentJournal, tags: e.target.value})}
                placeholder="비트코인, 매수, 강세장, 기술분석 (쉼표로 구분)"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 내용 */}
            <div className="mb-8">
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">일지 내용</label>
              <textarea
                value={currentJournal.content}
                onChange={(e) => setCurrentJournal({...currentJournal, content: e.target.value})}
                placeholder="오늘의 시장 분석, 매매 결정, 배운 점 및 소감을 자유롭게 작성하세요..."
                className="w-full h-40 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveJournal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
              >
                {editingJournal ? '일지 수정' : '일지 저장'}
              </button>
              {editingJournal && (
                <button
                  onClick={handleDeleteJournal}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  삭제
                </button>
              )}
              <button
                onClick={() => {
                  setShowJournalModal(false);
                  setCurrentJournal({ title: '', content: '', mood: 'neutral', tags: '' });
                  setSelectedDate(null);
                  setEditingJournal(null);
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingJournal;
