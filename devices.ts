interface Specs {
  width: number;
  height: number;
  energy: number;
  cost: number;
  released?: number;
}

interface Meta<I> {
  id: I;
  name: string;
  label: string;
}

export interface Grid {
  color: string;
  /**
   * Number of tracks the unit should span
   * A good default is the unit's width / 10
   */
  column: {
    end: number;
  };
}

interface UI {
  input: {
    disabled: boolean;
  };
  grid: Grid;
}

type Devices<D extends string> = {
  [d in D]: {
    specs: Specs;
    meta: Meta<D>;
    ui: UI;
  };
};

type Batteries = "megapackxl" | "megapack2" | "megapack" | "powerpack";

type Transformer = "transformer";

export type DeviceNames = Batteries | Transformer;

export const batteries: Devices<DeviceNames> = {
  megapackxl: {
    specs: {
      width: 40,
      height: 10,
      energy: 4,
      cost: 120000,
      released: 2022,
    },
    meta: {
      id: "megapackxl",
      name: "megapackxl",
      label: "MegapackXL",
    },
    ui: {
      input: {
        disabled: false,
      },
      grid: {
        color: "#1976d2",
        column: {
          end: 4,
        },
      },
    },
  },
  megapack2: {
    specs: {
      width: 30,
      height: 10,
      energy: 3,
      cost: 80000,
      released: 2021,
    },
    meta: {
      id: "megapack2",
      name: "megapack2",
      label: "Megapack2",
    },
    ui: {
      input: {
        disabled: false,
      },
      grid: {
        color: "#9c27b0",
        column: {
          end: 3,
        },
      },
    },
  },
  megapack: {
    specs: {
      width: 30,
      height: 10,
      energy: 2,
      cost: 50000,
      released: 2005,
    },
    meta: {
      id: "megapack",
      name: "megapack",
      label: "Megapack",
    },
    ui: {
      input: {
        disabled: false,
      },
      grid: {
        color: "#2e7d32",
        column: {
          end: 3,
        },
      },
    },
  },
  powerpack: {
    specs: {
      width: 10,
      height: 10,
      energy: 1,
      cost: 10000,
      released: 2000,
    },
    meta: {
      id: "powerpack",
      name: "powerpack",
      label: "Powerpack",
    },
    ui: {
      input: {
        disabled: false,
      },
      grid: {
        color: "#ed6c02",
        column: {
          end: 1,
        },
      },
    },
  },
  transformer: {
    specs: {
      width: 10,
      height: 10,
      energy: -0.5,
      cost: 10000,
      released: undefined,
    },
    meta: {
      id: "transformer",
      name: "transformer",
      label: "Transformer",
    },
    ui: {
      input: {
        disabled: true,
      },
      grid: {
        color: "#757575",
        column: {
          end: 1,
        },
      },
    },
  },
};
