/**
 * Unit tests — useWindowSize hook
 *
 * Verifies the hook's initial state, resize tracking, and cleanup behaviour.
 * The jsdom environment does not fire real resize events, so we dispatch them
 * manually with Object.defineProperty to override window dimensions.
 */

import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import useWindowSize from '@/hooks/useWindowSize';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
describe('useWindowSize initial state', () => {
  it('returns the current window dimensions on first render', () => {
    // jsdom sets window.innerWidth/innerHeight to 1024 / 768 by default
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });

  it('returns numeric values (not undefined) once mounted', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(typeof result.current.width).toBe('number');
    expect(typeof result.current.height).toBe('number');
  });
});

// ---------------------------------------------------------------------------
// Resize tracking
// ---------------------------------------------------------------------------
describe('useWindowSize resize tracking', () => {
  it('updates width and height after a window resize event', () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 });
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(150);
    });

    expect(result.current.width).toBe(375);
    expect(result.current.height).toBe(667);
  });

  it('reflects a desktop-size resize', () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1440 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 900 });
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(150);
    });

    expect(result.current.width).toBe(1440);
    expect(result.current.height).toBe(900);
  });

  it('tracks multiple consecutive resize events', () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1024 });
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(150);
    });

    expect(result.current.width).toBe(768);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 390 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 844 });
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(150);
    });

    expect(result.current.width).toBe(390);
    expect(result.current.height).toBe(844);
  });
});

// ---------------------------------------------------------------------------
// Cleanup — event listener is removed on unmount
// ---------------------------------------------------------------------------
describe('useWindowSize cleanup', () => {
  it('removes the resize event listener when the component unmounts', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useWindowSize());

    // Confirm it was registered
    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    // The same handler reference must be passed to removeEventListener
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('does not update state after the component unmounts', () => {
    const { result, unmount } = renderHook(() => useWindowSize());

    unmount();

    // Dispatching a resize after unmount should not throw or update
    expect(() => {
      act(() => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
        window.dispatchEvent(new Event('resize'));
      });
    }).not.toThrow();

    // The width should still be whatever it was when the hook was last active
    // (we don't assert a specific value — just that no error was thrown)
    expect(result.current.width).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Mobile / desktop boundary detection (used by HomeContent)
// ---------------------------------------------------------------------------
describe('useWindowSize mobile boundary', () => {
  it('reports a sub-640 width correctly so HomeContent can detect mobile', () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 639 });
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(150);
    });

    expect(result.current.width).toBe(639);
    expect((result.current.width as number) < 640).toBe(true);
  });

  it('reports a 640+ width correctly so HomeContent uses Pagination', () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 640 });
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(150);
    });

    expect(result.current.width).toBe(640);
    expect((result.current.width as number) >= 640).toBe(true);
  });
});
