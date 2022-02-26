const cardData = {
  ...Set1,
  ...Set2,
  ...Set3,
}


const Set1 = [
  {
    id: "dr1",
    name: "Dark Ritual",
    color: Colors.Black,
    cost: {
      w: 0,
      b: 1,
      r: 0,
      g: 0,
      u: 0,
      c: 0,
      a: 0,
    },
    speed: CastSpeed.Interrupt,
    actions: [
      {
        type: CastActions.AddMana,
        params: {
          b: 3
        }
      }
    ]
  },
  {
    id: "jd1",
    name: "Juzam Djinn",
    color: Colors.Black,
    cost: {
      w: 0,
      b: 2,
      r: 0,
      g: 0,
      u: 0,
      c: 2,
      a: 0,
    },
    speed: CastSpeed.Sorcery,
    actions: [
      {
        type: CastActions.SummonCreature,
        params: {
          power: 5,
          toughness: 5,
        },
      },
      {
        type: CastActions.AddUpkeepRecurring,
        params: {
          type: UpkeepActions.SubtractCurrentPlayerLife,
          params: {
            LifeTotal: -1,
          }
        }
      }
    ]
  }
]