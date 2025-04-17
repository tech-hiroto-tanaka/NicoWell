import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ウェルカム画面のアニメーション
export const useWelcomeAnimation = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // ページが読み込まれたときに実行されるアニメーション
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(logoRef.current, 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo(titleRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.6 }, 
      '-=0.4'
    )
    .fromTo(subtitleRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.6 }, 
      '-=0.3'
    )
    .fromTo(descriptionRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6 }, 
      '-=0.3'
    )
    .fromTo(buttonRef.current, 
      { opacity: 0, y: 30, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.6 },
      '-=0.2'
    );

    // ボタンのホバーアニメーション
    if (buttonRef.current) {
      buttonRef.current.addEventListener('mouseenter', () => {
        gsap.to(buttonRef.current, { scale: 1.05, duration: 0.3 });
      });
      
      buttonRef.current.addEventListener('mouseleave', () => {
        gsap.to(buttonRef.current, { scale: 1, duration: 0.3 });
      });
    }
    
    return () => {
      // クリーンアップ（必要に応じて）
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('mouseenter', () => {});
        buttonRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return { logoRef, titleRef, subtitleRef, descriptionRef, buttonRef };
};

// 質問画面のアニメーション
export const useQuestionAnimation = () => {
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    tl.fromTo(questionTitleRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.5 }
    );

    // オプションが表示される前に少し遅延を入れる
    tl.fromTo(optionsContainerRef.current?.children || [], 
      { opacity: 0, y: 20 }, 
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.1, // オプションが順番に表示される
        duration: 0.4 
      },
      '+=0.1'
    );

    // ボタンは最後に表示
    tl.fromTo(buttonsContainerRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.2'
    );
  }, []);

  return { questionTitleRef, optionsContainerRef, buttonsContainerRef };
};

// 結果画面のアニメーション
export const useResultsAnimation = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const insightBoxRef = useRef<HTMLDivElement>(null);
  const actionBoxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: -30 }, 
      { opacity: 1, y: 0, duration: 0.6 }
    )
    .fromTo(insightBoxRef.current, 
      { opacity: 0, x: -30 }, 
      { opacity: 1, x: 0, duration: 0.7 }, 
      '-=0.3'
    )
    .fromTo(actionBoxRef.current, 
      { opacity: 0, x: 30 }, 
      { opacity: 1, x: 0, duration: 0.7 }, 
      '-=0.5'
    )
    .fromTo(buttonRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.2'
    );

    // ボタンのホバーアニメーション
    if (buttonRef.current) {
      buttonRef.current.addEventListener('mouseenter', () => {
        gsap.to(buttonRef.current, { scale: 1.05, duration: 0.3 });
      });
      
      buttonRef.current.addEventListener('mouseleave', () => {
        gsap.to(buttonRef.current, { scale: 1, duration: 0.3 });
      });
    }
    
    return () => {
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('mouseenter', () => {});
        buttonRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return { titleRef, insightBoxRef, actionBoxRef, buttonRef };
};

// チャット画面のメッセージアニメーション
export const useChatAnimation = () => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // 新しいメッセージが追加されたときのアニメーション
  const animateNewMessage = (messageElement: HTMLElement) => {
    gsap.fromTo(messageElement, 
      { opacity: 0, y: 20, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
    );
  };

  return { messageContainerRef, animateNewMessage };
};