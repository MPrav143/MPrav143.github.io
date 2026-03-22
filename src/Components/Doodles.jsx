import React from 'react';
import { Code, Cpu, Database, Terminal, Laptop, Server, Wifi, Globe, Coffee, Lightbulb, Monitor, Hash, Rocket, Sparkles, Binary, Layers } from 'lucide-react';

const icons = [Code, Cpu, Database, Terminal, Laptop, Server, Wifi, Globe, Coffee, Lightbulb, Monitor, Hash, Rocket, Sparkles, Binary, Layers];

const Doodles = ({ sectionName }) => {
  const positions = [
    { top: '10%', left: '5%' },
    { top: '20%', right: '10%' },
    { top: '70%', left: '15%' },
    { top: '80%', right: '5%' },
    { top: '40%', left: '4%' },
    { top: '50%', right: '15%' },
    { top: '15%', left: '40%' },
    { top: '85%', right: '40%' },
    { top: '45%', left: '50%' },
  ];

  const hash = sectionName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {positions.map((pos, index) => {
         const Icon = icons[(hash + index) % icons.length];
         const size = 40 + ((hash * (index + 1)) % 60); // Sizes between 40 and 100
         const rotation = ((hash * (index + 1) * 17) % 360);
         const delay = (index % 5) * -2; // Negative delay to start immediately at different phases
         const duration = 8 + (index % 6);

         return (
           <div 
             key={index} 
             className="absolute text-cyan-400 opacity-10" 
             style={{
               top: pos.top, 
               left: pos.left, 
               right: pos.right,
               transform: `rotate(${rotation}deg)`,
               animation: `doodle-float ${duration}s ease-in-out infinite`,
               animationDelay: `${delay}s`
             }}
           >
              <Icon size={size} strokeWidth={1} />
           </div>
         );
      })}
    </div>
  );
};

export default Doodles;
