import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import Messages from "@/components/Messages";
import Header from "@/components/Header";
import { useMain } from "@/store/main";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const { userInfo, isAuth } = useMain();
  const navigate = useNavigate();

  const handleEmojiClick = (e) => {
    setMessage(message + e.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      send();
    }
  };

  const handleTyping = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "typing", name: userInfo.name }));
    }
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (Array.isArray(data)) {
        setAllMessages((prevMessages) => [...prevMessages, ...data]);
      } else if (data.type === "typing") {
        setTypingUsers((prevTypingUsers) => {
          if (!prevTypingUsers.includes(data.name)) {
            return [...prevTypingUsers, data.name];
          }
          return prevTypingUsers;
        });

        setTimeout(() => {
          setTypingUsers((prevTypingUsers) =>
            prevTypingUsers.filter((user) => user !== data.name)
          );
        }, 3000);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (isAuth === false) {
      navigate("/login");
    }
  }, [navigate, isAuth]);

  const send = () => {
    if (message.length === 0) {
      return;
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "message",
          name: userInfo.name,
          userMessage: message,
        })
      );
      setMessage("");
      setShowEmojiPicker(false);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen flex justify-center items-center">
        <Card className="w-[1000px] h-[800px] flex flex-col relative">
          <CardHeader className="border-b mb-2">
            <CardTitle className="text-3xl">Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full">
              <Messages allMessages={allMessages} userName={userInfo.name} />
              {typingUsers.length > 0 && (
                <div className="mb-2 ml-2 text-sm text-gray-500">
                  {typingUsers.join(", ")} is typing...
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Input
              className="w-full"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyUp={handleKeyUp}
              maxLength={250}
            />
            <Button onClick={toggleEmojiPicker}>😾</Button>
            {showEmojiPicker && (
              <div className="absolute right-20 bottom-20">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <Button onClick={send}>Send</Button>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
