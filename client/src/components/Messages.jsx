import { useEffect, useRef } from "react";
import { Label } from "./ui/label";
import "./Messages.css";

export default function Messages({ allMessages, userName }) {
  const messagesEndRef = useRef(null);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto scrollbar px-5 py-2">
      {allMessages.map(({ name, userMessage }, index) => {
        const isMe = userName === name ? "ml-auto" : "mr-auto";
        console.log(isMe);
        return (
          <div key={index} className={`flex flex-col gap-1 ${isMe}`}>
            <Label className={`${isMe}`}>{capitalizeFirstLetter(name)}</Label>
            <span className="border rounded-lg p-2 max-w-[900px] break-words">{userMessage}</span>
          </div>
        );
      })}
      <div ref={messagesEndRef}></div>
    </div>
  );
}
