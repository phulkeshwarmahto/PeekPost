import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatList from "../components/messages/ChatList";
import ChatWindow from "../components/messages/ChatWindow";
import { addMessage, setActiveConversation, setConversations, setMessages } from "../redux/slices/messageSlice";
import { api } from "../services/api";
import { useSocket } from "../hooks/useSocket";

const Messages = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.accessToken);
  const { conversations, activeConversationId, messages } = useSelector((state) => state.message);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/messages/conversations");
      dispatch(setConversations(data));
      if (data[0]) {
        dispatch(setActiveConversation(data[0]._id));
      }
    };

    load();
  }, [dispatch]);

  useEffect(() => {
    if (!activeConversationId) return;

    const loadMessages = async () => {
      const { data } = await api.get(`/messages/conversations/${activeConversationId}`);
      dispatch(setMessages(data));
    };

    loadMessages();
  }, [activeConversationId, dispatch]);

  const handlers = useMemo(
    () => ({
      "message:new": (message) => {
        if (message.conversation === activeConversationId || message.conversation?._id === activeConversationId) {
          dispatch(addMessage(message));
        }
      },
    }),
    [activeConversationId, dispatch],
  );

  useSocket(token, handlers);

  const send = async () => {
    if (!draft.trim() || !activeConversationId) return;

    const { data } = await api.post(`/messages/conversations/${activeConversationId}`, { text: draft.trim() });
    dispatch(addMessage(data));
    setDraft("");
  };

  return (
    <div className="grid-2">
      <ChatList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelect={(conversationId) => dispatch(setActiveConversation(conversationId))}
      />
      <ChatWindow messages={messages} draft={draft} onDraftChange={setDraft} onSend={send} />
    </div>
  );
};

export default Messages;
