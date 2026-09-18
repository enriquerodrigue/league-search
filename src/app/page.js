"use client";

import { useState } from "react";
import styles from "./page.module.css";

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
        <main className={styles.page}>
            <div className={styles.backgroundGlow} />

            <section className={styles.shell}>
                <header className={styles.header}>
                    <span className={styles.eyebrow}>RIOT ACCOUNT LOOKUP</span>
                    <h1>League Search</h1>
                    <p>Find a summoner&apos;s level and ranked profile.</p>
                </header>

                <form className={styles.searchForm} onSubmit={searchPlayer}>
                    <label>
                        Game name
                        <input
                            value={gameName}
                            onChange={(event) => setGameName(event.target.value)}
                            placeholder="e.g. Hide on bush"
                            required
                        />
                    </label>

                    <label>
                        Tag line
                        <input
                            value={tagLine}
                            onChange={(event) => setTagLine(event.target.value)}
                            placeholder="e.g. KR1"
                            required
                        />
                    </label>

                    <label>
                        Region
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
                    </label>

                    <button className={styles.searchButton} type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Search player"}
                    </button>
                </form>

                {error && <p className={styles.error}>{error}</p>}

                {player && (
                    <section className={styles.results}>
                        <div className={styles.playerHeader}>
                            <img
                                className={styles.profileIcon}
                                src={`https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon${player.summoner.profileIconId}.jpg`}
                                alt=""
                                width="96"
                                height="96"
                            />
                            <div>
                                <span className={styles.eyebrow}>SUMMONER PROFILE</span>
                                <h2>
                                    {player.gameName}
                                    <span>#{player.tagLine}</span>
                                </h2>
                                <p>Level {player.summoner.summonerLevel}</p>
                            </div>
                        </div>

                        <div className={styles.rankedGrid}>
                            {player.ranked.map((queue) => (
                                <article className={styles.rankCard} key={queue.queueType}>
                                    <span className={styles.queueName}>
                                        {queue.queueType.replaceAll("_", " ")}
                                    </span>
                                    <img
                                        className={styles.rankIcon}
                                        src={`https://opgg-static.akamaized.net/images/medals_new/${queue.tier.toLowerCase()}.png`}
                                        alt={`${queue.tier} ${queue.rank}`}
                                        width="120"
                                        height="120"
                                    />
                                    <strong>
                                        {queue.tier} {queue.rank}
                                    </strong>
                                    <p>{queue.leaguePoints} LP</p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </section>
        </main>
    );
}
