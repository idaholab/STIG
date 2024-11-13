enum STATE {
  VALUE,
  OPEN_OBJECT,
  PARSE_OBJECT,
  OPEN_ARRAY,
  PARSE_ARRAY,
  OPEN_KEY,
  KEY_VALUE,
  STRING,
  TRUE,
  TRUE2,
  TRUE3,
  FALSE,
  FALSE2,
  FALSE3,
  FALSE4,
  NULL,
  NULL2,
  NULL3,
  NUMBER_DECIMAL_POINT,
  NUMBER_NEGATIVE,
  NUMBER_DIGIT,
  STRING_VALUE,
}

const Char = {
  tab                 : 0x09,     // \t
  lineFeed            : 0x0A,     // \n
  carriageReturn      : 0x0D,     // \r
  space               : 0x20,     // " "

  doubleQuote         : 0x22,     // "
  plus                : 0x2B,     // +
  comma               : 0x2C,     // ,
  minus               : 0x2D,     // -
  period              : 0x2E,     // .

  _0                  : 0x30,     // 0
  _9                  : 0x39,     // 9

  colon               : 0x3A,     // :

  E                   : 0x45,     // E

  openBracket         : 0x5B,     // [
  backslash           : 0x5C,     // \
  closeBracket        : 0x5D,     // ]

  a                   : 0x61,     // a
  b                   : 0x62,     // b
  e                   : 0x65,     // e 
  f                   : 0x66,     // f
  l                   : 0x6C,     // l
  n                   : 0x6E,     // n
  r                   : 0x72,     // r
  s                   : 0x73,     // s
  t                   : 0x74,     // t
  u                   : 0x75,     // u

  openBrace           : 0x7B,     // {
  closeBrace          : 0x7D,     // }
};

const stringTokenPattern = /[\\"\n]/g;

type InProgress = { key: string; val: any; };

function isWhitespace(c: number) {
  return c === Char.carriageReturn || c === Char.lineFeed || c === Char.space || c === Char.tab;
}

export class JSONStream {
  private state = STATE.VALUE;
  private state_stack: STATE[] = [];
  private value_stack: InProgress[] = [];
  private buffer = "";
  private exponent = false;
  private fraction = false;
  private slashed  = false;
  private unicodeI = 0;
  private unicodeS = "";
  private top    = -1;

  private call(s: STATE, ret: STATE) {
    this.state_stack.push(ret);
    this.state = s;
  }

  private ret() {
    this.state = this.state_stack.pop() || STATE.VALUE;
  }

  private closevalue(value: unknown) {
    const { key, val: parent } = this.value_stack[this.top];
    this.ret();
    if (Array.isArray(parent)) {
      const index = parent.length;
      parent.push(value);
      return { depth: this.value_stack.length, parent, key: index, value };
    }
    parent[key] = value;
    return { depth: this.value_stack.length, parent, key, value };
  }

  private closenested() {
    const { val: obj } = this.value_stack.pop()!;
    this.top--;
    return this.closevalue(obj);
  }

  public * end() {
    let ret: unknown;
    switch(this.state) {
      case STATE.NUMBER_DIGIT:
      case STATE.NUMBER_NEGATIVE:
      case STATE.NUMBER_DECIMAL_POINT:
        ret = parseFloat(this.buffer);
        break;
      case STATE.STRING:
      case STATE.STRING_VALUE:
        ret = this.buffer;
        break;
      case STATE.TRUE:
      case STATE.TRUE2:
      case STATE.TRUE3:
        ret = true;
        break;
      case STATE.FALSE:
      case STATE.FALSE2:
      case STATE.FALSE3:
      case STATE.FALSE4:
        ret = false;
        break;
      case STATE.NULL:
      case STATE.NULL2:
      case STATE.NULL3:
        ret = null;
        break;
      case STATE.OPEN_OBJECT:
        ret = {};
        break;
      case STATE.OPEN_ARRAY:
        ret = [];
        break;
      default:
        ret = this.value_stack.pop()?.val;
    }

    while (this.top > -1) {
      yield this.closevalue(ret);
      ret = this.value_stack.pop()?.val;
      this.top--;
    }

    this.state_stack = [];
    this.state = STATE.VALUE;
    this.fraction = false;
    this.exponent = false;
  }

  public * parse(chunk: string | null) {
    if (chunk === null) {
      yield * this.end();
      return;
    }

    const l = chunk.length;    
    char: for (let i = 0;i<l;) {
      let c = chunk.charCodeAt(i++);
      state: for (;;) {
        switch (this.state) {
  
        case STATE.VALUE:
          while (isWhitespace(c)) {
            if (i === l) break char;
            c = chunk.charCodeAt(i++);
          }
                if(c === Char.openBrace) this.state = STATE.OPEN_OBJECT;
          else if(c === Char.openBracket) this.state = STATE.OPEN_ARRAY;
          else if(c === Char.t) this.state = STATE.TRUE;
          else if(c === Char.f) this.state = STATE.FALSE;
          else if(c === Char.n) this.state = STATE.NULL;
          else if(c === Char.doubleQuote) {
            this.buffer = "";
            this.call(STATE.STRING, STATE.STRING_VALUE);
          } else if(c === Char.minus) {
            this.fraction = false;
            this.buffer = "-";
            this.state = STATE.NUMBER_NEGATIVE;
          } else if(c === Char._0) {
            this.buffer = '0';
            this.state = STATE.NUMBER_DECIMAL_POINT;
          } else if(c === Char.period) {
            this.buffer = '.';
            this.fraction = true;
            this.state = STATE.NUMBER_DIGIT;
          } else if(Char._0 < c && c <= Char._9) {
            this.buffer = String.fromCharCode(c);
            this.state = STATE.NUMBER_DIGIT;
          } else throw new Error("Bad value");
          continue char;

        case STATE.STRING_VALUE:
          yield this.closevalue(this.buffer);
          continue state;

        case STATE.OPEN_OBJECT:
          while (isWhitespace(c)) {
            if (i === l) break char;
            c = chunk.charCodeAt(i++);
          }
          if(c === Char.closeBrace) {
            // Empty Object
            yield this.closevalue({});
            continue char;
          }
          
          // Open Object      
          this.value_stack.push({ key: "", val: {} });
          this.top++;

          this.state = STATE.OPEN_KEY;
          //fallthrough

        case STATE.OPEN_KEY:
          while (isWhitespace(c)) {
            if (i === l) break char;
            c = chunk.charCodeAt(i++);
          }
          if(c !== Char.doubleQuote)
            throw new Error("Malformed object key should start with \"");
          this.buffer = "";
          this.call(STATE.STRING, STATE.KEY_VALUE);
          continue char;

        case STATE.KEY_VALUE:
          while (isWhitespace(c)) {
            if (i === l) break char;
            c = chunk.charCodeAt(i++);
          }
          if (c !== Char.colon) throw new Error("Malformed object; key must be followed by colon.");
          
          this.value_stack[this.top].key = this.buffer;
          this.call(STATE.VALUE, STATE.PARSE_OBJECT);
          continue char;

        case STATE.PARSE_OBJECT:
          while (isWhitespace(c)) {
            if (i === l) break char;
            c = chunk.charCodeAt(i++);
          }
          if (c === Char.closeBrace) yield this.closenested();
          else if(c === Char.comma) this.state = STATE.OPEN_KEY;
          else throw new Error('Bad object');
          continue char;
        
        case STATE.OPEN_ARRAY:
          while (isWhitespace(c)) {
            if (i === l) break char;
            c = chunk.charCodeAt(i++);
          }
          if(c === Char.closeBracket) {
            // Empty Array
            yield this.closevalue([]);
            continue char;
          }
          
          // Open Array
          this.value_stack.push({ key: "", val: [] });
          this.top++;

          this.call(STATE.VALUE, STATE.PARSE_ARRAY);
          if (!isWhitespace(c)) continue state;
          continue char;
  
        case STATE.PARSE_ARRAY:
          while (isWhitespace(c)) {
            if (i === l) break char;
            c = chunk.charCodeAt(i++);
          }
          if(c === Char.comma) {
            this.call(STATE.VALUE, STATE.PARSE_ARRAY);
          } else if (c === Char.closeBracket) {
            yield this.closenested();
          } else throw new Error('Bad array');
          continue char;
  
        case STATE.STRING: {
          let starti = i-1;
          let slashed = this.slashed;
          let unicodeI = this.unicodeI;
          STRING_BIGLOOP: for(;;) {
            // zero means "no unicode active". 1-4 mean "parse some more". end after 4.
            while (unicodeI > 0) {
              this.unicodeS += String.fromCharCode(c);
              c = chunk.charCodeAt(i++);
              if (unicodeI === 4) {
                this.buffer += String.fromCharCode(parseInt(this.unicodeS, 16));
                unicodeI = 0;
                starti = i-1;
              } else {
                unicodeI++;
              }

              if (!c) break STRING_BIGLOOP;
            }
            if (c === Char.doubleQuote && !slashed) {
              this.buffer += chunk.substring(starti, i-1);
              this.ret();
              break;
            }
            if (c === Char.backslash && !slashed) {
              slashed = true;
              this.buffer += chunk.substring(starti, i-1);
              c = chunk.charCodeAt(i++);
              if (!c) break;
            }
            if (slashed) {
              slashed = false;
                    if (c === Char.n) { this.buffer += '\n'; }
              else if (c === Char.r) { this.buffer += '\r'; }
              else if (c === Char.t) { this.buffer += '\t'; }
              else if (c === Char.f) { this.buffer += '\f'; }
              else if (c === Char.b) { this.buffer += '\b'; }
              else if (c === Char.u) {
                // \uxxxx.
                unicodeI = 1;
                this.unicodeS = '';
              } else {
                this.buffer += String.fromCharCode(c);
              }
              c = chunk.charCodeAt(i++);
              starti = i-1;
              if (!c) break;
              else continue;
            }
  
            stringTokenPattern.lastIndex = i;
            const reResult = stringTokenPattern.exec(chunk);
            if (reResult === null) {
              i = chunk.length+1;
              this.buffer += chunk.substring(starti, i-1);
              break;
            }
            i = reResult.index+1;
            c = chunk.charCodeAt(reResult.index);
            if (!c) {
              this.buffer += chunk.substring(starti, i-1);
              break;
            }
          }
          this.slashed = slashed;
          this.unicodeI = unicodeI;
          continue char;
        }
  
        case STATE.TRUE:
          if (c === Char.r) this.state = STATE.TRUE2;
          else throw new Error(`Parsing 'true', expected 'r', got '${String.fromCharCode(c)}'.`);
          if (i === l) break char;
          c = chunk.charCodeAt(i++);
          // fallthrough
  
        case STATE.TRUE2:
          if (c === Char.u) this.state = STATE.TRUE3;
          else throw new Error(`Parsing 'true', expected 'u', got '${String.fromCharCode(c)}'.`);
          if (i === l) break char;
          c = chunk.charCodeAt(i++);
          // fallthrough
  
        case STATE.TRUE3:
          if(c === Char.e) this.closevalue(true);
          else throw new Error(`Parsing 'true', expected 'e', got '${String.fromCharCode(c)}'.`);
          continue char;
  
        case STATE.FALSE:
          if (c === Char.a) this.state = STATE.FALSE2;
          else throw new Error(`Parsing 'false', expected 'a', got '${String.fromCharCode(c)}'.`);
          if (i === l) break char;
          c = chunk.charCodeAt(i++);
          // fallthrough
  
        case STATE.FALSE2:
          if (c === Char.l) this.state = STATE.FALSE3;
          else throw new Error(`Parsing 'false', expected 'l', got '${String.fromCharCode(c)}'.`);
          if (i === l) break char;
          c = chunk.charCodeAt(i++);
          // fallthrough
  
        case STATE.FALSE3:
          if (c === Char.s) this.state = STATE.FALSE4;
          else throw new Error(`Parsing 'false', expected 's', got '${String.fromCharCode(c)}'.`);
          if (i === l) break char;
          c = chunk.charCodeAt(i++);
          // fallthrough
  
        case STATE.FALSE4:
          if (c === Char.e) yield this.closevalue(false);
          else throw new Error(`Parsing 'false', expected 'e', got '${String.fromCharCode(c)}'.`);
          continue char;
  
        case STATE.NULL:
          if (c === Char.u) this.state = STATE.NULL2;
          else throw new Error(`Parsing 'null', expected 'u', got '${String.fromCharCode(c)}'.`);
          if (i === l) break char;
          c = chunk.charCodeAt(i++);
          // fallthrough
  
        case STATE.NULL2:
          if (c === Char.l) this.state = STATE.NULL3;
          else throw new Error(`Parsing 'null', expected 'l', got '${String.fromCharCode(c)}'.`);
          if (i === l) break char;
          c = chunk.charCodeAt(i++);
          // fallthrough
  
        case STATE.NULL3:
          if(c === Char.l) yield this.closevalue(null);
          else throw new Error(`Parsing 'null', expected 'l', got '${String.fromCharCode(c)}'.`);
          continue char;

        case STATE.NUMBER_NEGATIVE:
          if (c === Char._0) {
            this.state = STATE.NUMBER_DECIMAL_POINT;
            continue char;
          }
          this.state = STATE.NUMBER_DIGIT;
          continue state;

        case STATE.NUMBER_DECIMAL_POINT:
          if(c !== Char.period) throw new Error(`Parsing number, expected '.', got '${String.fromCharCode(c)}'.`);
          this.buffer += ".";
          this.fraction = true;
          if (i === l) break char;
          c = chunk.charCodeAt(i++);
          //fallthrough
  
        case STATE.NUMBER_DIGIT:
          for (;;) {
            if (Char._0 <= c && c <= Char._9) {
              this.buffer += String.fromCharCode(c);
            } else if (c === Char.period) {
              if(this.fraction)
                throw new Error('Invalid number has two dots.');
              this.buffer += ".";
              this.fraction = true;
            } else if (c === Char.e || c === Char.E) {
              if(this.exponent)
                throw new Error('Invalid number has two exponents.');
              this.buffer += "e";
              this.exponent = true;
            } else if (c === Char.plus || c === Char.minus) {
              if(!this.buffer.endsWith('e'))
                throw new Error(`Invalid symbol in number: '${String.fromCharCode(c)}'.`);
              this.buffer += String.fromCharCode(c);
            } else if (c === Char.n) {
              if(this.fraction || this.exponent)
                throw new Error("Invalid symbol in number: 'n'.");
                yield this.closevalue(BigInt(this.buffer));
                this.exponent = false;
                this.fraction = false;
                continue char;
            } else {
              yield this.closevalue(parseFloat(this.buffer));
              this.exponent = false;
              this.fraction = false;
              continue state;
            }
            if (i === l) break char;
            c = chunk.charCodeAt(i++);
          }
  
        default:
          throw new Error("Unknown state: " + STATE[this.state]);
        }
      }
    }
  }
}