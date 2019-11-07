import React from 'react'
import { Container, Wrapper, Status } from './game.styles'
import { CameraView } from '../cameraView'
import { GameText } from '../gameText'

interface State {
  startTime: number | null
  wpm: number
  progress: number
}

const appReducer = (state, action): State => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        startTime: action.payload
      }
    case 'MAKE_PROGRESS':
      return {
        ...state,
        wpm: action.payload.wpm,
        progress: action.payload.progress
      }
    default:
      throw new Error('Wrong action provided to the appReducer')
  }
}

function Game({ data }: { data: GameInstance }): JSX.Element {
  const [state, dispatch] = React.useReducer(appReducer, {
    startTime: null,
    wpm: 0,
    progress: 0
  })

  const handleProgress = (current, total): void => {
    dispatch({
      type: 'MAKE_PROGRESS',
      payload: {
        progress: current / total,
        wpm: current / 5 / ((Date.now() - (state.startTime || 0)) / 60000)
      }
    })
  }

  return (
    <Wrapper>
      <Container>
        <GameText
          onStart={(): void => dispatch({ type: 'START_GAME', payload: Date.now() })}
          exercise={data!.exercise}
          onProgress={handleProgress}
        />
        <Status>
          {`${(state.progress * 100).toFixed(0)}% completed ${state.wpm ? `, ${state.wpm.toFixed(0)} WPM` : ''}`}
        </Status>
        <CameraView />
      </Container>
    </Wrapper>
  )
}

export default Game
