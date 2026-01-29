import React, { useState, useEffect, useRef } from 'react';


import { Send, X, MessageSquare } from 'lucide-react';


import { ChatMessage } from '../types';





interface ChatWindowProps {


  isOpen: boolean;


  onClose: () => void;


  messages: ChatMessage[];


  onSendMessage: (text: string) => void;


  recipientName: string;


  recipientPhoto: string;


}





export const ChatWindow: React.FC<ChatWindowProps> = ({ 


  isOpen, 


  onClose, 


  messages, 


  onSendMessage,


  recipientName,


  recipientPhoto


}) => {


  const [inputText, setInputText] = useState('');


  const messagesEndRef = useRef<HTMLDivElement>(null);





  const scrollToBottom = () => {


    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });


  };





  useEffect(() => {


    if (isOpen) scrollToBottom();


  }, [messages, isOpen]);





  if (!isOpen) return null;





  const handleSubmit = (e: React.FormEvent) => {


    e.preventDefault();


    if (inputText.trim()) {


      onSendMessage(inputText);


      setInputText('');


    }


  };





  return (


    <div className="absolute bottom-0 w-full h-[60%] md:h-[500px] md:w-[400px] md:right-4 md:bottom-4 bg-white dark:bg-slate-900 shadow-2xl rounded-t-3xl md:rounded-3xl z-50 flex flex-col overflow-hidden animate-slide-up">

      {/* Header */}


      <div className="modal-header p-4 flex items-center justify-between">

        <div className="flex items-center gap-3">


          <div className="relative">


            <img src={recipientPhoto} className="w-10 h-10 rounded-full border-2 border-white" alt="Recipient" />

            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 dark:border-slate-950"></div>

          </div>


          <div>


            <h3 className="font-bold">{recipientName}</h3>


            <p className="text-xs text-slate-500 dark:text-slate-400">En viaje</p>

          </div>


        </div>


        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded-full transition">

          <X size={20} />

        </button>

      </div>





      {/* Messages Area */}


      <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-800">

        {messages.length === 0 && (


          <div className="text-center text-gray-400 dark:text-slate-500 text-sm mt-10">

            <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />


            <p>Inicia la conversación con {recipientName}...</p>


          </div>


        )}


        


        {messages.map((msg) => (


          <div key={msg.id} className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>


            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${


              msg.isSelf ? 'bg-slate-900 dark:bg-sky-500 text-white rounded-tr-none' 

                : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-100 rounded-tl-none shadow-sm'

            }`}>

              <p>{msg.text}</p>


              <span className={`text-[10px] block mt-1 ${msg.isSelf ? 'text-gray-400 dark:text-slate-500' : 'text-gray-400 dark:text-slate-500'}`}>

                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}

              </span>

            </div>


          </div>


        ))}


        <div ref={messagesEndRef} />


      </div>





      {/* Input Area */}


      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex gap-2">

        <input


          type="text"


          value={inputText}


          onChange={(e) => setInputText(e.target.value)}


          placeholder="Escribe un mensaje..."


          className="flex-grow bg-gray-100 dark:bg-slate-800 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-500"

        />

        <button 


          type="submit" 


          disabled={!inputText.trim()}


          className="bg-slate-900 dark:bg-sky-500 text-white p-3 rounded-full disabled:opacity-50 hover:scale-105 transition"

        >

          <Send size={18} />


        </button>


      </form>


    </div>


  );


};

