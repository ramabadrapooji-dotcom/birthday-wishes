import React from 'react';

const getAssetUrl = (filename: string) => {
  try {
    return new URL(`../../assets/${filename}`, import.meta.url).href;
  } catch {
    return `/magazine-photos/${filename}`; // fallback to public folder
  }
};

// Reusable Image component to handle object covering properly inside magazine. 
// Uses advanced CSS to automatically frame faces and bodies ("AI Framing").
const MagImage = ({ slotName, className, objectPosition = "object-[center_20%]" }: { slotName?: string, className?: string, objectPosition?: string }) => {
  const [error, setError] = React.useState(false);
  // Support both src/assets and public/magazine-photos
  const srcValue = slotName ? getAssetUrl(slotName) : undefined;
  return (
  <div className={`relative overflow-hidden bg-[#e6dfd1] border border-black/5 shadow-[inset_0_2px_15px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center ${className || ''}`}>
    {!error && slotName ? (
      // When an actual photo is loaded, this acts as the "AI" framer: 
      // It perfectly compresses/stretches and centers around upper-body/faces
      <img src={srcValue} loading="lazy" decoding="async" onError={() => setError(true)} className={`w-full h-full object-cover ${objectPosition} z-0 origin-center`} alt={slotName} />
    ) : (
      <div className="opacity-[0.35] text-stone-700 flex flex-col items-center z-0">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
         <span className="font-sans text-[0.45rem] tracking-[0.25em] uppercase font-medium text-center px-2">AI Face-Framing</span>
         <span className="font-sans text-[0.4rem] tracking-[0.1em] font-medium text-center mt-1 text-black bg-black/10 px-2 py-0.5 rounded-sm">{slotName || 'Photo Slot'}</span>
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 pointer-events-none mix-blend-overlay z-10" />
  </div>
  );
};

export const pages = [
  // --- PAGE 0: FRONT COVER ---
  ( // Front of Paper 0
    <div className="w-full h-full flex flex-col items-center bg-[#181818] text-stone-100 relative overflow-hidden">
      {/* Background Image Area */}
      <div className="absolute inset-y-12 inset-x-6 z-0 bg-[#222] rounded-sm shadow-2xl overflow-hidden flex items-center justify-center border border-white/5">
        <div className="w-full h-full">
           <MagImage slotName="frontcover.jpg" className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none z-10" />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-20 w-full h-full p-6 flex flex-col pointer-events-none">
        
        {/* Top Header */}
        <div className="mt-8 flex flex-col items-center w-full">
           <h1 className="font-serif text-[3.2rem] sm:text-[3.8rem] leading-[0.8] font-bold tracking-tight text-white/95 drop-shadow-md">BIRTHDAY</h1>
           <p className="font-serif text-[0.65rem] tracking-[0.5em] text-white/90 mt-3 self-end pr-4 drop-shadow-sm">MAGAZINE</p>
        </div>
        
        {/* Mid-Left text block */}
        <div className="absolute top-[35%] left-8 text-left">
           <p className="font-serif text-4xl mb-1 text-white/95 drop-shadow-md">20th</p>
           <p className="text-[0.55rem] uppercase tracking-[0.2em] font-sans text-white/90 drop-shadow-sm">BIRTHDAY</p>
        </div>

        {/* Lower-left text block */}
        <div className="absolute top-[55%] left-8 text-left">
           <p className="text-[0.65rem] uppercase tracking-[0.2em] font-sans text-white/95 mb-1 leading-relaxed drop-shadow-sm">GET TO<br/>KNOW<br/>POOJITHA</p>
        </div>
        
        {/* Bottom Right Details */}
        <div className="absolute bottom-10 right-8 text-right">
           <p className="font-serif text-lg tracking-wider text-white/95 drop-shadow-md uppercase">LOVE EDITION</p>
           <p className="text-[0.6rem] tracking-[0.25em] font-sans text-white/90 mt-1 drop-shadow-sm uppercase">SPECIAL</p>
        </div>
        <div className="absolute bottom-10 left-8 text-left">
           <p className="text-[0.6rem] tracking-widest font-sans text-white/80 mt-1 drop-shadow-sm">2026</p>
        </div>
      </div>
      
      {/* Glossy Cover Texture */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none mix-blend-overlay z-30" />
    </div>
  ),

  // --- PAGE 1: INSIDE FRONT COVER ---
  ( // Back of Paper 0
    <div className="w-full h-full bg-[#f4f2ee] text-stone-100 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.05)] border-l border-white" />
  ),

  // --- PAGE 2: TITLE PAGE ---
  ( // Front of Paper 1
    <div className="w-full h-full bg-transparent flex flex-col items-center justify-center relative">
      <div className="text-center z-10 -mt-12">
        <h2 className="font-serif text-5xl font-bold tracking-tighter text-[#222] mb-2">BIRTHDAY</h2>
        <p className="font-serif text-[0.65rem] tracking-[0.3em] text-[#444] uppercase ml-12">Magazine</p>
      </div>
      <div className="absolute bottom-24 text-center z-10 left-12 text-left">
        <p className="text-[0.6rem] uppercase tracking-[0.1em] text-[#333] font-sans font-medium">SPECIAL LOVE EDITION</p>
        <p className="text-[0.6rem] uppercase tracking-[0.1em] text-[#333] font-sans font-medium mt-1">2026, AMOR AETURNUS SEASON</p>
      </div>
    </div>
  ),

  // --- PAGE 3: WHO'S THAT GIRL (TEXT) ---
  ( // Back of Paper 1
    <div className="w-full h-full bg-transparent flex flex-col justify-start relative overflow-hidden">
       {/* Background Image with soft faded effect */}
       <div className="absolute inset-0 z-0 opacity-25 grayscale sepia-[0.3]">
          <MagImage slotName="bg-p3.jpg" className="w-full h-full" />
       </div>
       <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5f0]/40 via-[#f8f5f0]/60 to-[#f8f5f0]/80 z-0 pointer-events-none" />
       
       <div className="p-8 pb-16 w-full h-full flex flex-col relative z-10">
         <div className="flex gap-6 h-full relative z-10 pr-2">
            {/* Left Column: Title + First part of text */}
            <div className="w-1/2 flex flex-col justify-start">
               <h2 className="font-serif text-[3.5rem] font-bold text-[#222] leading-[0.9] mt-2 mb-8 relative">
                 <span className="italic font-normal text-[#555] block ml-6">Who's</span>
                 <span className="block ml-2 text-[#222]">that</span>
                 <span className="block text-[#222]">girl?</span>
                 <div className="absolute right-2 top-4 w-6 h-6 rounded-full bg-[#cbd5e1] opacity-50 blur-[2px]" />
               </h2>
               <p className="text-[0.42rem] text-[#333] leading-[1.65] font-sans font-medium text-justify hyphens-auto antialiased break-words">
                 <span className="text-[2.5rem] font-serif float-left leading-[0.8] mr-2 mt-1 text-[#222]">P</span>
                 ooji is the type of a beautiful woman who a little sweet person who brings the happiness when she is around a circle of persons. The perfect lady with the accurate knowledge and best mature level of understanding and thinking. She is a very kind person who takes care of the persons indirectly behind of the scenarios of situation.
               </p>
            </div>

            {/* Right Column: Second part of text */}
            <div className="w-1/2 mt-2 flex flex-col justify-start">
               <p className="text-[0.42rem] text-[#333] leading-[1.65] font-sans font-medium text-justify hyphens-auto antialiased break-words">
                 Pooji is a confident person who faces the every situation bravely, She is a perfect mix of a person with swweet as in inside and as well as spice on outside. she will be looking like as tough on outside but in the inside view she is the very kind, helpful, take cares on around her circle persons. She is a beautiful person. she is a very hard working. But even a brave girl have deserves some rest and peace around chaos. She is a person who follows the trends of the society and gives his best among of his skills, Also she will understand the POV of the society. pooji acts as a children with in her circle people. She finds the happiness in little things on the art works. she is an a sketch artist soul. who observes around on the things, finds the happiness, expresses the feelings by those arts. she will keep an eye on the things on the around his circle, makes decisions as per the right path. She is a person who she does what she likes and continuos her journey with smile.
               </p>
            </div>
         </div>
       </div>
    </div>
  ),

  // --- PAGE 4: WHO'S THAT GIRL (PHOTOS) ---
  ( // Front of Paper 2
    <div className="w-full h-full bg-transparent p-4 flex flex-col gap-1 relative">
       <div className="flex-1 flex gap-1 z-10">
          <MagImage slotName="photo-p1.jpg" className="flex-1 w-1/2 aspect-[4/5]" />
          <div className="flex-1 flex flex-col gap-1 w-1/2">
             <MagImage slotName="photo-p2.jpg" className="flex-1 aspect-square" />
             <MagImage slotName="photo-p3.jpg" className="flex-1 aspect-[4/3]" />
          </div>
       </div>
       <div className="flex-1 flex gap-1 z-10">
          <MagImage slotName="photo-p4.jpg" className="w-2/5 aspect-[3/4]" />
          <MagImage slotName="photo-p5.jpg" className="w-3/5 aspect-[4/5]" />
       </div>
    </div>
  ),

  // --- PAGE 5: INSIDE HER WORLD (INTRO - Left side) ---
  ( // Back of Paper 2
    <div className="w-full h-full bg-[#f8f5f0] p-8 flex flex-col justify-start relative overflow-hidden">
       {/* Background Image */}
       <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <MagImage slotName="photo-inside-bg-1.jpg" className="w-full h-full object-cover grayscale mix-blend-multiply" />
       </div>
       <div className="absolute inset-0 bg-gradient-to-br from-[#f8f5f0]/40 via-transparent to-[#f8f5f0]/80 z-0 pointer-events-none" />

       <h2 className="font-serif text-[4rem] font-bold text-[#222] leading-[0.8] mb-12 mt-12 z-10 ml-4 relative">
         INSIDE <br/>
         <span className="italic font-normal text-[#555] text-5xl absolute top-3 left-12 font-serif z-20">her</span>
         <br/>
         <span className="relative z-10">WORLD</span>
       </h2>

       {/* Decorative Image at the bottom left */}
       <div className="absolute bottom-8 left-8 w-32 h-48 bg-[#e0dcd3] -rotate-[8deg] shadow-lg z-10 border-[3px] border-white flex items-center justify-center overflow-hidden">
          <MagImage slotName="photo-p22.jpg" className="w-full h-full" objectPosition="object-[center_top]" />
       </div>
    </div>
  ),

  // --- PAGE 6: INSIDE HER WORLD (TEXT & PHOTOS - Right side) ---
  ( // Front of Paper 3
    <div className="w-full h-full bg-[#f8f5f0] flex relative overflow-hidden">
       {/* Background Image */}
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <MagImage slotName="photo-inside-bg-2.jpg" className="w-full h-full object-cover grayscale mix-blend-multiply" />
       </div>
       <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5f0]/40 via-[#f8f5f0]/60 to-[#f8f5f0]/80 z-0 pointer-events-none" />

       {/* Left side text column (takes up ~70%) */}
       <div className="w-[70%] p-6 pt-12 z-10 pr-2 relative text-[#333] font-sans font-medium text-[0.38rem] leading-[1.6] flex gap-4">
         {/* Left Column */}
         <div className="w-1/2 flex flex-col justify-start">
           <p className="mb-4 text-justify hyphens-auto antialiased break-words">
             Pooji is a joyful and beautiful person also with beautiful heart. She will face the every situation and deals the situations calmly and silently on other hand facing a problem of she will get disturb among on her own thoughts of over thinking but it looks ok and beautiful every person had some of like this right in their inner soul. Her intelligence and way of thinking and unique perspective that she created is much more can solve the every problem easily. She is a unique one that everyone cant have like that.
           </p>
           <p className="mb-4 text-justify hyphens-auto antialiased break-words">
             In the inside her world it looks more she will mostly like to roast her closed persons , despite her this like of personality she is a very playful person with her closed persons . She is a princess in her family. She just is a little bit lazy but the lazy peoples are the best problem dealers right they seeks for the best and easiest path to solve the problem . she likes the most to sleep all day. She is a very unique person.
           </p>
         </div>
         {/* Right Column */}
         <div className="w-1/2 flex flex-col justify-start">
           <p className="mb-4 text-justify hyphens-auto antialiased break-words">
             Pooji has a positive aura that she will lights up the happiness around her circle. Her soft tone will changes the everyone's mood to normal and positive state around her persons . Her voice tone is very sweet ,that whenever she sings a song that mesmerizes me. she is a beautiful person. she sees the effort have to be a perfect and beautiful. she always loves her sister. She always makes an effort to keep her sister happy and she will always be there for her sister. She always respects the others opinions. She creates a vibe of happiness and joy around her circle. She is a rainbow on the sky when raining which looks mesmerizing and also gives the happiness.
           </p>
           <p className="mb-4 text-justify hyphens-auto antialiased break-words">
             One thing that she learns from her mistakes and keep moving positively. She always see the positive from their circle persons. she is brave . She always takes care of her persons . She is a good giiirrrllll. She loves the cats and kittens that she will find the happiness to her inner child soul. In the end her journey is all about to be brave, learn , growing , loving the positives and find the happiness for her inner soul.
           </p>
         </div>
       </div>

       {/* Right side photo strip (edge) */}
       <div className="w-[30%] bg-[#111] p-1 flex flex-col gap-1 z-10 shadow-[-5px_0_15px_rgba(0,0,0,0.1)]">
          <MagImage slotName="photo-p6.jpg" className="h-[25%]" />
          <MagImage slotName="photo-p7.jpg" className="h-[25%]" />
          <MagImage slotName="photo-p8.jpg" className="h-[25%]" />
          <MagImage slotName="photo-p9.jpg" className="h-[25%]" />
       </div>
    </div>
  ),

  // --- PAGE 7: OUR PHOTO GALLERY (LEFT PAGE) ---
  ( // Back of Paper 3
    <div className="w-full h-full bg-[#2a2624] overflow-hidden relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)] border-r border-[#1a1715]">
       {/* Realistic film strip backgrounds diagonally */}
       <div className="absolute inset-0 opacity-[0.25] pointer-events-none">
          {/* Film strip 1 */}
          <div className="absolute top-16 -left-16 w-[180%] h-14 bg-black border-y border-white/20 rotate-[35deg] flex flex-col justify-between py-1 shadow-xl">
             <div className="flex justify-around px-4">
                {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#e5e5e5] rounded-[1px]" />)}
             </div>
             <div className="flex justify-around px-4">
                {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#e5e5e5] rounded-[1px]" />)}
             </div>
          </div>
          {/* Film strip 2 */}
          <div className="absolute bottom-24 -left-16 w-[180%] h-14 bg-black border-y border-white/20 -rotate-[25deg] flex flex-col justify-between py-1 shadow-xl">
             <div className="flex justify-around px-4">
                {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#e5e5e5] rounded-[1px]" />)}
             </div>
             <div className="flex justify-around px-4">
                {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#e5e5e5] rounded-[1px]" />)}
             </div>
          </div>
       </div>
       
       <div className="relative z-10 p-6 pt-10">
          <h2 className="font-serif text-[3.5rem] font-bold text-[#f4eedf] leading-[0.85] text-left ml-2 drop-shadow-lg">
            Our <br/>
            <span className="italic font-normal">photo</span><br/>
            gallery
          </h2>
       </div>

       {/* Polaroids - Scattered realistically */}
       <div className="absolute top-48 left-4 w-28 bg-[#fdfbf7] p-1.5 pb-6 shadow-[0_10px_20px_rgba(0,0,0,0.5)] -rotate-[12deg] z-20 transition-transform hover:scale-105">
          <MagImage slotName="photo-p10.jpg" className="w-full aspect-square grayscale contrast-125" />
       </div>

       <div className="absolute top-36 -right-6 w-32 bg-[#fdfbf7] p-2 pb-8 shadow-[0_15px_30px_rgba(0,0,0,0.6)] rotate-[15deg] z-20 transition-transform hover:scale-105">
          <MagImage slotName="photo-p11.jpg" className="w-full aspect-[4/5] grayscale contrast-125 sepia-[0.2]" />
       </div>

       <div className="absolute bottom-20 left-10 w-32 bg-[#fdfbf7] p-2 pb-8 shadow-[0_12px_24px_rgba(0,0,0,0.5)] -rotate-[8deg] z-20 transition-transform hover:scale-105">
          <MagImage slotName="photo-p12.jpg" className="w-full aspect-[4/3] grayscale contrast-125" />
       </div>
    </div>
  ),

  // --- PAGE 8: GALLERY (RIGHT PAGE) ---
  ( // Front of Paper 4
    <div className="w-full h-full bg-[#2a2624] overflow-hidden relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.2)]">
       {/* Connecting film strip background */}
       <div className="absolute inset-0 opacity-[0.25] pointer-events-none">
          <div className="absolute top-20 -right-20 w-[180%] h-14 bg-black border-y border-white/20 -rotate-[20deg] flex flex-col justify-between py-1 shadow-xl">
             <div className="flex justify-around px-4">
                {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#e5e5e5] rounded-[1px]" />)}
             </div>
             <div className="flex justify-around px-4">
                {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#e5e5e5] rounded-[1px]" />)}
             </div>
          </div>
          <div className="absolute bottom-32 -right-20 w-[180%] h-14 bg-black border-y border-white/20 rotate-[35deg] flex flex-col justify-between py-1 shadow-xl">
             <div className="flex justify-around px-4">
                {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#e5e5e5] rounded-[1px]" />)}
             </div>
             <div className="flex justify-around px-4">
                {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#e5e5e5] rounded-[1px]" />)}
             </div>
          </div>
       </div>

       {/* Polaroids - scattered on right side */}
       <div className="absolute top-8 right-6 w-32 bg-[#fdfbf7] p-2 pb-8 shadow-[0_15px_30px_rgba(0,0,0,0.6)] rotate-[8deg] z-20">
          <MagImage slotName="photo-p13.jpg" className="w-full aspect-square grayscale sepia-[0.3]" />
       </div>

       <div className="absolute top-1/2 left-4 -translate-y-1/2 w-36 bg-[#fdfbf7] p-2 pb-8 shadow-[0_12px_24px_rgba(0,0,0,0.5)] -rotate-[15deg] z-20">
          <MagImage slotName="photo-p14.jpg" className="w-full aspect-[4/3] grayscale contrast-125 sepia-[0.1]" />
       </div>

       <div className="absolute bottom-10 right-8 w-28 bg-[#fdfbf7] p-1.5 pb-6 shadow-[0_10px_20px_rgba(0,0,0,0.4)] rotate-[10deg] z-20">
          <MagImage slotName="photo-p15.jpg" className="w-full aspect-[4/3] grayscale contrast-125" />
       </div>
    </div>
  ),

  // --- PAGE 9: DELICIOUS MOMENTS ---
  ( // Back of Paper 4
    <div className="w-full h-full bg-transparent p-4 flex gap-4 relative">
       {/* Left photo strip */}
       <div className="w-[45%] flex flex-col gap-1 z-10 h-full pb-2">
          <MagImage slotName="photo-p16.jpg" className="h-[40%] rounded-sm" />
          <MagImage slotName="photo-p17.jpg" className="h-[30%] rounded-sm" />
          <MagImage slotName="photo-p18.jpg" className="h-[30%] rounded-sm" />
       </div>

       {/* Right text area */}
       <div className="w-[55%] flex flex-col pt-6 pr-2 z-10">
          <h2 className="font-serif text-[2.2rem] font-bold text-[#222] leading-[0.9] mb-6 flex flex-col items-start drop-shadow-sm">
            <span className="italic font-normal text-[#c78841] text-[1.2rem] transform -rotate-2 mb-2 block font-serif ml-2">The curation of her</span>
            JOY MOMENTS
          </h2>
          
          <p 
            className="text-[0.45rem] text-[#444] leading-[1.65] font-sans font-medium"
            style={{ columnCount: 1, textAlign: 'justify', hyphens: 'auto' }}
          >
            <span className="text-[2.5rem] font-serif float-left leading-[0.8] mr-2 text-[#222]">P</span>
            ooji is a someone who loves the kittens , sleeping ,playing with kids , Advanterous travelling and loves the panipuri and icecreams in foods. She will manifest to experience the most romantic and elegant places. She always excited to play with kittens and kids , She sits behind of those and plays and finds the happiness . she will always loves to eat panipuri and icecream, so she will runs around to the panipuri shop and experience the taste of that . she is curios to explore about to taste the panipuri at several locations. she loves to experience to taste the icecreams. she loves the sleep all the day, she is always ready to sleep at any time of the day . She is a cute little princess,....  
          </p>
       </div>
    </div>
  ),

  // --- PAGE 10: DELICIOUS MOMENTS (FULL SPREAD PHOTOS) ---
  ( // Front of Paper 5
    <div className="w-full h-full bg-[#f8f5f0] flex flex-col relative overflow-hidden">
       
       {/* Top Photo */}
       <div className="absolute top-0 left-0 w-full h-[38%] z-10">
          <div className="w-full h-full pb-2 bg-white relative drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]">
             <MagImage slotName="photo-p19.jpg" className="w-full h-full" />
             {/* Torn bottom edge */}
             <svg className="absolute -bottom-4 left-0 w-full h-6 text-white z-20 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]" preserveAspectRatio="none" viewBox="0 0 100 15" fill="currentColor">
                 <path d="M0,0 L0,7.2 L0,7.2 L 0.5,6.0 L 1,6.6 L 1.5,6.4 L 2,8.0 L 2.5,5.9 L 3,8.5 L 3.5,8.4 L 4,7.1 L 4.5,5.9 L 5,8.0 L 5.5,7.1 L 6,6.1 L 6.5,5.2 L 7,5.4 L 7.5,5.4 L 8,5.6 L 8.5,5.4 L 9,4.6 L 9.5,2.9 L 10,2.6 L 10.5,4.1 L 11,3.7 L 11.5,3.5 L 12,3.8 L 12.5,4.6 L 13,3.9 L 13.5,2.5 L 14,4.2 L 14.5,4.7 L 15,3.3 L 15.5,4.5 L 16,3.1 L 16.5,5.9 L 17,5.4 L 17.5,3.5 L 18,4.6 L 18.5,5.5 L 19,6.5 L 19.5,4.2 L 20,5.0 L 20.5,6.1 L 21,5.0 L 21.5,6.5 L 22,7.0 L 22.5,5.9 L 23,6.5 L 23.5,7.0 L 24,4.8 L 24.5,5.5 L 25,6.3 L 25.5,4.7 L 26,4.4 L 26.5,5.9 L 27,4.3 L 27.5,6.9 L 28,4.8 L 28.5,4.8 L 29,5.1 L 29.5,6.2 L 30,5.3 L 30.5,5.3 L 31,5.7 L 31.5,3.7 L 32,4.4 L 32.5,5.3 L 33,3.7 L 33.5,3.2 L 34,2.5 L 34.5,3.1 L 35,3.5 L 35.5,2.9 L 36,2.4 L 36.5,4.3 L 37,3.7 L 37.5,4.9 L 38,4.8 L 38.5,4.0 L 39,4.8 L 39.5,6.4 L 40,5.6 L 40.5,4.8 L 41,4.9 L 41.5,5.9 L 42,7.9 L 42.5,6.0 L 43,5.8 L 43.5,6.2 L 44,7.9 L 44.5,7.1 L 45,5.5 L 45.5,5.8 L 46,5.5 L 46.5,7.2 L 47,6.1 L 47.5,7.2 L 48,6.8 L 48.5,6.3 L 49,3.8 L 49.5,4.0 L 50,2.3 L 50.5,4.8 L 51,2.6 L 51.5,3.6 L 52,1.9 L 52.5,1.2 L 53,3.1 L 53.5,1.0 L 54,1.2 L 54.5,3.3 L 55,3.7 L 55.5,4.7 L 56,4.5 L 56.5,3.3 L 57,3.5 L 57.5,5.7 L 58,5.2 L 58.5,7.0 L 59,6.9 L 59.5,8.3 L 60,7.7 L 60.5,8.0 L 61,7.2 L 61.5,7.8 L 62,7.0 L 62.5,8.3 L 63,8.0 L 63.5,7.6 L 64,7.8 L 64.5,6.3 L 65,6.1 L 65.5,6.4 L 66,6.3 L 66.5,6.2 L 67,4.3 L 67.5,4.7 L 68,2.0 L 68.5,2.9 L 69,3.9 L 69.5,1.6 L 70,0.9 L 70.5,3.3 L 71,1.9 L 71.5,1.8 L 72,1.3 L 72.5,2.4 L 73,2.0 L 73.5,2.7 L 74,4.4 L 74.5,3.7 L 75,5.7 L 75.5,6.0 L 76,5.1 L 76.5,7.2 L 77,5.7 L 77.5,8.7 L 78,8.1 L 78.5,7.3 L 79,7.7 L 79.5,7.4 L 80,6.6 L 80.5,8.3 L 81,6.2 L 81.5,6.6 L 82,6.7 L 82.5,5.9 L 83,7.4 L 83.5,6.0 L 84,5.6 L 84.5,3.5 L 85,4.4 L 85.5,2.6 L 86,3.8 L 86.5,2.0 L 87,2.0 L 87.5,1.2 L 88,3.5 L 88.5,3.8 L 89,3.4 L 89.5,1.2 L 90,4.0 L 90.5,3.3 L 91,4.1 L 91.5,4.9 L 92,4.2 L 92.5,4.9 L 93,4.0 L 93.5,5.6 L 94,5.8 L 94.5,7.2 L 95,7.1 L 95.5,5.8 L 96,6.6 L 96.5,6.6 L 97,7.8 L 97.5,7.6 L 98,7.9 L 98.5,8.2 L 99,7.5 L 99.5,6.2 L 100,6.4 L100,0 Z" />
             </svg>
          </div>
       </div>

       {/* Middle Photo */}
       <div className="absolute top-[34%] left-0 w-full h-[35%] z-20 scale-105 rotate-[-1.5deg]">
          <div className="w-full h-full bg-white relative drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] pt-1 pb-2">
             <MagImage slotName="photo-p20.jpg" className="w-full h-full" />
             {/* Torn top edge */}
             <svg className="absolute -top-4 left-0 w-full h-6 text-white z-20 drop-shadow-[0_-4px_4px_rgba(0,0,0,0.3)]" preserveAspectRatio="none" viewBox="0 0 100 15" fill="currentColor">
                 <path d="M0,15 L0,6.3 L0,6.3 L 0.5,5.0 L 1,5.3 L 1.5,6.2 L 2,6.5 L 2.5,5.5 L 3,6.9 L 3.5,6.0 L 4,7.2 L 4.5,6.7 L 5,5.3 L 5.5,6.9 L 6,5.3 L 6.5,6.5 L 7,5.4 L 7.5,6.0 L 8,8.2 L 8.5,6.5 L 9,7.0 L 9.5,6.8 L 10,8.5 L 10.5,6.9 L 11,6.5 L 11.5,4.2 L 12,4.6 L 12.5,3.2 L 13,4.0 L 13.5,2.8 L 14,2.8 L 14.5,3.2 L 15,2.6 L 15.5,2.3 L 16,3.2 L 16.5,4.4 L 17,2.3 L 17.5,4.1 L 18,4.4 L 18.5,3.0 L 19,2.9 L 19.5,3.2 L 20,4.8 L 20.5,3.3 L 21,3.1 L 21.5,2.9 L 22,2.9 L 22.5,4.2 L 23,4.5 L 23.5,3.2 L 24,3.2 L 24.5,5.2 L 25,5.4 L 25.5,4.3 L 26,4.1 L 26.5,4.9 L 27,7.1 L 27.5,8.4 L 28,6.3 L 28.5,6.9 L 29,8.2 L 29.5,6.8 L 30,7.5 L 30.5,7.9 L 31,7.3 L 31.5,6.7 L 32,5.9 L 32.5,7.0 L 33,5.7 L 33.5,5.8 L 34,4.4 L 34.5,7.1 L 35,6.3 L 35.5,4.8 L 36,5.6 L 36.5,7.5 L 37,6.8 L 37.5,4.8 L 38,5.1 L 38.5,6.3 L 39,4.0 L 39.5,3.8 L 40,4.3 L 40.5,4.4 L 41,2.9 L 41.5,2.0 L 42,1.3 L 42.5,2.0 L 43,1.0 L 43.5,3.4 L 44,1.0 L 44.5,1.9 L 45,4.2 L 45.5,3.6 L 46,3.8 L 46.5,5.0 L 47,5.6 L 47.5,3.5 L 48,4.5 L 48.5,3.7 L 49,4.3 L 49.5,3.8 L 50,5.3 L 50.5,5.4 L 51,3.2 L 51.5,3.9 L 52,3.6 L 52.5,4.7 L 53,6.8 L 53.5,6.1 L 54,8.0 L 54.5,8.2 L 55,6.1 L 55.5,8.1 L 56,9.0 L 56.5,7.5 L 57,8.4 L 57.5,6.5 L 58,6.1 L 58.5,7.9 L 59,5.3 L 59.5,7.4 L 60,6.6 L 60.5,6.0 L 61,6.4 L 61.5,5.0 L 62,4.7 L 62.5,4.9 L 63,5.5 L 63.5,3.7 L 64,6.1 L 64.5,4.9 L 65,3.4 L 65.5,5.0 L 66,3.9 L 66.5,4.9 L 67,4.9 L 67.5,4.5 L 68,3.0 L 68.5,2.8 L 69,3.3 L 69.5,0.8 L 70,2.7 L 70.5,2.9 L 71,1.9 L 71.5,2.1 L 72,1.6 L 72.5,3.4 L 73,3.1 L 73.5,4.4 L 74,5.4 L 74.5,4.4 L 75,4.8 L 75.5,6.0 L 76,6.7 L 76.5,5.3 L 77,5.9 L 77.5,5.9 L 78,7.0 L 78.5,5.5 L 79,6.2 L 79.5,5.8 L 80,7.0 L 80.5,7.2 L 81,4.8 L 81.5,7.8 L 82,6.0 L 82.5,6.4 L 83,7.5 L 83.5,8.7 L 84,8.7 L 84.5,9.0 L 85,5.9 L 85.5,5.7 L 86,7.9 L 86.5,5.3 L 87,4.6 L 87.5,5.4 L 88,3.7 L 88.5,3.2 L 89,3.8 L 89.5,2.9 L 90,2.3 L 90.5,4.2 L 91,1.8 L 91.5,4.2 L 92,3.0 L 92.5,2.6 L 93,2.6 L 93.5,3.4 L 94,4.8 L 94.5,5.1 L 95,4.5 L 95.5,4.2 L 96,3.3 L 96.5,4.8 L 97,3.6 L 97.5,2.8 L 98,4.1 L 98.5,3.2 L 99,1.9 L 99.5,2.5 L 100,4.7 L100,15 Z" />
             </svg>
             {/* Torn bottom edge */}
             <svg className="absolute -bottom-4 left-0 w-full h-6 text-white z-20 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]" preserveAspectRatio="none" viewBox="0 0 100 15" fill="currentColor">
                 <path d="M0,0 L0,6.5 L0,6.5 L 0.5,5.2 L 1,6.7 L 1.5,6.3 L 2,6.1 L 2.5,7.3 L 3,6.2 L 3.5,8.3 L 4,5.5 L 4.5,6.4 L 5,7.3 L 5.5,7.8 L 6,7.4 L 6.5,4.6 L 7,6.9 L 7.5,6.3 L 8,4.2 L 8.5,3.8 L 9,3.8 L 9.5,3.3 L 10,3.3 L 10.5,4.3 L 11,2.4 L 11.5,2.6 L 12,3.6 L 12.5,3.2 L 13,3.7 L 13.5,4.5 L 14,3.5 L 14.5,3.9 L 15,4.8 L 15.5,3.2 L 16,4.7 L 16.5,5.0 L 17,3.3 L 17.5,5.0 L 18,6.1 L 18.5,4.2 L 19,6.7 L 19.5,5.8 L 20,6.5 L 20.5,5.4 L 21,4.7 L 21.5,4.7 L 22,5.4 L 22.5,4.5 L 23,6.0 L 23.5,7.5 L 24,6.8 L 24.5,5.6 L 25,6.0 L 25.5,7.3 L 26,5.5 L 26.5,5.0 L 27,5.8 L 27.5,4.8 L 28,6.0 L 28.5,5.9 L 29,6.3 L 29.5,4.8 L 30,5.9 L 30.5,3.5 L 31,5.0 L 31.5,5.3 L 32,3.0 L 32.5,4.3 L 33,5.0 L 33.5,3.2 L 34,4.3 L 34.5,4.2 L 35,2.9 L 35.5,4.7 L 36,4.9 L 36.5,4.0 L 37,2.7 L 37.5,4.5 L 38,4.4 L 38.5,4.9 L 39,5.6 L 39.5,6.4 L 40,6.8 L 40.5,6.6 L 41,7.5 L 41.5,6.5 L 42,7.2 L 42.5,5.7 L 43,6.2 L 43.5,6.8 L 44,6.9 L 44.5,6.3 L 45,7.7 L 45.5,6.8 L 46,6.9 L 46.5,7.8 L 47,7.3 L 47.5,7.1 L 48,4.7 L 48.5,4.8 L 49,6.0 L 49.5,4.7 L 50,5.0 L 50.5,4.9 L 51,2.1 L 51.5,1.9 L 52,3.6 L 52.5,1.4 L 53,2.6 L 53.5,3.7 L 54,3.2 L 54.5,4.0 L 55,3.0 L 55.5,3.5 L 56,2.4 L 56.5,3.4 L 57,4.9 L 57.5,5.0 L 58,4.4 L 58.5,6.8 L 59,5.8 L 59.5,6.1 L 60,8.0 L 60.5,6.9 L 61,8.2 L 61.5,9.2 L 62,8.5 L 62.5,8.4 L 63,6.7 L 63.5,7.0 L 64,7.1 L 64.5,6.7 L 65,6.1 L 65.5,6.7 L 66,5.2 L 66.5,6.2 L 67,4.4 L 67.5,4.6 L 68,1.9 L 68.5,1.4 L 69,2.1 L 69.5,0.9 L 70,1.4 L 70.5,1.0 L 71,2.7 L 71.5,2.0 L 72,3.0 L 72.5,2.2 L 73,2.1 L 73.5,4.2 L 74,2.8 L 74.5,4.7 L 75,5.1 L 75.5,4.6 L 76,4.7 L 76.5,7.3 L 77,7.9 L 77.5,7.7 L 78,7.7 L 78.5,7.1 L 79,9.2 L 79.5,7.3 L 80,6.4 L 80.5,7.9 L 81,8.1 L 81.5,7.4 L 82,5.7 L 82.5,6.0 L 83,7.1 L 83.5,6.8 L 84,4.9 L 84.5,4.0 L 85,5.3 L 85.5,3.3 L 86,2.6 L 86.5,2.2 L 87,1.6 L 87.5,1.9 L 88,1.7 L 88.5,2.3 L 89,2.8 L 89.5,4.0 L 90,4.2 L 90.5,4.6 L 91,2.7 L 91.5,2.8 L 92,3.8 L 92.5,3.8 L 93,6.4 L 93.5,6.5 L 94,6.8 L 94.5,6.4 L 95,7.6 L 95.5,6.6 L 96,7.9 L 96.5,8.5 L 97,8.3 L 97.5,6.7 L 98,6.9 L 98.5,7.6 L 99,7.2 L 99.5,7.8 L 100,5.1 L100,0 Z" />
             </svg>
          </div>
       </div>

       {/* Bottom Photo */}
       <div className="absolute bottom-0 left-0 w-full h-[36%] z-10">
          <div className="w-full h-full pt-2 bg-white relative">
             <MagImage slotName="photo-p21.jpg" className="w-full h-full" />
             {/* Torn top edge */}
             <svg className="absolute -top-4 left-0 w-full h-6 text-white z-20 drop-shadow-[0_-4px_4px_rgba(0,0,0,0.3)]" preserveAspectRatio="none" viewBox="0 0 100 15" fill="currentColor">
                 <path d="M0,15 L0,4.7 L0,4.7 L 0.5,7.1 L 1,5.8 L 1.5,5.0 L 2,5.8 L 2.5,4.7 L 3,4.6 L 3.5,5.5 L 4,5.0 L 4.5,4.5 L 5,5.2 L 5.5,5.0 L 6,5.3 L 6.5,7.7 L 7,7.1 L 7.5,5.9 L 8,8.7 L 8.5,6.7 L 9,6.7 L 9.5,8.5 L 10,7.4 L 10.5,5.7 L 11,5.5 L 11.5,5.5 L 12,5.4 L 12.5,5.7 L 13,4.4 L 13.5,5.0 L 14,1.9 L 14.5,2.1 L 15,3.3 L 15.5,2.3 L 16,4.0 L 16.5,2.9 L 17,3.2 L 17.5,5.2 L 18,5.1 L 18.5,4.6 L 19,3.9 L 19.5,3.3 L 20,2.9 L 20.5,4.4 L 21,4.1 L 21.5,3.2 L 22,3.0 L 22.5,1.9 L 23,2.3 L 23.5,2.6 L 24,2.1 L 24.5,3.9 L 25,5.1 L 25.5,5.2 L 26,6.8 L 26.5,5.0 L 27,7.3 L 27.5,6.6 L 28,6.1 L 28.5,6.6 L 29,7.9 L 29.5,7.0 L 30,8.7 L 30.5,5.8 L 31,6.5 L 31.5,7.9 L 32,6.2 L 32.5,5.1 L 33,4.8 L 33.5,5.3 L 34,6.7 L 34.5,6.0 L 35,4.8 L 35.5,7.1 L 36,7.4 L 36.5,5.5 L 37,7.1 L 37.5,7.3 L 38,6.5 L 38.5,4.8 L 39,4.0 L 39.5,3.2 L 40,4.0 L 40.5,3.3 L 41,2.4 L 41.5,1.1 L 42,2.1 L 42.5,1.0 L 43,3.4 L 43.5,1.7 L 44,3.5 L 44.5,2.2 L 45,2.6 L 45.5,3.5 L 46,4.4 L 46.5,5.5 L 47,6.0 L 47.5,4.8 L 48,3.5 L 48.5,5.7 L 49,6.1 L 49.5,5.5 L 50,4.5 L 50.5,4.7 L 51,3.6 L 51.5,4.7 L 52,5.1 L 52.5,4.5 L 53,6.2 L 53.5,6.9 L 54,6.0 L 54.5,5.8 L 55,7.1 L 55.5,8.5 L 56,8.3 L 56.5,8.6 L 57,6.9 L 57.5,8.5 L 58,8.8 L 58.5,7.3 L 59,5.7 L 59.5,5.0 L 60,5.6 L 60.5,5.2 L 61,5.4 L 61.5,4.2 L 62,4.2 L 62.5,3.9 L 63,4.5 L 63.5,5.3 L 64,4.0 L 64.5,3.3 L 65,5.5 L 65.5,4.2 L 66,4.5 L 66.5,5.1 L 67,5.2 L 67.5,2.3 L 68,2.0 L 68.5,3.5 L 69,3.4 L 69.5,0.9 L 70,0.7 L 70.5,1.4 L 71,1.7 L 71.5,3.9 L 72,2.1 L 72.5,2.6 L 73,3.1 L 73.5,5.6 L 74,3.9 L 74.5,5.3 L 75,7.0 L 75.5,6.5 L 76,6.1 L 76.5,6.3 L 77,6.5 L 77.5,5.1 L 78,5.4 L 78.5,5.9 L 79,7.2 L 79.5,5.1 L 80,6.2 L 80.5,5.4 L 81,5.1 L 81.5,6.0 L 82,6.7 L 82.5,7.0 L 83,6.9 L 83.5,7.9 L 84,9.0 L 84.5,6.8 L 85,7.9 L 85.5,6.4 L 86,5.7 L 86.5,6.7 L 87,6.7 L 87.5,4.9 L 88,4.1 L 88.5,2.7 L 89,2.1 L 89.5,2.8 L 90,3.8 L 90.5,3.0 L 91,4.4 L 91.5,4.0 L 92,3.0 L 92.5,2.2 L 93,3.7 L 93.5,3.9 L 94,5.0 L 94.5,4.2 L 95,5.0 L 95.5,4.3 L 96,4.9 L 96.5,2.0 L 97,2.2 L 97.5,1.8 L 98,3.4 L 98.5,4.6 L 99,3.6 L 99.5,4.7 L 100,2.5 L100,15 Z" />
             </svg>
          </div>
       </div>
       
    </div>
  ),

  // --- PAGE 11: HER PEOPLE ---
  ( // Back of Paper 5
    <div className="w-full h-full bg-transparent p-2 flex flex-col relative overflow-hidden">
       <div className="absolute inset-0 bg-[#fae8e6] opacity-30 mix-blend-multiply" style={{backgroundImage: "radial-gradient(#d69e9c 2px, transparent 2px)", backgroundSize: "20px 20px"}} />
       
       <h2 className="relative z-10 font-serif text-[4rem] font-bold text-[#222] text-center leading-[0.8] mb-4 mt-6 drop-shadow-md">
         HER<br/>
         <span className="italic font-normal text-[3.5rem] mt-2 block font-serif">people</span>
       </h2>
       
       <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-1 z-10 p-2">
           <MagImage slotName="photo-p24.jpeg" className="col-span-1 row-span-1" objectPosition="object-center" />
           <MagImage slotName="photo-p25.jpg" className="col-span-1 row-span-2" objectPosition="object-center" />
           <MagImage slotName="photo-p26.jpeg" className="col-span-1 row-span-2" objectPosition="object-[center_top]" />
           <MagImage slotName="photo-p27.jpeg" className="col-span-1 row-span-1" objectPosition="object-[center_top]" />
       </div>
    </div>
  ),

  // --- PAGE 12: FINAL MESSAGE ---
  ( // Front of Paper 6
    <div className="w-full h-full bg-transparent p-8 flex flex-col items-center justify-center relative">
       {/* Background subtle noise/grain */}
       <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

       <div className="z-10 text-center w-full max-w-[80%] mx-auto mt-[-10%]">
           <p className="font-serif italic text-2xl mb-8 text-[#222] opacity-90 tracking-wide text-left">
             "To the most wonderful soul,
           </p>

           <div className="space-y-4 text-left font-serif text-[0.6rem] leading-[2] text-[#444]">
              <p>May this year bring you as much joy as you bring to everyone around you. Keep shining in your unique way.</p>
              <p>Always stay as bright, kind, and amazing as you are today.</p>
           </div>
           
           <div className="mt-12 text-right">
             <p className="font-serif text-3xl italic text-[#111] opacity-90 transform -rotate-2">
                Happy Birthday!
             </p>
             <p className="font-sans uppercase text-[0.4rem] tracking-[0.3em] mt-4 text-[#666]">
                With love
             </p>
           </div>
       </div>

       {/* Subtle heart icon */}
       <div className="absolute bottom-12 opacity-30 z-10">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="#888" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
       </div>
    </div>
  ),

  // --- PAGE 13: BACK COVER ---
  ( // Back of Paper 6
    <div className="w-full h-full bg-[#111] overflow-hidden relative shadow-[inset_10px_0_30px_rgba(0,0,0,0.8)]">
       <div className="absolute inset-12 z-0 bg-[#151515] border border-white/5 rounded-sm shadow-inner flex items-center justify-center overflow-hidden">
          <MagImage slotName="backcover.jpg" className="w-full h-full" />
       </div>
       <div className="absolute inset-0 bg-black/50 z-0" />
       
       <div className="absolute top-20 w-full text-center z-10 text-white/90">
         <h2 className="font-serif text-[2rem] font-bold tracking-[0.2em] ml-2">BIRTHDAY</h2>
         <p className="font-serif text-[0.45rem] tracking-[0.5em] font-medium mt-1 text-white/60">MAGAZINE</p>
       </div>

       <div className="absolute bottom-20 left-16 z-10 text-white/70 text-left">
         <p className="text-[0.45rem] uppercase tracking-[0.2em] font-sans text-white/50">LOVE EDITION</p>
         <p className="text-[0.45rem] uppercase tracking-[0.2em] font-sans opacity-60 mt-1 text-white/40">2026, AMOR AETURNUS SEASON</p>
       </div>

       {/* Glossy Cover Texture */}
       <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-transparent pointer-events-none mix-blend-overlay" />
    </div>
  )
];
