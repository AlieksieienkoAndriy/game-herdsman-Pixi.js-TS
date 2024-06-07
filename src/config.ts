export const CONFIG = {
  canvas: {
    width: 1440,
    height: 810
  },
  game: {
    textStyle: {
      fontFamily: "DoHyeon",
      fontSize: 32,
      fill: "white",
    },

    herd: {
      groupLimit: 5,
      sheepAmount: {
        from: 10,
        to: 20
      },
      distance: 50
    },

    herdsman: {
      startPos: {
        x: 1300,
        y: 800
      },      
      scale: 0.25,
      walkDuration: 1000
    },

    sheep: {
      scale: 1.5,
      walkDuration: 1000

    }
  }
}