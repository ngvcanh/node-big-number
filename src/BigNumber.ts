import { BigNumberData, BigNumberFormatOptions } from "./types";

function addBigNumber(big1: BigNumber | BigNumberData, big2: BigNumber | BigNumberData): BigNumber{
  return BigNumber.from(0);
}

/**
 * - INTERNAL FUNCTION
 * - Ensure that `big1` greater than `big2`
 */
export function minusGreaterThan(big1: BigNumber | BigNumberData, big2: BigNumber | BigNumberData): BigNumber{
  const _big1 = BigNumber.from(big1), _big2 = BigNumber.from(big2);

  let { int: int1, dec: dec1, negative: neg1 } = _big1
  , { int: int2, dec: dec2, negative: neg2 } = _big2;

  // negative minus negative
  if (neg1 && neg2) return minusGreaterThan(_big2.abs(), _big1.abs());

  // positive minus negative
  if (neg2 && !neg1) return addBigNumber(_big1, _big2.abs());

  // positive minus positive
  let dec = '', int = '', borrow = false;

  if (dec2 === '0' || dec2 === ''){
    dec = dec1;
  }
  else{
    const max = Math.max(dec1.length, dec2.length);
    
    for (let i = max - 1; i >= 0; i--){
      let char1 = parseInt(dec1[i] ?? '0'), char2 = parseInt(dec2[i] ?? '0');
      
      if (borrow){
        char2 += 1;
        borrow = false;
      }

      if (char1 < char2){
        char1 += 10;
        borrow = true;
      }

      dec = (char1 - char2) + dec;
    }
  }

  for (let i = int1.length - 1; i >= 0; i++){
    let char1 = parseInt(int1[i]), char2 = parseInt(int2[1] ?? '0');

    if (borrow){
      char2 += 1;
      borrow = false;
    }

    if (char1 < char2){
      char1 += 10;
      borrow = true;
    }

    int = (char1 - char2) + int;
  }

  return BigNumber.from(`${ int }.${ dec }`);
}

function minus(big1: BigNumber | BigNumberData, big2: BigNumber | BigNumberData){
  const _big1 = BigNumber.from(big1), _big2 = BigNumber.from(big2);

  // A - B with B = 0 => return A
  if (_big2.value === '0' || _big2.value === '') return _big1;
  
  // A - B with A = 0: 
  //  If B = 0 then return 0;
  //  Else revert sign of B;
  if (_big1.value === '0' || _big1.value === ''){
    if (_big2.value === '0' || _big2.value === '') return BigNumber.from(0);
    if (_big2.negative) return _big2.abs();
    return BigNumber.from('-' + _big2.value);
  }
  
  // A - B with A = B return 0
  if (_big1.eq(big2)) return BigNumber.from(0);

  // A - B with A > B
  if (_big1.gt(big2)) return minusGreaterThan(_big1, _big2);

  // A - B with A < B and A * B > 0
  if (_big1.sameSign(_big2)) return minusGreaterThan(_big2, _big1);

  // A - B with A < B and A * B < 0
  return BigNumber.from(addBigNumber(_big1.abs(), _big2).value);
}

function createBuckets(bigs: Array<BigNumber | BigNumberData>, size: number){
    // let min = bigs[0], max = bigs[0];

    // for (let i = 1; i < bigs.length; i++) {
    //   if (BigNumber.from(bigs[i]).lt(min)){
    //      min = bigs[i];
    //   }
    //   else if (BigNumber.from(bigs[i]).gt(max)){
    //     max = bigs[i];
    //   }
    // }
    // const count = Math.floor((max - min) / bucketSize) + 1;

    // // initialize each bucket (a multidimensional array)
    // const buckets = [];
    // for (let i = 0; i < bucketCount; i++) {
    //     buckets[i] = [];
    // }

    // // distribute elements into buckets
    // for (let i = 0; i < arr.length; i++) {
    //     const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
    //     buckets[bucketIndex].push(arr[i]);
    // }
    // return buckets;
}

const SORT = {
  bubble(bigs: Array<BigNumber | BigNumberData>){
    const length = bigs.length;

    for (let i = 0; i < length - 1; i++){
      let swapped = Boolean(true);
      
      for (let j = 0; j < length - i - 1; j++){
        if (BigNumber.from(bigs[j]).gt(bigs[j + 1])){
          const temp = bigs[j];
          bigs[j] = bigs[j + 1];
          bigs[j + 1] = temp;
          swapped = false;
        }
      }
    
      if (swapped === true) break;
    }

    return bigs;
  },
  selection(bigs: Array<BigNumber | BigNumberData>){
    const length = bigs.length;

    for (let step = 0; step < length - 1; step++) {
      let min_idx = step;

      for (let i = step + 1; i < length; i++) {
        if (BigNumber.from(bigs[i]).lt(bigs[min_idx])) min_idx = i;
      }

      let temp = bigs[step];
      bigs[step] = bigs[min_idx];
      bigs[min_idx] = temp;
    }

    return bigs;
  },
  insertion(bigs: Array<BigNumber | BigNumberData>){
    const length = bigs.length;
    
    for (let step = 1; step < length; step++) {
      const key = bigs[step];
      let j = step - 1;

      while (j >= 0 && BigNumber.from(key).lt(bigs[j])){
        bigs[j + 1] = bigs[j];
        --j;
      }

      bigs[j + 1] = key;
    }

    return bigs;
  },
  quick(){},
  radix(){},
  merge(bigs: Array<BigNumber | BigNumberData>){
    // if (bigs.length > 1) {
    //     const { length } = bigs;
    //     const middle = Math.floor(length / 2);
    //     const left = SORT.merge(bigs.slice(0, middle), compare);
    //     const right = SORT.merge(bigs.slice(middle, length), compare);
    //     arr = merge(left, right, compare);
    // }
    // return arr;
  },
  heap(){

  },
  shaker(){

  },
  shell(){

  },
  counting(){

  },
  binaryinsetion(){

  },
  interchange(){

  },

  /**
   * Best case scenario: complexity = O(N + k)
   * Worst case scenario: complexity = O(N^2)
   */
  bucket(){

  }
}

class BigNumber{

  private _value: BigNumberData = '';

  private _integer: string = '';

  private _decimal: string = '';

  private _nevigate: boolean = false;

  static MAX_INTEGER = Number.MAX_SAFE_INTEGER;

  static MIN_INTEGER = Number.MIN_SAFE_INTEGER;

  static MAX_VALUE = Number.MAX_VALUE;

  static MIN_VALUE = Number.MIN_VALUE;

  constructor(value?: BigNumberData){
    if (value !== undefined){
      const val = this.revert(value.toString());
      
      if (typeof val === 'number'){
        if (!isNaN(val)){
          this._value = val;
        }
      }
      else{
        this._value = val;
      }
    }

    [ this._integer, this._decimal ] = this._value.toString().split('.');
    if (this._decimal === undefined) this._decimal = '';
    
    this._nevigate = this._integer.startsWith('-');
    this._integer = this._integer.replace(/^-/, '').replace(/^0+/, '0')
  }

  get value(){
    return this._value;
  }

  get int(){
    return this._integer;
  }

  get dec(){
    return this._decimal;
  }

  get negative(){
    return this._nevigate;
  }

  sameSign(big: BigNumber | BigNumberData){
    const _big = BigNumber.from(big);
    return (this.negative && _big.negative) || (!this.negative && _big.negative);
  }

  eq(big: BigNumber | BigNumberData){
    const _big = BigNumber.from(big);
    let { int: _bigInt, dec: _bigDec } = _big, { int: _valInt, dec: _valDec } = this;
    
    if (
      (this.negative && !_big.negative) || 
      (!this.negative && _big.negative)
    ) return false;

    _valInt = _valInt.replace('-', '');
    _bigInt = _bigInt.replace('-', '');

    if (_valInt.length !== _bigInt.length) return false;

    for (let i = 0; i < _bigInt.length; i++){
      if (parseInt(_bigInt[i]) !== parseInt(_valInt[i])) return false;
    }

    if (_bigDec === '' && _valDec === '') return true;
    if (_bigDec === '' || _valDec === '') return false;
    if (_bigDec.length !== _valDec.length) return false;

    for (let i = 0; i < _bigDec.length; i++){
      if (parseInt(_bigDec[i]) !== parseInt(_valDec[i])) return false;
    }

    return true;
  }

  lt(big: BigNumber | BigNumberData){
    const _big = BigNumber.from(big)
    let { int: _bigInt, dec: _bigDec } = _big, { int: _valInt, dec: _valDec } = this;

    if (this.negative && !_big.negative) return true;
    if (!this.negative && _big.negative) return false;
    
    if (_bigInt.length < _valInt.length) return this.negative;
    if (_bigInt.length > _valInt.length) return !this.negative;

    for (let i = 0; i < _bigInt.length; i++){
      if (parseInt(_bigInt[i]) < parseInt(_valInt[i])) return this.negative;
      if (parseInt(_bigInt[i]) > parseInt(_valInt[i])) return !this.negative;
    }

    if (_bigDec === '' && _valDec === '') return false;
    if (_bigDec === '') return false;
    if (_valDec === '') return true;

    const length = Math.min(_bigDec.length, _valDec.length);

    for (let i  = 0; i < length; i++){
      if (parseInt(_bigDec[i]) < parseInt(_valDec[i])) return this.negative;
      if (parseInt(_bigDec[i]) > parseInt(_valDec[i])) return !this.negative;
    }

    if (_bigDec.length < _valDec.length) return this.negative;
    if (_bigDec.length > _valDec.length) return !this.negative;
    
    return false;
  }

  lte(big: BigNumber | BigNumberData){
    const _big = BigNumber.from(big)
    let { int: _bigInt, dec: _bigDec } = _big, { int: _valInt, dec: _valDec } = this;

    if (this.negative && !_big.negative) return true;
    if (!this.negative && _big.negative) return false;

    if (_bigInt.length < _valInt.length) return this.negative;
    if (_bigInt.length > _valInt.length) return !this.negative;

    for (let i = 0; i < _bigInt.length; i++){
      if (parseInt(_bigInt[i]) < parseInt(_valInt[i])) return this.negative;
      if (parseInt(_bigInt[i]) > parseInt(_valInt[i])) return !this.negative;
    }

    if (_bigDec === '' && _valDec === '') return true;
    if (_bigDec === '') return this.negative;
    if (_valDec === '') return !this.negative;

    const length = Math.min(_bigDec.length, _valDec.length);

    for (let i  = 0; i < length; i++){
      if (parseInt(_bigDec[i]) < parseInt(_valDec[i])) return this.negative;
      if (parseInt(_bigDec[i]) > parseInt(_valDec[i])) return !this.negative;
    }

    if (_bigDec.length < _valDec.length) return this.negative;
    if (_bigDec.length > _valDec.length) return !this.negative;
    
    return true;
  }

  gt(big: BigNumber | BigNumberData){
    const _big = BigNumber.from(big)
    let { int: _bigInt, dec: _bigDec } = _big, { int: _valInt, dec: _valDec } = this;

    if (this.negative && !_big.negative) return false;
    if (!this.negative && _big.negative) return true;

    _valInt = _valInt.replace('-', '');
    _bigInt = _bigInt.replace('-', '');

    if (_bigInt.length > _valInt.length) return this.negative;
    if (_bigInt.length < _valInt.length) return !this.negative;

    for (let i = 0; i < _bigInt.length; i++){
      if (parseInt(_bigInt[i]) > parseInt(_valInt[i])) return this.negative;
      if (parseInt(_bigInt[i]) < parseInt(_valInt[i])) return !this.negative;
    }

    if (_bigDec === '' && _valDec === '') return false;
    if (_bigDec === '') return !this.negative;
    if (_valDec === '') return this.negative;

    const length = Math.min(_bigDec.length, _valDec.length);

    for (let i  = 0; i < length; i++){
      if (parseInt(_bigDec[i]) > parseInt(_valDec[i])) return this.negative;
      if (parseInt(_bigDec[i]) < parseInt(_valDec[i])) return !this.negative;
    }

    if (_bigDec.length > _valDec.length) return this.negative;
    if (_bigDec.length < _valDec.length) return !this.negative;
    
    return false;
  }

  gte(big: BigNumber | BigNumberData){
    const _big = BigNumber.from(big)
    let { int: _bigInt, dec: _bigDec } = _big, { int: _valInt, dec: _valDec } = this;

    if (this.negative && !_big.negative) return false;
    if (!this.negative && _big.negative) return true;

    _valInt = _valInt.replace('-', '');
    _bigInt = _bigInt.replace('-', '');

    if (_bigInt.length > _valInt.length) return this.negative;
    if (_bigInt.length < _valInt.length) return !this.negative;

    for (let i = 0; i < _bigInt.length; i++){
      if (parseInt(_bigInt[i]) > parseInt(_valInt[i])) return this.negative;
      if (parseInt(_bigInt[i]) < parseInt(_valInt[i])) return !this.negative;
    }

    if (_bigDec === '' && _valDec === '') return true;
    if (_bigDec === '') return !this.negative;
    if (_valDec === '') return this.negative;

    const length = Math.min(_bigDec.length, _valDec.length);

    for (let i  = 0; i < length; i++){
      if (parseInt(_bigDec[i]) > parseInt(_valDec[i])) return this.negative;
      if (parseInt(_bigDec[i]) < parseInt(_valDec[i])) return !this.negative;
    }

    if (_bigDec.length > _valDec.length) return this.negative;
    if (_bigDec.length < _valDec.length) return !this.negative;
    
    return true;
  }

  abs(){
    return BigNumber.from(this.value.toString().replace('-', ''));
  }

  add(...bigs: Array<BigNumber | BigNumberData>){
    function addInt(a: string, b: string, decimal = true, addNext = false): [ string, boolean ]{
      const lengthA = a.length
      , lengthB = b.length
      , agb = lengthA > lengthB
      , upZero = Math.abs(lengthA - lengthB)
      , zeroA = agb ? '' : '0'.repeat(upZero)
      , zeroB = agb ? '0'.repeat(upZero) : ''
      , valA = Array.from((!decimal ? zeroA : '') + a + (decimal ? zeroA : '')).reverse()
      , valB = Array.from((!decimal ? zeroB : '') + b + (decimal ? zeroB : '')).reverse()
      , rs: Array<number | string> = [];

      let localAddNext = addNext;

      valA.forEach((val, index) => {
        let charVal = parseInt(val) + parseInt(valB[index]);
        if (localAddNext) charVal += 1;

        rs.push(charVal % 10);
        localAddNext = (charVal > 10);
      });

      return [rs.reverse().join(''), localAddNext];
    }

    function minusInt(a: string, b: string, decimal = true, giveBack = false): [ string, boolean ]{
      const lengthA = a.length
      , lengthB = b.length
      , agb = lengthA > lengthB
      , upZero = Math.abs(lengthA - lengthB)
      , zeroA = agb ? '' : '0'.repeat(upZero)
      , zeroB = agb ? '0'.repeat(upZero) : ''
      , valA = Array.from((!decimal ? zeroA : '') + a + (decimal ? zeroA : '')).reverse()
      , valB = Array.from((!decimal ? zeroB : '') + b + (decimal ? zeroB : '')).reverse()
      , rs: Array<number | string> = [];

      let localGiveBack = giveBack;

      valA.forEach((val, index) => {
        let charA = parseInt(val), charB = parseInt(valB[index]);
        
        localGiveBack && ++charB;
        localGiveBack = charA < charB;
        localGiveBack && (charA += 10);

        rs.push(charA - charB);
      });

      return [rs.reverse().join(''), localGiveBack];
    }
    
    function addSingle(a: string, b: string){
      const aNegative = !!a.match(/^-/), bNegative = !!b.match(/^-/)
      , oneNegative = ((aNegative && !bNegative) || (!aNegative && bNegative));

      if (oneNegative){
        const c = a;
        a = aNegative ? b : a;
        b = aNegative ? c : b;
      }

      const [ intA, decA ] = a.replace('-', '').split('.')
      , [ intB, decB ] = b.replace('-', '').split('.')
      , fn = oneNegative ? minusInt : addInt;

      let extra = false, rsDec = '', rsInt;

      if (decA !== undefined){
        if (decB !== undefined){
          [ rsDec, extra ] = fn(decA, decB);
        }
        else{
          rsDec = decA;
        }
      }
      else if (decB !== undefined){
        [ rsDec, extra ] = fn('0', decB);
      }

      [ rsInt, extra ] = fn(intA, intB, false, extra);

      extra && (rsInt = `${ oneNegative ? '-9' : '' }${ rsInt }`);
      const existDec = (decA !== undefined || decB !== undefined);

      return `${ aNegative && !oneNegative ? '-' : '' }${ rsInt }${ existDec ? '.' + rsDec : '' }`
    }

    let rs = this.toString();

    bigs.forEach(value => {
      const _value = BigNumber.from(value).toString();
      rs = addSingle(rs, _value);
    });

    return BigNumber.from(rs);
  }

  toString(){
    return this._value.toString();
  }

  format(options?: BigNumberFormatOptions){
    return BigNumber.format(this._value, options);
  }

  revert(value: string){
    return BigNumber.revert(value);
  }

  revertFormat(value: string){
    return BigNumber.revertFormat(value);
  }

  revertComma(value: string){
    return BigNumber.revertComma(value);
  }

  match(value: BigNumberData){
    return BigNumber.match(value);
  }

  isMatch(value: BigNumberData){
    return BigNumber.isMatch(value);
  }

  isNumber(value: BigNumberData){
    return BigNumber.isNumber(value);
  }

  isInt(value: BigNumberData){
    return BigNumber.isInt(value);
  }

  isFormat(value: string){
    return BigNumber.isFormat(value);
  }

  isComma(value: string){
    return BigNumber.isComma(value);
  }

  isOutOfMax(value: BigNumberData){
    return BigNumber.isOutOfMax(value);
  }

  isOutOfMin(value: BigNumberData){
    return BigNumber.isOutOfMin(value);
  }

  static from(value: BigNumber | BigNumberData){
    if (value instanceof BigNumber) return value;
    return new this(value);
  }

  static format(value: BigNumberData, options?: BigNumberFormatOptions){
    const _value = this.from(value).toString();
    if (!_value) return _value;

    const arr = _value.split('.');
    const existDec = arr.length > 1;

    const [ _int, _dec ] = arr;
    if (_int.length < 4) return _value;

    const { comma, decimal = true, trim } = options ?? {};
    const separator = comma ? ',' : '.';
    let formatted;

    if (_int.length < 16){
      formatted = new Intl.NumberFormat(comma ? 'de-DE': 'en-EN').format(+_int);
    }
    else{
      formatted = Array.from(_int)
        .reverse()
        .map((char, index) => index % 3 === 2 ? `,${ char }` : char)
        .reverse()
        .join('')
        .replace(/^,/, '');
  
      if (comma) formatted = formatted.replace(/,/g, '.');
    }
  
    const trimDecimal = (decimal === false || decimal <= 0);
    const addDecimal = existDec && !trimDecimal && (!trim || _dec.length);
    const decimalVal = _dec.substring(0, typeof decimal === 'number' ? decimal : undefined);
  
    formatted = [ formatted ].concat(addDecimal ? [ decimalVal ] : []).join(separator);
    return formatted;
  }

  static revert(value: string){
    if (!this.isMatch(value)) return NaN;
    if (this.isFormat(value)) return this.revertFormat(value);
    if (this.isComma(value)) return this.revertComma(value);
    return value;
  }

  static revertFormat(value: string){
    if (!this.isFormat(value)) return NaN;
    return value.replace(/,/g, '');
  }

  static revertComma(value: string){
    if (!this.isComma(value)) return NaN;
    return value.replace(/\./g, '').replace(',', '.');
  }

  static match(value: BigNumberData){
    return value.toString().match(/^-?(\d*\.?)\d*/);
  }

  static isMatch(value: BigNumberData){
    return this.isNumber(value)
    || this.isFormat(value.toString())
    || this.isComma(value.toString());
  }

  static isNumber(value: BigNumberData){
    return !!this.match(value);
  }

  static isInt(value: BigNumberData){
    return !!value.toString().match(/^-?\d+$/);
  }

  static isFormat(value: string){
    return !!value.match(/^-?\d{1,3}(,\d{3})*(\.\d*)?$/);
  }

  static isComma(value: string){
    return !!value.match(/^-?\d{1,3}(\.\d{3})*(,\d*)?$/);
  }

  static isOutOfMax(value: BigNumberData){
    return parseFloat(value.toString()) > BigNumber.MAX_VALUE; 
  }

  static isOutOfMin(value: BigNumberData){
    return parseFloat(value.toString()) < BigNumber.MAX_VALUE; 
  }

}

export default BigNumber;