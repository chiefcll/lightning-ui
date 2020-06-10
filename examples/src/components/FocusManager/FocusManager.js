/**
 * FocusManager Component
 *
 * Container to set focus on elements with key[Up/Down] or key[Left/Right]
 */
import lng from 'wpe-lightning';

export default class FocusManager extends lng.Component {
  _init() {
    this.direction = this.direction || 'row';

    if (this.direction === 'column') {
      this._setState('Column');
    } else {
      this._setState('Row');
    }
    this.selectedIndex = this.selectedIndex || 0;
  }

  get loading() {
    return !this.selected;
  }

  get selected() {
    return this.children[this.selectedIndex];
  }

  set selectedIndex(index) {
    let previousIndex = this.selectedIndex;

    if (index > 0) {
      if (index < this.children.length) {
        this._selectedIndex = index;
      } else {
        this._selectedIndex = this.children.length - 1;
      }
    } else {
      this._selectedIndex = 0;
    }

    this._refocus();
    if (this.selected) {
      let direction = previousIndex < this._selectedIndex ? 'next' : 'previous';
      this.signal('selectedChange', this.selected, this.children[previousIndex], direction);
    }
  }

  get selectedIndex() {
    return this._selectedIndex || 0;
  }

  selectPrevious() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      return true;
    }
    else if (this.wrapSelected)  {
      this.selectedIndex = this.children.length - 1;
      return true;
    }
    return false;
  }

  selectNext() {
    if (this.selectedIndex < this.children.length - 1) {
      this.selectedIndex++;
      return true;
    }
    else if (this.wrapSelected)  {
      this.selectedIndex = 0;
      return true;
    }
    return false;
  }

  _getFocused() {
    let selected = this.selected;
    return selected && selected.focusRef ? selected.tag(selected.focusRef) : selected;
  }

  get _size() {
    return this.children.length;
  }

  get _hasNext() {
    return this.selectedIndex < this._size - 1;
  }

  get _hasPrevious() {
    return this.selectedIndex > 0;
  }

  get _nextTitle() {
    return this._hasNext && this.getElmText(this.children[this.selectedIndex + 1]);
  }

  get _previousTitle() {
    return this._hasPrevious && this.getElmText(this.children[this.selectedIndex - 1]);
  }

  getElmText(elm) {
    return elm && elm.accessibilityText || elm.title;
  }

  static _states() {
    return [
      class Row extends this {
        _handleLeft() {
          return this.selectPrevious();
        }

        _handleRight() {
          return this.selectNext();
        }
      },

      class Column extends this {
        _handleUp() {
          return this.selectPrevious();
        }

        _handleDown() {
          return this.selectNext();
        }
      }
    ];
  }
}
