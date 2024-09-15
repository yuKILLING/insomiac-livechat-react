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
  const [ws, setWs] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");

    socket.onmessage = (event) => {
      const messages = JSON.parse(event.data);
      setAllMessages((prevMessages) => [...prevMessages, ...messages]);
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

  const send = (event) => {
    if (message.length === 0) {
      return;
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          name: userInfo.name,
          userMessage: message,
        })
      );
      setMessage("");
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
              <Messages allMessages={allMessages} userName={userInfo.name}/>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Input
              className="w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
