export const events = {
    finishGameEvent: new CustomEvent('finish_game'),
    restartGameEvent: new CustomEvent('restart_game'),
    decreaseLivesEvent: new CustomEvent('decrease_lives'),
    increaseScoreEvent: new CustomEvent('increase_score'),
    runAwayEvent: new CustomEvent('run_away'),
}
