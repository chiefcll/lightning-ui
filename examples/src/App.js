import { Lightning } from "wpe-lightning-sdk";
import FocusManager from "./components/FocusManager/FocusManager";

export default class App extends Lightning.Component {
  static _template() {
    return {
      x: 20,
      y: 20,
      Column: Column({
        children: [
          Row(),
          Row({ y: 100 }),
          Row({ y: 200 })
        ]
      })
    };
  }
  _init() {
    this._setState("Column");
  }

  static _states() {
    return [
      class Column extends this {
        _getFocused() {
          return this.tag("Column");
        }
      },
    ];
  }
}

function Row({ y=0 }={}) {
  return {
    type: FocusManager,
    direction: 'row',
    y,
    children: [
      { type: Button, buttonText: "Left" },
      { x: 200, type: Button, buttonText: "Center" },
      { x: 400, type: Button, buttonText: "Right" },
    ]
  };
}

function Column({ children }) {
  return {
    type: FocusManager,
    direction: 'column',
    children
  }
}

class Button extends lng.Component {
  static _template() {
    return {
      color: 0xff1f1f1f,
      texture: lng.Tools.getRoundRect(150, 40, 4),
      Label: {
        x: 75,
        y: 22,
        mount: 0.5,
        color: 0xffffffff,
        text: { fontSize: 20 },
      },
    };
  }
  _init() {
    this.tag("Label").patch({ text: { text: this.buttonText } });
  }
  _focus() {
    this.color = 0xffffffff;
    this.tag("Label").color = 0xff1f1f1f;
  }
  _unfocus() {
    this.color = 0xff1f1f1f;
    this.tag("Label").color = 0xffffffff;
  }
}
