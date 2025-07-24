import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FileText, Plus, Edit, Trash2, Save, X, Smile, Meh, Frown, Zap, Heart } from 'lucide-react';

const PERFORMANCE_EMOJIS = [
  { level: 1, emoji: '😭', description: '최악' },
  { level: 2, emoji: '🙁', description: '나쁨' },
  { level: 3, emoji: '😐', description: '보통' },
  { level: 4, emoji: '😊', description: '좋음' },
  { level: 5, emoji: '🤩', description: '최고' },
];

const JournalEntryForm = ({
  selectedJournalDate,
  currentJournalEntry,
  editorContent,
  setEditorContent,
  selectedEmoji,
  setSelectedEmoji,
  handleSave,
  handleDelete,
}) => {
  return (
    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">일지 작성/수정</h2>
      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-medium mb-2">선택된 날짜</label>
        <input
          type="text"
          value={selectedJournalDate || '날짜를 선택하세요'}
          readOnly
          className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white font-mono"
        />
      </div>
      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-medium mb-2">오늘의 성과</label>
        <div className="flex gap-2 mb-4">
          {PERFORMANCE_EMOJIS.map((item) => (
            <button
              key={item.level}
              onClick={() => setSelectedEmoji(item.emoji)}
              className={`text-3xl p-2 rounded-lg transition-all duration-200 ${
                selectedEmoji === item.emoji ? 'bg-blue-500/30 ring-2 ring-blue-500' : 'hover:bg-slate-700/50'
              }`}
              title={item.description}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-medium mb-2">내용</label>
        <textarea
          className="w-full h-64 bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white resize-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={editorContent}
          onChange={(e) => setEditorContent(e.target.value)}
          placeholder="오늘의 매매에 대한 기록을 남겨보세요..."
        ></textarea>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} /> 저장
        </button>
        {currentJournalEntry && (
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> 삭제
          </button>
        )}
      </div>
    </div>
  );
};

const JournalEntryDisplay = ({ currentJournalEntry, selectedJournalDate, dispatch, ACTIONS }) => {
  const handleEditClick = () => {
    dispatch({ type: ACTIONS.SET_CURRENT_JOURNAL_ENTRY, payload: { ...currentJournalEntry } });
  };

  const handleDeleteClick = () => {
    if (currentJournalEntry && window.confirm('이 매매일지를 삭제하시겠습니까?')) {
      dispatch({ type: ACTIONS.DELETE_JOURNAL_ENTRY, payload: currentJournalEntry.id });
      dispatch({ type: ACTIONS.SET_CURRENT_JOURNAL_ENTRY, payload: null });
    }
  };

  return (
    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">매매일지 - {selectedJournalDate}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg"
            title="수정"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
            title="삭제"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-medium mb-2">오늘의 성과</label>
        <p className="text-3xl">{currentJournalEntry?.emoji || '-'}</p>
      </div>
      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-medium mb-2">내용</label>
        <div className="w-full h-64 bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white overflow-y-auto leading-relaxed">
          {currentJournalEntry?.content || '내용 없음'}
        </div>
      </div>
    </div>
  );
};

export const JournalTab = ({ journalEntries, currentJournalEntry, selectedJournalDate, dispatch, ACTIONS }) => {
  const [editorContent, setEditorContent] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  useEffect(() => {
    if (currentJournalEntry) {
      setEditorContent(currentJournalEntry.content);
      setSelectedEmoji(currentJournalEntry.emoji || null);
    } else {
      setEditorContent('');
      setSelectedEmoji(null);
    }
  }, [currentJournalEntry]);

  useEffect(() => {
    // When selectedJournalDate changes, find the corresponding entry and set it
    const entry = journalEntries.find(e => e.date === selectedJournalDate);
    dispatch({ type: ACTIONS.SET_CURRENT_JOURNAL_ENTRY, payload: entry || null });
  }, [selectedJournalDate, journalEntries, dispatch, ACTIONS]);

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    dispatch({ type: ACTIONS.SET_SELECTED_JOURNAL_DATE, payload: dateString });
  };

  const handleSave = () => {
    if (!selectedJournalDate) return;

    const newEntry = {
      id: currentJournalEntry ? currentJournalEntry.id : Date.now(),
      date: selectedJournalDate,
      content: editorContent,
      emoji: selectedEmoji,
    };

    if (currentJournalEntry) {
      dispatch({ type: ACTIONS.UPDATE_JOURNAL_ENTRY, payload: newEntry });
    } else {
      dispatch({ type: ACTIONS.ADD_JOURNAL_ENTRY, payload: newEntry });
    }
    dispatch({ type: ACTIONS.SET_CURRENT_JOURNAL_ENTRY, payload: newEntry });
  };

  const handleDelete = () => {
    if (currentJournalEntry && window.confirm('이 매매일지를 삭제하시겠습니까?')) {
      dispatch({ type: ACTIONS.DELETE_JOURNAL_ENTRY, payload: currentJournalEntry.id });
      dispatch({ type: ACTIONS.SET_CURRENT_JOURNAL_ENTRY, payload: null });
      setEditorContent('');
      setSelectedEmoji(null);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const entry = journalEntries.find(e => e.date === dateString);
      return entry && entry.emoji ? <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-lg">{entry.emoji}</div> : null;
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const hasEntry = journalEntries.some(entry => entry.date === dateString);
      return hasEntry ? 'has-entry' : null;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 h-full flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-4">매매일지 캘린더</h2>
        <div className="react-calendar-container flex-grow">
          <Calendar
            onClickDay={handleDateClick}
            value={selectedJournalDate ? new Date(selectedJournalDate) : new Date()}
            tileContent={tileContent}
            tileClassName={tileClassName}
            className="w-full h-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-white"
          />
        </div>
      </div>

      {selectedJournalDate && (
        currentJournalEntry ? (
          <JournalEntryDisplay 
            currentJournalEntry={currentJournalEntry}
            selectedJournalDate={selectedJournalDate}
            dispatch={dispatch}
            ACTIONS={ACTIONS}
          />
        ) : (
          <JournalEntryForm
            selectedJournalDate={selectedJournalDate}
            currentJournalEntry={currentJournalEntry}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            handleSave={handleSave}
            handleDelete={handleDelete}
            dispatch={dispatch}
            ACTIONS={ACTIONS}
          />
        )
      )}
    </div>
  );
};