import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState(null)
  const [walletAddress, setWalletAddress] = useState(null)
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(false)

  async function getData(walletAddress) {
    const data = await fetch(`https://api.deworkxyz.com/v1/reputation/${walletAddress}`)
    const result = await data.json()
    return result
  }

  async function formatData(walletAddress) {
    const data = await getData(walletAddress)
    //array.date.replace(array.date, array.date.split("T")[0]))
    const formattedDates = data.tasks.map(array => array.date.replace(array.date, Date.parse(array.date.split("T")[0])))
    data.tasks.map((array, index) => {
        array["date"] = formattedDates[index]
    })
    return data
  }

  async function getDataFrom(walletAddress, date) {
    const data = await formatData(walletAddress)
    const arr = []
    data.tasks.map(array => array.date >= Date.parse(date) && arr.push(array))
    return arr
  }

  async function getPointsFrom(walletAddress, date) {
    const data = await getDataFrom(walletAddress, date)
    const pointsArray = []
    return data.map(array => pointsArray.push(array.points != null ? pointsArray.push(array.points) : pointsArray.push(0)))
  }

  async function getTotalPointsFrom(walletAddress, date) {
    const data = await getPointsFrom(walletAddress, date)
    const total = data.reduce((a, b) => a + b)
    if (total) {
      setLoading(false)
    }
    setPoints(total)
  }

  function logic(date) {
    setDate(date)
  }
  return(
    <div>
      <Head>
        <title>Points getter</title>
      </Head>
      <main className="flex items-center justify-center w-full h-screen">
        <div className="w-[640px] h-[350px] bg-black">
          <div className="p-2.5 text-black text-center bg-green-500">https://api.deworkxyz.com/v1/reputation/</div>
          <div className="flex flex-col items-center justify-center w-full h-full space-y-2.5 pb-20">
            <p className="font-semibold text-white">You have {points} points</p>
            <input type="date" className="!outline-none w-64 p-2.5" value={date} onChange={e => setDate(e.target.value)} />
            <input type="text" placeholder="Enter wallet address" className="w-64 p-2.5 outline-none" onChange={e => setWalletAddress(e.target.value)} />
            <button className="w-64 p-2.5 bg-green-500 text-white" onClick={async function() {
              setLoading(true)
              await getTotalPointsFrom(walletAddress, date)
            }}>{loading ? "Loading..." : "Get points"}</button>
          </div>
        </div>
      </main>
    </div>
  )
}