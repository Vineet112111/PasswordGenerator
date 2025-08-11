import React, { useState, useCallback, useRef, useEffect } from "react";
import QRModel from "./components/QRModel";

export default function App() {
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [uniqueName, setUniqueName] = useState("");
  const [combineMode, setCombineMode] = useState("append"); 
  const [showQR, setShowQR] = useState(false);

  const passwordRef = useRef(null);

  const generatePassword = useCallback(() => {
    let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()_+";

    let extraLength = Math.max(length - uniqueName.length, 0);
    let randomPart = "";

    for (let i = 0; i < extraLength; i++) {
      randomPart += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    let finalPassword;
    if (!uniqueName) {
      finalPassword = randomPart;
    } else if (combineMode === "append") {
      finalPassword = uniqueName + randomPart;
    } else if (combineMode === "prepend") {
      finalPassword = randomPart + uniqueName;
    } else if (combineMode === "mix") {
      let combined = (uniqueName + randomPart).split("");
      finalPassword = combined.sort(() => Math.random() - 0.5).join("");
    }

    setPassword(finalPassword);
  }, [length, numbers, symbols, uniqueName, combineMode]);

  useEffect(() => {
    generatePassword();
  }, [length, numbers, symbols, uniqueName, combineMode]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(password);
  }, [password]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-amber-50 p-4">
      <div className="w-full max-w-lg bg-gray-800 text-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-orange-400">
          🔐 Custom Password Generator
        </h1>

        {/* Password Display */}
        <div className="flex bg-gray-700 rounded-lg overflow-hidden">
          <input
            type="text"
            value={password}
            className="flex-1 px-3 py-2 bg-gray-700 text-lg"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className="bg-blue-600 px-4 hover:bg-blue-700"
          >
            Copy
          </button>
          <button
            onClick={() => setShowQR(true)}
            className="bg-green-600 px-4 hover:bg-green-700"
          >
            Show QR
          </button>
        </div>

        {/* Unique Name */}
        <div>
          <label className="block text-sm mb-1">Your Unique Name</label>
          <input
            type="text"
            value={uniqueName}
            onChange={(e) => setUniqueName(e.target.value)}
            placeholder="e.g. Vineet"
            className="w-full px-3 py-2 rounded-lg text-amber-100 outline-none"
          />
        </div>

        {/* Mode Selector */}
        <div>
          <label className="block text-sm mb-1">Combine Mode</label>
          <select
            value={combineMode}
            onChange={(e) => setCombineMode(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-amber-100"
          >
            <option value="append" className="bg-amber-800">Append random chars after name</option>
            <option value="prepend" className="bg-amber-800">Prepend random chars before name</option>
            <option value="mix" className="bg-amber-800">Mix name with random chars</option>
          </select>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <div>
            <label>Length: {length}</label>
            <input
              type="range"
              min={6}
              max={35}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={numbers}
                onChange={() => setNumbers((prev) => !prev)}
              />
              Include Numbers
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={symbols}
                onChange={() => setSymbols((prev) => !prev)}
              />
              Include Symbols
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold"
        >
          Generate 🔄
        </button>
      </div>

      {showQR && (
        <QRModel password={password} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}
