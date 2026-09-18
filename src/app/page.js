"use client";

import { useState } from "react";

export default function Page() {
    const [gameName, setGameName] = useState("");
    const [tagLine, setTagLine] = useState("");
    const [platform, setPlatform] = useState("na1");
    const [player, setPlayer] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function searchPlayer(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        setPlayer(null);

        try {
            const response = await fetch(
                `/api/player?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&platform=${encodeURIComponent(platform)}`,
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Search failed");
            }
            console.log(data);
            setPlayer(data);
        } catch (searchError) {
            setError(searchError.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>League Search</h1>

            <form onSubmit={searchPlayer}>
                <input
                    value={gameName}
                    onChange={(event) => setGameName(event.target.value)}
                    placeholder="Game name"
                    required
                />

                <input
                    value={tagLine}
                    onChange={(event) => setTagLine(event.target.value)}
                    placeholder="Tag line, e.g. NA1"
                    required
                />

                <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
                    <option value="na1">North America</option>
                    <option value="euw1">Europe West</option>
                    <option value="eun1">Europe Nordic & East</option>
                    <option value="kr">Korea</option>
                    <option value="jp1">Japan</option>
                    <option value="br1">Brazil</option>
                    <option value="la1">Latin America 1</option>
                    <option value="la2">Latin America 2</option>
                    <option value="oc1">Oceania</option>
                    <option value="tr1">Turkey</option>
                    <option value="ru">Russia</option>
                </select>

                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && <p>{error}</p>}

            {player && (
                <section>
                    <h2>
                        {player.gameName}#{player.tagLine}
                    </h2>

                    <p>Summoner level: {player.summoner.summonerLevel}</p>

                    {player.ranked.map((queue) => (
                        <div key={queue.queueType}>
                            <strong>{queue.queueType}</strong>
                            <p>
                                {queue.tier} {queue.rank} — {queue.leaguePoints} LP
                            </p>
                        </div>
                    ))}
                </section>
            )}
        </main>
    );
}
