import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../context/AppContext';
import { Trade } from '../types';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('AppContext', () => {
  const mockTrade: Trade = {
    id: 1,
    date: '2024-01-01',
    entry: 1000000,
    withdrawal: 0,
    balance: 1100000,
    profit: 100000,
    profitRate: 10,
    memo: 'Test trade'
  };

  it('should provide initial state', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.state.trades).toEqual([]);
    expect(result.current.state.activeTab).toBe('dashboard');
    expect(result.current.state.showForm).toBe(false);
  });

  it('should add trade correctly', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'ADD_TRADE', payload: mockTrade });
    });

    expect(result.current.state.trades).toHaveLength(1);
    expect(result.current.state.trades[0]).toEqual(mockTrade);
  });

  it('should update trade correctly', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'ADD_TRADE', payload: mockTrade });
    });

    const updatedTrade = { ...mockTrade, profit: 150000 };

    act(() => {
      result.current.dispatch({ type: 'UPDATE_TRADE', payload: updatedTrade });
    });

    expect(result.current.state.trades[0].profit).toBe(150000);
  });

  it('should delete trade correctly', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'ADD_TRADE', payload: mockTrade });
    });

    expect(result.current.state.trades).toHaveLength(1);

    act(() => {
      result.current.dispatch({ type: 'DELETE_TRADE', payload: mockTrade.id });
    });

    expect(result.current.state.trades).toHaveLength(0);
  });

  it('should set active tab correctly', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'SET_ACTIVE_TAB', payload: 'trades' });
    });

    expect(result.current.state.activeTab).toBe('trades');
  });

  it('should toggle form visibility', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'SET_SHOW_FORM', payload: true });
    });

    expect(result.current.state.showForm).toBe(true);
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAppContext());
    }).toThrow('useAppContext must be used within an AppProvider');
  });
});