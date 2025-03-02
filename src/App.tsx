import './App.css'
import {
  HashRouter
  , Routes
  , Route
} from 'react-router';
import { Home } from './Home'
import { Setup } from './Setup'
import { Play } from './Play'
import { useState } from 'react';
import { GameResult, getLeaderboard } from './GameResults';

const dummyGameResults: GameResult[] = [
  {
      winner: "Hermione"
      , players: [
          "Hermione"
          , "Harry"
          , "Ron"
      ]
      
  }
  , {
      winner: "Ron"
      , players: [
          "Hermione"
          , "Ron"
      ]
  }
  , {
      winner: "Larry"
      , players: [
          "Larry"
          , "Curly"
          , "Moe"
      ]
  }
  , {
      winner: "Harry"
      , players: [
          "Curly"
          , "Harry"
      ]
  }
  , {
      winner: "Ron"
      , players: [
          "Ron"
          , "Voldemort"
      ]
  }
  , {
      winner: "Voldemort"
      , players: [
          "Ron"
          , "Voldemort"
      ]
  }
];

const App = (
) => {

  console.log(
    "App Component Func Called ! ! !"
  );

  // 
  // Hooks...
  // 
  const [gameResults, setGameResults] = useState<GameResult[]>(dummyGameResults);
  // const [gameResults, setGameResults] = useState<GameResult[]>([]);

  // 
  // Other (not hooks)
  // 
  const addNewGameResult = (addNewGameResult: GameResult) => setGameResults(
    [
      ...gameResults
      , addNewGameResult
    ]
  );

  return (
    <>
      <div
        className='p-4'
      >
        <HashRouter>
          <Routes>
            <Route 
              path='/'
              element={
                <Home 
                  totalGameCount={gameResults.length}
                  leaderboardData={
                    getLeaderboard(gameResults)
                  }
                />
              }
            />

            <Route 
              path='/setup'
              element={
                <Setup 
                  totalGameCount={gameResults.length}
                />
              }
            />
            <Route 
              path='/play'
              element={
                <Play 
                 totalGameCount={gameResults.length}
                 addNewGameResult={addNewGameResult}
                />
              }
            />
          </Routes>
        </HashRouter>
      </div>
    </>
  )
}

export default App
