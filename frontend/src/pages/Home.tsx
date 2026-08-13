import React from "react";
import useStore from "../store/useStore";

export default function Home() {
  const { count, inc, dec } = useStore();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <p className="mb-4">This is a starter page. Count: {count}</p>
      <div className="flex gap-2">
        <button onClick={inc} className="px-3 py-1 bg-blue-600 text-white rounded">+1</button>
        <button onClick={dec} className="px-3 py-1 bg-gray-200 rounded">-1</button>
      </div>
    </div>
  );
}
