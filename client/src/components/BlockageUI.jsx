import { useEffect, useState } from "react";

const BlockageUI = () => {
  const [blockedUntil, setBlockedUntil] = useState(
    localStorage.getItem("blocked_until"),
  );
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Monitor localStorage for changes (triggered by Axios interceptor)
    const handleStorageChange = () => {
      setBlockedUntil(localStorage.getItem("blocked_until"));
    };

    window.addEventListener("storage", handleStorageChange);

    const timer = setInterval(() => {
      if (blockedUntil) {
        // Check if the value is a pure string of numbers, parse it accordingly
        const targetTime = isNaN(Number(blockedUntil))
          ? new Date(blockedUntil)
          : new Date(Number(blockedUntil));

        const diff = Math.ceil((targetTime - new Date()) / 1000);

        if (diff <= 0) {
          localStorage.removeItem("blocked_until");
          setBlockedUntil(null);
          clearInterval(timer); // Good practice to clear the interval right before reloading
          window.location.reload(); // Refresh to restore access
        } else {
          setTimeLeft(diff);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(timer);
    };
  }, [blockedUntil]);

  if (!blockedUntil || timeLeft <= 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="text-6xl mb-4">🛡️</div>
        <h5 className="text-2xl font-black text-slate-900 mb-2">
          Security Check
        </h5>
        <p className="text-slate-500 mb-6">
          Your access is temporarily restricted to protect our store from
          unusual traffic.
        </p>
        <div className="bg-slate-100 rounded-2xl py-4 mb-6">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-1">
            Resuming in
          </p>
          <p className="text-4xl font-mono font-black text-emerald-600">
            {timeLeft}s
          </p>
        </div>
        {/* <p className="text-[10px] text-slate-400">
            This block is tied to your IP/Account. Clearing your browser cache
            will not bypass this security measure.
          </p> */}
      </div>
    </div>
  );
};

export default BlockageUI;
