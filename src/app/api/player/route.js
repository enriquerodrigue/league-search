import { NextResponse } from "next/server";

const accountRegions = {
    americas: "https://americas.api.riotgames.com",
    europe: "https://europe.api.riotgames.com",
    asia: "https://asia.api.riotgames.com",
    sea: "https://sea.api.riotgames.com",
};

const platformRegions = {
    na1: "https://na1.api.riotgames.com",
    euw1: "https://euw1.api.riotgames.com",
    eun1: "https://eun1.api.riotgames.com",
    kr: "https://kr.api.riotgames.com",
    jp1: "https://jp1.api.riotgames.com",
    br1: "https://br1.api.riotgames.com",
    la1: "https://la1.api.riotgames.com",
    la2: "https://la2.api.riotgames.com",
    oc1: "https://oc1.api.riotgames.com",
    tr1: "https://tr1.api.riotgames.com",
    ru: "https://ru.api.riotgames.com",
};

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const gameName = searchParams.get("gameName");
    const tagLine = searchParams.get("tagLine");
    const platform = searchParams.get("platform");

    if (!gameName || !tagLine || !platformRegions[platform]) {
        return NextResponse.json(
            { error: "gameName, tagLine, and a valid platform are required" },
            { status: 400 },
        );
    }

    const accountRegion =
        ["na1", "br1", "la1", "la2", "oc1"].includes(platform)
            ? "americas"
            : ["euw1", "eun1", "tr1", "ru"].includes(platform)
                ? "europe"
                : ["kr", "jp1"].includes(platform)
                    ? "asia"
                    : "sea";

    const headers = {
        "X-Riot-Token": process.env.RIOT_API_KEY,
    };

    const accountUrl =
        `${accountRegions[accountRegion]}/riot/account/v1/accounts/by-riot-id/` +
        `${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

    const accountResponse = await fetch(accountUrl, { headers });

    if (!accountResponse.ok) {
        return NextResponse.json(
            { error: "Riot account not found" },
            { status: accountResponse.status },
        );
    }

    const account = await accountResponse.json();

    const summonerResponse = await fetch(
        `${platformRegions[platform]}/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
        { headers },
    );

    if (!summonerResponse.ok) {
        return NextResponse.json(
            { error: "Summoner profile not found" },
            { status: summonerResponse.status },
        );
    }

    const summoner = await summonerResponse.json();

    const rankedResponse = await fetch(
        `${platformRegions[platform]}/lol/league/v4/entries/by-puuid/${account.puuid}`,
        { headers },
    );

    const ranked = rankedResponse.ok ? await rankedResponse.json() : [];

    return NextResponse.json({
        gameName: account.gameName,
        tagLine: account.tagLine,
        puuid: account.puuid,
        summoner,
        ranked,
    });
}