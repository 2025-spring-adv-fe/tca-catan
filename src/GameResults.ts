import { durationFormatter } from "human-readable";

const formatGameDuration = durationFormatter<string>();

const formatLastPlayed = durationFormatter<string>({
    allowMultiples: ["y", "mo", "d"]
});

//
// Exported interfaces...
//
export interface GameResult {
    winner: string;
    players: string[];
    start: string;
    end: string;
    longestRoadHolder: string | null; // Added to track Longest Road holder
    largestArmyHolder: string | null; // Added to track Largest Army holder
}

export interface LeaderboardEntry {
    wins: number;
    losses: number;
    average: string;
    player: string;
}

export interface GeneralFacts {
    lastPlayed: string;
    totalGames: number;
    shortestGame: string;
    longestGame: string;
}

//
// Exported functions
// 
export const getLeaderboard = (
    results: GameResult[]
): LeaderboardEntry[] => 
    getPreviousPlayers(results)
        .map(
            x => getLeaderboardEntry(
                    results
                    , x
                )
        )
        .sort(
            (a, b) => {
                
                // Some wins with same average, more games makes you higher on the leaderboard...
                if (Number(a.average) === Number(b.average) && a.wins > 0) {
                    return (b.wins + b.losses) - (a.wins + a.losses);
                }

                // No wins, more games makes you lower on the leaderboard...
                if (0 === a.wins && 0 === b.wins) {
                    return (a.wins + a.losses) - (b.wins + b.losses);
                }

                // Non special case, higher average means higher on leaderboard...
                return Number(b.average) - Number(a.average);
            }
        )
;

export const getGeneralFacts = (results: GameResult[]): GeneralFacts => {

    if (results.length === 0) {
        return {
            lastPlayed: "n/a"
            , totalGames: 0
            , shortestGame: "n/a"
            , longestGame: "n/a"
        };
    }

    // Calcs for lastPlayed...
    const now = Date.now();

    const gameEndTimesInMilliseconds = results.map(
        x => now - Date.parse(x.end)
    );

    const lastPlayedInMilliseconds = Math.min(...gameEndTimesInMilliseconds);

    // Calcs for shortest/longest...
    const gameDurationsInMilliseconds = results.map(
        x => Date.parse(x.end) - Date.parse(x.start)
    );

    return {
        lastPlayed: `${formatLastPlayed(lastPlayedInMilliseconds)} ago`
        , totalGames: results.length
        , shortestGame: formatGameDuration(Math.min(...gameDurationsInMilliseconds))
        , longestGame: formatGameDuration(Math.max(...gameDurationsInMilliseconds))
    };
};

export const getSpecialCardHolders = (
    results: GameResult[]
): { longestRoad: string | null; largestArmy: string | null } => {

    const gamesWithLongestRoadWinner = results.filter(
        x => x.longestRoadHolder && x.longestRoadHolder !== "None"
    );

    const mostRecentLongestRoadGameResult = gamesWithLongestRoadWinner.length > 0
        ? gamesWithLongestRoadWinner[gamesWithLongestRoadWinner.length - 1]
        : null
    ;

    const gamesWithLargestArmyWinner = results.filter(
        x => x.largestArmyHolder && x.largestArmyHolder !== "None"
    );

    const mostRecentLargestArmyGameResult = gamesWithLargestArmyWinner.length > 0
        ? gamesWithLargestArmyWinner[gamesWithLargestArmyWinner.length - 1]
        : null
    ;
    return {
        longestRoad: mostRecentLongestRoadGameResult !== null
            ? `${mostRecentLongestRoadGameResult.longestRoadHolder} since ${new Date(mostRecentLongestRoadGameResult.end).toLocaleString()}`
            : null,
        largestArmy: mostRecentLargestArmyGameResult !== null
            ? `${mostRecentLargestArmyGameResult.largestArmyHolder} since ${new Date(mostRecentLargestArmyGameResult.end).toLocaleString()}`
            : null,
    };
};

export const getPreviousPlayers = (
    results: GameResult[]
) => {
    const allPlayersForAllGamesWithDupes = results.flatMap(
        x => x.players
    );

    return [
        ...new Set(allPlayersForAllGamesWithDupes)
    ].sort(
        (a, b) => a.localeCompare(b)
    );
};

export const getGamesByMonth = (results: GameResult[]): Array<[string, number]> => {

    const gameStartMonths = results.map(
        x => new Date(x.start).toLocaleString(
            'default'
            , {
                month: 'short'
            }
        )
    );

    const groupedStartMonths = Map.groupBy(
        gameStartMonths
        , x => x
    );

    console.log(
        gameStartMonths
        , groupedStartMonths
    );

    return [
        'Jan'
        , 'Feb'
        , 'Mar'
        , 'Apr'
        , 'May'
        , 'Jun'
        , 'Jul'
        , 'Aug'
        , 'Sep'
        , 'Oct'
        , 'Nov'
        , 'Dec'
    ].map(
        x => [
            x 
            , groupedStartMonths.get(x)?.length ?? 0
        ]
    );
};

// 
// Helper functions
// 
const getLeaderboardEntry = (
    results: GameResult[]
    , player: string
): LeaderboardEntry => {

    const totalGamesForPlayer = results.filter(
        x => x.players.some(
            y => player === y
        )
    ).length;

    const wins = results.filter(
        x => x.winner === player 
    ).length;

    const avg = totalGamesForPlayer > 0
        ? wins / totalGamesForPlayer
        : 0
    ;

    return {
        wins: wins
        , losses: totalGamesForPlayer - wins
        , average: avg.toFixed(3)
        , player: player
    };
};

