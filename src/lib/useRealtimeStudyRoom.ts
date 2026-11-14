import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { PeerStudyUser, LiveChatMessage } from '../types';

const PEER_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-pink-500'
];

export const useRealtimeStudyRoom = (
  currentSubjectName: string,
  isTimerRunning: boolean
) => {
  const [currentUser, setCurrentUser] = useState<PeerStudyUser>(() => {
    const savedName = localStorage.getItem('STUDYHUB_STUDENT_NAME') || `Student_${Math.floor(1000 + Math.random() * 9000)}`;
    const savedId = localStorage.getItem('STUDYHUB_STUDENT_ID') || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const randomColor = PEER_COLORS[Math.floor(Math.random() * PEER_COLORS.length)];
    localStorage.setItem('STUDYHUB_STUDENT_ID', savedId);
    return {
      id: savedId,
      name: savedName,
      avatarColor: randomColor,
      currentSubject: currentSubjectName || 'General Engineering',
      status: isTimerRunning ? 'studying' : 'idle',
      isTimerRunning,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastActive: new Date().toISOString()
    };
  });

  const [peers, setPeers] = useState<PeerStudyUser[]>([]);
  const [messages, setMessages] = useState<LiveChatMessage[]>(() => {
    const saved = localStorage.getItem('STUDYHUB_LIVE_CHAT');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'msg-welcome-1',
        userId: 'system',
        userName: 'StudyHub Room',
        userAvatar: 'bg-indigo-600',
        text: 'Welcome to the Collaborative Real-time Study Lounge! Active study sessions and focus timers sync live across all connected peers.',
        subjectTag: 'System',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [syncedWithCloud, setSyncedWithCloud] = useState<boolean>(false);
  const [channelStatus, setChannelStatus] = useState<string>('connecting');
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Update current user name
  const updateStudentName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem('STUDYHUB_STUDENT_NAME', trimmed);
    setCurrentUser(prev => ({ ...prev, name: trimmed }));
  };

  // Broadcast via Web BroadcastChannel for local cross-tab real-time sync
  useEffect(() => {
    try {
      const bc = new BroadcastChannel('studyhub_live_study_channel');
      broadcastChannelRef.current = bc;

      bc.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'USER_PING') {
          // Received ping from another tab/window
          setPeers(prev => {
            const others = prev.filter(p => p.id !== payload.id);
            return [...others, payload];
          });
          // Reply with current state
          bc.postMessage({ type: 'USER_PONG', payload: currentUser });
        } else if (type === 'USER_PONG') {
          setPeers(prev => {
            const others = prev.filter(p => p.id !== payload.id);
            return [...others, payload];
          });
        } else if (type === 'CHAT_MSG') {
          setMessages(prev => {
            if (prev.some(m => m.id === payload.id)) return prev;
            const updated = [...prev, payload];
            localStorage.setItem('STUDYHUB_LIVE_CHAT', JSON.stringify(updated.slice(-100)));
            return updated;
          });
        } else if (type === 'DATA_SYNC_NOTIFY') {
          // Notify app to refresh data if needed
          window.dispatchEvent(new CustomEvent('studyhub_remote_data_updated', { detail: payload }));
        }
      };

      // Announce presence
      bc.postMessage({ type: 'USER_PING', payload: currentUser });
      setIsConnected(true);

      return () => {
        bc.close();
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }
  }, []);

  // Update presence status when timer or subject changes
  useEffect(() => {
    const updatedUser: PeerStudyUser = {
      ...currentUser,
      currentSubject: currentSubjectName || 'General Engineering',
      status: isTimerRunning ? 'studying' : 'idle',
      isTimerRunning,
      lastActive: new Date().toISOString()
    };
    setCurrentUser(updatedUser);

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'USER_PING', payload: updatedUser });
    }
  }, [currentSubjectName, isTimerRunning]);

  // Connect to Supabase Realtime Channel if configured
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setChannelStatus('local_realtime');
      setSyncedWithCloud(false);
      return;
    }

    const roomChannel = supabase.channel('studyhub_lounge_presence', {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    roomChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = roomChannel.presenceState();
        const activeRemotePeers: PeerStudyUser[] = [];
        Object.keys(presenceState).forEach(key => {
          const userArr = presenceState[key] as any;
          if (userArr && userArr.length > 0) {
            const peerData = userArr[0] as PeerStudyUser;
            if (peerData.id !== currentUser.id) {
              activeRemotePeers.push(peerData);
            }
          }
        });
        setPeers(prev => {
          // Merge remote peers with existing peers
          const map = new Map<string, PeerStudyUser>();
          activeRemotePeers.forEach(p => map.set(p.id, p));
          prev.forEach(p => { if (!map.has(p.id) && p.id !== currentUser.id) map.set(p.id, p); });
          return Array.from(map.values());
        });
        setIsConnected(true);
        setSyncedWithCloud(true);
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        setMessages(prev => {
          if (prev.some(m => m.id === payload.id)) return prev;
          const updated = [...prev, payload];
          localStorage.setItem('STUDYHUB_LIVE_CHAT', JSON.stringify(updated.slice(-100)));
          return updated;
        });
      })
      .subscribe((status) => {
        setChannelStatus(status);
        if (status === 'SUBSCRIBED') {
          roomChannel.track(currentUser);
          setSyncedWithCloud(true);
        }
      });

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [currentUser.id, isSupabaseConfigured]);

  // Send message
  const sendMessage = (text: string, subjectTag?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newMsg: LiveChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarColor,
      text: trimmed,
      subjectTag: subjectTag || currentUser.currentSubject,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => {
      const updated = [...prev, newMsg];
      localStorage.setItem('STUDYHUB_LIVE_CHAT', JSON.stringify(updated.slice(-100)));
      return updated;
    });

    // Broadcast locally across browser tabs
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'CHAT_MSG', payload: newMsg });
    }

    // Broadcast via Supabase
    if (supabase && isSupabaseConfigured) {
      supabase.channel('studyhub_lounge_presence').send({
        type: 'broadcast',
        event: 'chat',
        payload: newMsg,
      });
    }
  };

  return {
    currentUser,
    updateStudentName,
    peers,
    messages,
    sendMessage,
    isConnected,
    syncedWithCloud,
    channelStatus
  };
};
